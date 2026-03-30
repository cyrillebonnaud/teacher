import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";

const SCREENSHOTS_DIR = "tests/screenshots";
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function shot(page: Page, name: string) {
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}.png`, fullPage: true });
}

/** Sets the session cookie directly via test API (bypasses form timing issues). */
async function loginDirect(page: Page, code: string): Promise<{ type: string; id: string }> {
  const res = await page.request.post("/api/test/session", { data: { code } });
  const data = await res.json();
  if (!res.ok()) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  return data;
}

async function loginParent(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await loginDirect(page, "CYRILLE");
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

async function loginChild(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  const data = await loginDirect(page, "EMILE");
  await page.goto(`/children/${data.id}`);
  await page.waitForLoadState("networkidle");
}

// ──────────────────────────────────────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Login", () => {
  test("login page screenshot", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await shot(page, "01-login-page");
  });

  test("login parent CYRILLE → dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="code"]', "CYRILLE");
    await shot(page, "02-login-cyrille-filled");
    await page.click('button[type="submit"]');
    // Use toHaveURL with explicit timeout to wait for client-side navigation
    await expect(page).toHaveURL("/", { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await shot(page, "03-dashboard-parent");
  });

  test("login enfant EMILE → vue enfant", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="code"]', "EMILE");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/children\//, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await shot(page, "04-child-view-emile");
  });

  test("code invalide → message d'erreur", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="code"]', "INVALID99");
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Code d'accès invalide")).toBeVisible();
    await shot(page, "05-login-error");
  });

  test("déconnexion → redirect /login", async ({ page }) => {
    await loginParent(page);
    await page.click('button:has-text("Déconnexion")');
    await expect(page).toHaveURL("/login", { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await shot(page, "06-logout");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard parent
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Dashboard parent", () => {
  test("dashboard affiché avec section Mes enfants", async ({ page }) => {
    await loginParent(page);
    await expect(page.locator("h1")).toContainText("Mes enfants");
    await shot(page, "07-dashboard-children");
  });

  test("ajout enfant TestE2E → code généré affiché", async ({ page }) => {
    await loginParent(page);
    // Wait for React hydration of the client component
    const addBtn = page.locator("button", { hasText: "Ajouter un enfant" });
    await addBtn.waitFor({ state: "visible", timeout: 10000 });
    await shot(page, "08-dashboard-before-add");
    await addBtn.click();
    await page.waitForLoadState("networkidle");
    await shot(page, "09-add-child-form");

    await page.fill('input[placeholder="ex. Lucas"]', "TestE2E");
    const levelBtn = page.locator("button", { hasText: "4e" }).first();
    await levelBtn.click();
    await shot(page, "10-add-child-filled");

    await page.click('button:has-text("Créer")');
    await page.waitForLoadState("networkidle");

    const codeEl = page.locator(".font-mono.font-bold.text-green-800");
    await codeEl.waitFor({ state: "visible", timeout: 10000 });
    const code = await codeEl.textContent();
    expect(code?.length).toBe(6);
    await shot(page, "11-add-child-code-generated");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Vue enfant
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Vue enfant", () => {
  test("login direct enfant EMILE → vue séquences", async ({ page }) => {
    await loginChild(page);
    await expect(page).toHaveURL(/\/children\//);
    await shot(page, "12-child-direct-view");
  });

  test("parent clic premier enfant disponible → page détail", async ({ page }) => {
    await loginParent(page);
    // Click the first child link if any exist
    const firstChildLink = page.locator("a[href^='/children/']").first();
    const count = await firstChildLink.count();
    if (count > 0) {
      await firstChildLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/children\//);
      await shot(page, "13-child-detail-from-parent");
    } else {
      // No children yet — screenshot the empty state
      await shot(page, "13-dashboard-no-children");
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Funnel création séquence
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Funnel création séquence", () => {
  test("parcours complet step by step", async ({ page }) => {
    await loginParent(page);
    await page.goto("/sequences/new");
    await page.waitForLoadState("networkidle");
    await shot(page, "14-funnel-step0-enfant");

    // Step 0: select first available child (or screenshot empty state)
    const childButtons = page.locator("button").filter({ hasText: /^[A-Z]/ });
    const childCount = await page.locator("button[type='button']").count();
    const firstChild = page.locator("div.space-y-2 button[type='button']").first();
    const hasChildren = (await firstChild.count()) > 0;

    if (hasChildren) {
      await firstChild.click();
      // Step 0 advances automatically to step 1
      await page.waitForLoadState("networkidle");
      await shot(page, "15-funnel-step1-matiere");

      // Step 1: select Mathématiques
      await page.locator("button[type='button']", { hasText: "Mathématiques" }).click();
      // Advances automatically to step 2
      await page.waitForLoadState("networkidle");
      await shot(page, "16-funnel-step2-titre");

      // Step 2: fill title
      await page.fill('input[type="text"]', "Séquence E2E");
      await shot(page, "17-funnel-step2-filled");
      await page.locator("button", { hasText: "Suivant" }).click();
      await page.waitForLoadState("networkidle");
      await shot(page, "18-funnel-step3-niveau");

      // Step 3: select Moyen level (auto-advances to step 4)
      await page.locator("button[type='button']", { hasText: "Moyen" }).click();
      await page.waitForLoadState("networkidle");
      await shot(page, "19-funnel-step4-options");

      // Step 4: select 10 questions (auto-advances to step 5)
      await page.locator("button[type='button']", { hasText: "10" }).first().click();
      await page.waitForLoadState("networkidle");
      await shot(page, "20-funnel-step5-docs");

      // Step 5: skip docs
      await page.locator("button", { hasText: /Passer|Suivant/ }).click();
      await page.waitForLoadState("networkidle");
      await shot(page, "21-funnel-step6-recap");
    } else {
      // No children → screenshot the empty state
      await shot(page, "14b-funnel-no-children");
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Programmes
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Programmes", () => {
  test("grille cartes matières", async ({ page }) => {
    await loginParent(page);
    await page.goto("/programmes");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Programmes");
    await shot(page, "22-programmes-grid");
  });

  test("recherche full-text proportionnalité", async ({ page }) => {
    await loginParent(page);
    await page.goto("/programmes");
    await page.waitForLoadState("networkidle");
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill("proportionnalité");
    await page.locator('button:has-text("Chercher")').click();
    // Wait for URL to update (router.push navigates to /programmes?q=...)
    await page.waitForURL(/\/programmes\?/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await shot(page, "23-programmes-search");
    // Check results are shown (either found or "Aucun résultat for...")
    const hasResults = (await page.locator("mark").count()) > 0;
    const hasNoResults = (await page.locator("text=Aucun résultat").count()) > 0;
    expect(hasResults || hasNoResults).toBeTruthy();
  });

  test("vue détaillée premier programme", async ({ page }) => {
    await loginParent(page);
    await page.goto("/programmes");
    await page.waitForLoadState("networkidle");

    // Click on first programme card/link
    const firstProgramme = page.locator("a[href^='/programmes/']").first();
    const count = await firstProgramme.count();
    if (count > 0) {
      await firstProgramme.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/programmes\//);
      await shot(page, "24-programme-detail");
    } else {
      await shot(page, "24-programmes-empty");
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Cleanup: supprimer l'enfant TestE2E (best-effort)
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Cleanup", () => {
  test("supprimer enfant TestE2E via API test (best-effort)", async ({ page }) => {
    await loginParent(page);
    try {
      const response = await page.request.delete("/api/test/child", {
        data: { firstName: "TestE2E" },
      });
      expect([200, 204, 404, 405]).toContain(response.status());
    } catch {
      // no test cleanup API — skip silently
    }
  });
});

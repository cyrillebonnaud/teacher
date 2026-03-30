import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, code = "CYRILLE") {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.fill('input[name="code"]', code);
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");
}

async function logout(page: Page) {
  await page.click('button[type="submit"]:has-text("Déconnexion")');
  await page.waitForURL("/login");
}

// ──────────────────────────────────────────────────────────────────────────────
// 8.1 Login
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Login", () => {
  test("code valide → dashboard", async ({ page }) => {
    await login(page, "CYRILLE");
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Mes enfants");
  });

  test("code invalide → message d'erreur", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="code"]', "INVALID99");
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Code d'accès invalide")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("code case-insensitive", async ({ page }) => {
    await login(page, "cyrille");
    await expect(page).toHaveURL("/");
  });

  test("route protégée sans session → redirect /login", async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("déconnexion → redirect /login", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL("/");
    await logout(page);
    await expect(page).toHaveURL("/login");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 8.2 Ajout enfant
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Gestion des enfants", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("ajouter un enfant → code généré affiché", async ({ page }) => {
    await page.click("text=Ajouter un enfant");
    await page.fill('input[placeholder="ex. Lucas"]', "TestEnfant");
    // Select 4e level
    await page.click("button:has-text('4e')");
    await page.click('button:has-text("Créer")');
    await page.waitForLoadState("networkidle");

    // The generated code should appear
    const codeEl = page.locator(".font-mono.font-bold.text-green-800");
    await expect(codeEl).toBeVisible();
    const code = await codeEl.textContent();
    expect(code?.length).toBe(6);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 8.3 Programmes
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Navigateur programmes", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("page programmes charge les programmes 5e par défaut", async ({ page }) => {
    await page.goto("/programmes");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Programmes officiels");
    // Should show 5e programmes
    await expect(page.locator("text=Mathématiques — 5e")).toBeVisible();
  });

  test("changement de niveau", async ({ page }) => {
    await page.goto("/programmes");
    await page.click("button:has-text('4e')");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Mathématiques — 4e")).toBeVisible();
  });

  test("recherche full-text", async ({ page }) => {
    await page.goto("/programmes");
    await page.fill('input[placeholder*="Rechercher"]', "proportionnalité");
    await page.click('button:has-text("Chercher")');
    await page.waitForLoadState("networkidle");
    // Should show the maths programme which contains "proportionnalité"
    await expect(page.locator("mark:has-text('proportionnalité')").first()).toBeVisible();
  });

  test("recherche sans résultat", async ({ page }) => {
    await page.goto("/programmes");
    await page.fill('input[placeholder*="Rechercher"]', "xyztermeintrouvable99");
    await page.click('button:has-text("Chercher")');
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Aucun résultat")).toBeVisible();
  });

  test("vue détaillée d'un programme", async ({ page }) => {
    await page.goto("/programmes");
    await page.click("text=Mathématiques — 5e");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/programmes\//);
    await expect(page.locator("h1")).toContainText("Mathématiques — 5e");
  });
});

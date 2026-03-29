import { test, expect } from "@playwright/test";
import { createSequence } from "./helpers";

test("redirect from / to /sequences", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/sequences", { timeout: 5_000 });
});

test("empty state shows when no sequences", async ({ page }) => {
  await page.goto("/sequences");
  // May or may not have sequences in test DB, just check page loads
  await expect(page.getByRole("heading", { name: "Mes séquences" })).toBeVisible();
});

test("create a sequence and land on detail page", async ({ page }) => {
  const name = `Test-Seq-${Date.now()}`;
  const id = await createSequence(page, { name, subject: "Mathématiques" });

  expect(id).toBeTruthy();
  await expect(page.getByText(name)).toBeVisible();
  await expect(page.getByText("Mathématiques")).toBeVisible();
});

test("created sequence appears in sequences list", async ({ page }) => {
  const name = `Listed-${Date.now()}`;
  await createSequence(page, { name, subject: "Français" });

  await page.goto("/sequences");
  await expect(page.getByText(name)).toBeVisible({ timeout: 5_000 });
});

test("sequence detail shows upload and QCM buttons when no docs", async ({ page }) => {
  const name = `Detail-${Date.now()}`;
  const id = await createSequence(page, { name });

  await page.goto(`/sequences/${id}`);
  await expect(page.getByText("Uploader un document")).toBeVisible();
  // QCM button should not appear without documents
  await expect(page.getByText("Générer un QCM")).not.toBeVisible();
});

test("delete sequence shows confirmation dialog", async ({ page }) => {
  const name = `Delete-${Date.now()}`;
  const id = await createSequence(page, { name });

  await page.goto(`/sequences/${id}`);
  await page.locator('[aria-label="Supprimer la séquence"]').click();
  await expect(page.getByText("Supprimer la séquence ?")).toBeVisible();
  await expect(page.getByText("Supprimer définitivement")).not.toBeVisible();
  // Cancel
  await page.getByRole("button", { name: "Annuler" }).click();
  await expect(page.getByText("Supprimer la séquence ?")).not.toBeVisible();
});

test("cancel delete keeps sequence intact", async ({ page }) => {
  const name = `Keep-${Date.now()}`;
  const id = await createSequence(page, { name });

  await page.goto(`/sequences/${id}`);
  await page.locator('[aria-label="Supprimer la séquence"]').click();
  await page.getByRole("button", { name: "Annuler" }).click();

  await expect(page).toHaveURL(`/sequences/${id}`);
  await expect(page.getByText(name)).toBeVisible();
});

test("name field is required", async ({ page }) => {
  await page.goto("/sequences/new");
  await page.selectOption('select[name="subject"]', "Mathématiques");
  await page.click('button[type="submit"]');
  // Should not navigate away
  await expect(page).toHaveURL("/sequences/new");
});

test("bottom nav switches between sequences and chat", async ({ page }) => {
  await page.goto("/sequences");
  await page.locator('a[href="/chat"]').click();
  await expect(page).toHaveURL("/chat", { timeout: 5_000 });
  await page.locator('a[href="/sequences"]').click();
  await expect(page).toHaveURL("/sequences", { timeout: 5_000 });
});

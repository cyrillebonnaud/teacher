import { test, expect } from "@playwright/test";
import { createSequence } from "./helpers";

test("redirect from / to /sequences", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/sequences", { timeout: 5_000 });
});

test("empty state shows when no sequences", async ({ page }) => {
  await page.goto("/sequences");
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

test("sequence detail shows QCM button (always has topic from funnel)", async ({ page }) => {
  const name = `Detail-${Date.now()}`;
  const id = await createSequence(page, { name });

  await page.goto(`/sequences/${id}`);
  await expect(page.getByText("Générer un QCM")).toBeVisible();
});

test("delete sequence shows confirmation dialog", async ({ page }) => {
  const name = `Delete-${Date.now()}`;
  const id = await createSequence(page, { name });

  await page.goto(`/sequences/${id}`);
  await page.locator('[aria-label="Supprimer la séquence"]').click();
  await expect(page.getByText("Supprimer la séquence ?")).toBeVisible();
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

test("funnel step 1 shows subject cards", async ({ page }) => {
  await page.goto("/sequences/new");
  await expect(page.getByText("Mathématiques")).toBeVisible();
  await expect(page.getByText("Français")).toBeVisible();
  await expect(page.getByText("Histoire-Géographie")).toBeVisible();
});

test("funnel cannot advance step 1 without selecting a subject", async ({ page }) => {
  await page.goto("/sequences/new");
  const nextBtn = page.getByRole("button", { name: "Suivant →" });
  await expect(nextBtn).toBeDisabled();
});

test("funnel cannot advance step 2 without description", async ({ page }) => {
  await page.goto("/sequences/new");
  // Select a subject
  await page.getByText("Mathématiques").click();
  await page.getByRole("button", { name: "Suivant →" }).click();
  // Step 2 — next button should be disabled without description
  const nextBtn = page.getByRole("button", { name: "Suivant →" });
  await expect(nextBtn).toBeDisabled();
});

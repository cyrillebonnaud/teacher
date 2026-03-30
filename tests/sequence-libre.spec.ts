import { test, expect } from "@playwright/test";

test("unified form shows subject, description, attachments, level, question count", async ({ page }) => {
  await page.goto("/sequences/new");

  await expect(page.locator('select[name="subject"]')).toBeVisible();
  await expect(page.locator('textarea[name="description"]')).toBeVisible();
  await expect(page.locator('input[name="files"]')).toBeAttached();
  // 5 level buttons
  await expect(page.getByText("Débutant")).toBeVisible();
  await expect(page.getByText("Expert")).toBeVisible();
  // 3 question count buttons
  await expect(page.getByRole("button", { name: "10" })).toBeVisible();
  await expect(page.getByRole("button", { name: "20" })).toBeVisible();
  await expect(page.getByRole("button", { name: "30" })).toBeVisible();
});

test("description is required", async ({ page }) => {
  await page.goto("/sequences/new");
  await page.selectOption('select[name="subject"]', "Mathématiques");
  // Don't fill description
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/sequences/new");
});

test("subject is required", async ({ page }) => {
  await page.goto("/sequences/new");
  await page.fill('textarea[name="description"]', "les fractions");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/sequences/new");
});

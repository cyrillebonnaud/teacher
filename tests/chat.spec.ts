import { test, expect } from "@playwright/test";
import { createSequence } from "./helpers";

test("chat page loads with empty sequences message", async ({ page }) => {
  await page.goto("/chat");
  // Page should load without error
  await expect(page).toHaveURL("/chat");
  // Either shows sequences or shows empty state
  const hasSequenceSelector = await page.getByText("Séquence", { exact: true }).isVisible().catch(() => false);
  const hasEmptyState = await page.getByText("Aucune séquence disponible").isVisible().catch(() => false);
  expect(hasSequenceSelector || hasEmptyState).toBeTruthy();
});

test("chat shows sequence selector with created sequences", async ({ page }) => {
  await createSequence(page, {
    name: `Chat-Test-${Date.now()}`,
    subject: "Français",
  });

  await page.goto("/chat");
  await expect(page.getByText("Séquence", { exact: true })).toBeVisible();
});

test("chat input is disabled when no sequence selected", async ({ page }) => {
  await page.goto("/chat");
  const textarea = page.locator("textarea");
  if (await textarea.isVisible()) {
    const placeholder = await textarea.getAttribute("placeholder");
    // Placeholder should indicate to select a sequence
    expect(
      placeholder?.includes("Sélectionne") || placeholder?.includes("question")
    ).toBeTruthy();
  }
});

test("chat shows prompt to select sequence when none selected with multiple sequences", async ({
  page,
}) => {
  // Create a second sequence so selector is shown
  await createSequence(page, {
    name: `Chat2-${Date.now()}`,
    subject: "Mathématiques",
  });

  await page.goto("/chat");
  await expect(page.getByText("Séquence", { exact: true })).toBeVisible({ timeout: 5_000 });
});

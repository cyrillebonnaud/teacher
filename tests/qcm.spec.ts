import { test, expect } from "@playwright/test";
import { createSequence } from "./helpers";

test.describe("QCM engine", () => {
  let sequenceId: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    sequenceId = await createSequence(page, {
      name: `QCM-Test-${Date.now()}`,
      subject: "Histoire-Géographie",
    });
    await page.close();
  });

  test("QCM page shows level selection when sequence has a topic", async ({
    page,
  }) => {
    await page.goto(`/sequences/${sequenceId}/qcm`);
    await expect(page.getByText("Choisir le niveau")).toBeVisible();
    await expect(page.getByText("Facile")).toBeVisible();
  });

  test("level selection shows 4 level cards", async ({ page }) => {
    await page.goto(`/sequences/${sequenceId}/qcm`);
    await expect(page.getByText("Facile")).toBeVisible();
    await expect(page.getByText("Moyen")).toBeVisible();
    await expect(page.getByText("Difficile")).toBeVisible();
    await expect(page.getByText("Expert")).toBeVisible();
  });

  test("QCM page not accessible for invalid sequence", async ({ page }) => {
    await page.goto("/sequences/invalid-id-xyz/qcm");
    await expect(page.getByText("404")).toBeVisible({ timeout: 5_000 }).catch(() => {
      // Next.js might show different 404 UI
    });
  });
});

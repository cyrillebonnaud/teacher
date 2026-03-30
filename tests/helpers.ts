import { type Page } from "@playwright/test";

/**
 * Creates a sequence directly via test API (bypasses IPC/QCM for fast test setup).
 * Returns the sequence ID and navigates to the detail page.
 */
export async function createSequence(
  page: Page,
  options: {
    name?: string;
    subject?: string;
  } = {}
): Promise<string> {
  const response = await page.request.post("/api/test/sequence", {
    data: {
      name: options.name ?? `Séquence-${Date.now()}`,
      subject: options.subject ?? "Mathématiques",
    },
  });

  const { id } = await response.json();
  await page.goto(`/sequences/${id}`);
  return id;
}

export async function goToSequence(page: Page, sequenceId: string) {
  await page.goto(`/sequences/${sequenceId}`);
  await page.waitForLoadState("networkidle");
}

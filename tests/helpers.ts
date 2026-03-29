import { type Page } from "@playwright/test";

export async function createSequence(
  page: Page,
  options: {
    name: string;
    subject?: string;
    emoji?: string;
  }
): Promise<string> {
  await page.goto("/sequences/new");
  await page.fill('input[name="name"]', options.name);

  if (options.subject) {
    await page.selectOption('select[name="subject"]', options.subject);
  } else {
    await page.selectOption('select[name="subject"]', "Mathématiques");
  }

  if (options.emoji) {
    await page.locator(`input[name="emoji"][value="${options.emoji}"]`).check();
  }

  await page.click('button[type="submit"]');
  // Wait for redirect to the new sequence detail page (not the /new form)
  await page.waitForURL(
    (url) =>
      /\/sequences\/[a-z0-9]+$/.test(url.pathname) &&
      !url.pathname.endsWith("/new"),
    { timeout: 10_000 }
  );

  const url = page.url();
  return url.split("/sequences/")[1];
}

export async function goToSequence(page: Page, sequenceId: string) {
  await page.goto(`/sequences/${sequenceId}`);
  await page.waitForLoadState("networkidle");
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return (data.text || "").trim();
  } catch {
    return "";
  }
}

export function isSubstantialText(text: string): boolean {
  // Consider text substantial if it has more than 100 non-whitespace characters
  return text.replace(/\s/g, "").length > 100;
}

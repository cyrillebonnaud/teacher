import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not defined. Add it to your .env.local file."
    );
  }
  return new Anthropic({ apiKey });
}

function log(type: string, data: Record<string, unknown>) {
  console.log(`[claude:${type}]`, JSON.stringify(data));
}

/** Non-streaming text response from Claude */
export async function claudeText(
  prompt: string,
  opts: { systemPrompt?: string } = {}
): Promise<string> {
  const client = getClient();
  log("text:req", { model: MODEL, promptLen: prompt.length });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    ...(opts.systemPrompt ? { system: opts.systemPrompt } : {}),
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  log("text:res", { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, stopReason: response.stop_reason });
  return block.text;
}

/** Structured JSON response from Claude, validated against schema */
export async function claudeJson<T>(
  prompt: string,
  _schema: object,
  opts: { systemPrompt?: string } = {}
): Promise<T> {
  const client = getClient();
  log("json:req", { model: MODEL, promptLen: prompt.length });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    ...(opts.systemPrompt ? { system: opts.systemPrompt } : {}),
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  log("json:res", { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, stopReason: response.stop_reason });

  // Strip markdown code fences (remove any line starting with ```)
  const raw = block.text
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("```"))
    .join("\n")
    .trim();

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Failed to parse Claude JSON response: ${raw.slice(0, 200)}`);
  }
}

/** Extract text from a file buffer using Claude vision */
export async function claudeVision(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const client = getClient();
  const base64 = buffer.toString("base64");
  log("vision:req", { model: MODEL, filename, mimeType, bytes: buffer.length });

  const textPrompt = `Tu travailles sur un document scolaire : ${filename}\n\nExtrais tout le contenu textuel de ce document : texte imprimé, annotations manuscrites du professeur (indique-les avec [Annotation prof :]), schémas décrits brièvement, tableaux. Retourne uniquement le contenu final sans commentaire ni en-tête.`;

  const isPdf = mimeType === "application/pdf";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileBlock: any = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
    : { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } };

  const params = {
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user" as const, content: [fileBlock, { type: "text" as const, text: textPrompt }] }],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = isPdf
    ? await (client.beta as any).messages.create({ ...params, betas: ["pdfs-2024-09-25"] })
    : await client.messages.create(params);

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude vision");
  log("vision:res", { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens });
  return block.text;
}

/** Streaming text response from Claude as a ReadableStream */
export function claudeStream(
  prompt: string,
  opts: { systemPrompt?: string } = {}
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const client = getClient();
        log("stream:req", { model: MODEL, promptLen: prompt.length });
        const stream = await client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          ...(opts.systemPrompt ? { system: opts.systemPrompt } : {}),
          messages: [{ role: "user", content: prompt }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        log("stream:res", { inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens, stopReason: final.stop_reason });
        controller.close();
      } catch (e) {
        log("stream:err", { error: String(e) });
        controller.error(e);
      }
    },
  });
}

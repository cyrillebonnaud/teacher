import { anthropic, MODEL } from "@/lib/claude";
import { buildChatSystemPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { sequenceId, messages } = await req.json();

  if (!sequenceId) {
    return new Response("sequenceId requis", { status: 400 });
  }

  const documents = await prisma.document.findMany({
    where: { sequenceId },
    orderBy: { createdAt: "asc" },
    select: { rawText: true },
  });

  const documentTexts = documents
    .map((d) => d.rawText)
    .filter((t) => t.trim().length > 0);

  const sequence = await prisma.sequence.findUnique({
    where: { id: sequenceId },
    select: { name: true },
  });

  const systemPrompt = buildChatSystemPrompt(
    sequence?.name ?? "cette séquence",
    documentTexts
  );

  const stream = await anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

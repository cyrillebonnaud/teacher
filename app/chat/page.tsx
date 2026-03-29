import { prisma } from "@/lib/db";
import ChatClient from "./chat-client";

export default async function ChatPage() {
  const sequences = await prisma.sequence.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { documents: true } } },
  });

  return <ChatClient sequences={sequences} />;
}

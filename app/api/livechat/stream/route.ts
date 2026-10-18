import { NextRequest } from "next/server";
import { sseClients } from "../message/route";

// SSE stream endpoint — client connects with EventSource
// Usage: new EventSource(`/api/livechat/stream?sessionId=<id>`)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("sessionId query param required", { status: 400 });
  }

  let controller: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
      if (!sseClients.has(sessionId)) {
        sseClients.set(sessionId, new Set());
      }
      sseClients.get(sessionId)!.add(controller);

      // Keep-alive ping every 20s
      const ping = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": ping\n\n"));
        } catch {
          clearInterval(ping);
        }
      }, 20000);
    },
    cancel() {
      const clientSet = sseClients.get(sessionId);
      if (clientSet) {
        clientSet.delete(controller);
        if (clientSet.size === 0) {
          sseClients.delete(sessionId);
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}



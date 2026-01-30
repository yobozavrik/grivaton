import { NextResponse } from "next/server";

type ErrorResponse = {
  error: string;
};

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json<ErrorResponse>(
      { error: "N8N_WEBHOOK_URL is not set" },
      { status: 500 }
    );
  }

try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!webhookResponse.ok) {
      return NextResponse.json<ErrorResponse>(
        { error: `Webhook error: ${webhookResponse.status}` },
        { status: 502 }
      );
    }

    const responseText = await webhookResponse.text();

    if (!responseText) {
      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(responseText, {
      status: 200,
      headers: { "Content-Type": webhookResponse.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return NextResponse.json<ErrorResponse>(
      { error: message },
      { status: 502 }
    );
  }
}

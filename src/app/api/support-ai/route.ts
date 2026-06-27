import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !prompt) {
    return NextResponse.json({
      answer: "Support-AI är inte tillgänglig utan API-nyckel. Kontakta Elliot via mail istället.",
      isLocal: true,
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du är support-AI för Jobbminne. Hjälp användaren med tekniska frågor om appen. Svara på svenska, enkelt och tydligt.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });
    const data = await res.json();
    return NextResponse.json({
      answer: data.choices?.[0]?.message?.content ?? "Inget svar.",
      isLocal: false,
    });
  } catch {
    return NextResponse.json({ answer: "Kunde inte svara.", isLocal: true });
  }
}

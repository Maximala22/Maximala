import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Du är Jobbminne AI.

Du hjälper användaren med praktiska texter, arbetsstöd och Jobbminne.

Du kan hjälpa med:
- skriva mejl
- skriva SMS
- förbättra texter
- skriva arbetsrapporter
- formulera anteckningar
- sammanfatta information
- förklara hur appen fungerar
- hjälpa med jobb, kontakter, fordon, personal, dagsrapporter, kalender, bilder, utskrift och backup

Svara alltid på svenska.
Svara enkelt, tydligt och praktiskt.
Om användaren ber om ett mejl, skriv själva mejlet direkt.
Om användaren ber om SMS, skriv själva SMS:et direkt.
Om användaren ber om en arbetsrapport, skriv rapporten direkt.
Om användaren frågar om appen, förklara steg för steg.
Undvik att bara säga vad du kan hjälpa med.
Appen används internt av Flemströms.`;

function localFallback(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("mejl") || p.includes("mail") || p.includes("e-post")) {
    return `Hej!

Vi vill meddela att vi kommer imorgon och utför markarbete enligt överenskommelse.

Hör av er om ni har frågor.

Med vänliga hälsningar,
Flemströms`;
  }
  if (p.includes("sms")) {
    return "Hej! Vi blir ca 30 minuter sena. Hör av er om det inte passar. /Flemströms";
  }
  if (p.includes("rapport") || p.includes("arbetsrapport")) {
    return `Arbetsrapport
Datum: ${new Date().toLocaleDateString("sv-SE")}
Plats: Handelsvägen 6
Timmar: 8

Utfört arbete:
- Schaktning

Fordon: Volvo EC 250 EL
Personal: Jenny`;
  }
  if (p.includes("förbättra") || p.includes("forbattra")) {
    const text = prompt.split(":").slice(1).join(":").trim();
    return text
      ? `Förbättrad text:\n\n${text}`
      : "Klistra in texten du vill förbättra efter kolon, t.ex. \"Förbättra den här texten: ...\"";
  }
  if (p.includes("app") || p.includes("förklara") || p.includes("forklara") || p.includes("jobbminne")) {
    return `Så här fungerar Jobbminne:

1. Skapa jobb under Jobb → Skapa nytt jobb
2. Skriv dagsrapporter under Fordon & personal
3. Spara anteckningar och bilder under Anteckningar
4. Se vad som saknas under Att kolla
5. Exportera backup regelbundet i Meny`;
  }

  return `Jag kan hjälpa dig skriva mejl, SMS, arbetsrapporter och förklara hur Jobbminne fungerar.

Skriv till exempel:
"Skriv ett mejl till kunden om att vi kommer imorgon."
"Skriv ett SMS att vi blir sena."
"Skriv en arbetsrapport för Jenny, 8 timmar schaktning."`;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    console.log("OPENAI_API_KEY exists:", Boolean(process.env.OPENAI_API_KEY));
  }

  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Tom fråga" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer: localFallback(prompt),
        source: "fallback",
        noApiKey: true,
      });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      if (process.env.NODE_ENV === "development") {
        console.error("OpenAI API error:", res.status);
      }

      let userError = `AI-tjänsten svarade inte just nu (${res.status}). Visar lokalt exempel.`;
      if (res.status === 429 || errorBody.includes("insufficient_quota")) {
        userError =
          "AI-kontot saknar credits/billing. Visar lokalt exempel.";
      }

      return NextResponse.json({
        answer: localFallback(prompt),
        source: "fallback",
        error: userError,
      });
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json({
        answer: localFallback(prompt),
        source: "fallback",
        error: "AI gav inget svar. Visar lokalt exempel.",
      });
    }

    return NextResponse.json({ answer, source: "openai" });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Jobbminne AI error:", err);
    }
    return NextResponse.json({
      answer: "Kunde inte nå AI just nu. Kontrollera nätverket och försök igen.",
      source: "error",
    });
  }
}

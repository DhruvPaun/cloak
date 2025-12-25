import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY!;
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  async function fetchFromGemini(modelName: string) {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.2 },
        }),
      }
    );
  }

  function extractText(data: any) {
    let text = "";
    data?.candidates?.forEach((c: any) =>
      c?.content?.parts?.forEach((p: any) => {
        if (p.text) text += p.text;
      })
    );
    return text || null;
  }

  try {
    // 1️⃣ Primary model
    let res = await fetchFromGemini("gemini-flash-latest");
    let data = await res.json();
    let text = extractText(data);

    // 2️⃣ Fallback model
    if (!text) {
      res = await fetchFromGemini("gemini-flash-lite-latest");
      data = await res.json();
      text = extractText(data);
    }

    if (!text) throw new Error("Gemini returned empty output");

    const suggestions = text
      .split("||")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("All models failed:", error);

    // Hard fallback (never fail UI)
    return NextResponse.json({
      success: false,
      suggestions: [
        "What's something that made you smile today?",
        "If you could instantly learn one skill, what would it be?",
        "What's your favorite way to relax after a long day?",
      ],
    });
  }
}

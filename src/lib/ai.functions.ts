import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MOVIES } from "./movies";

const Input = z.object({ message: z.string().min(1).max(500) });

export const recommendMovies = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const catalog = MOVIES.map((m) => `- ${m.title} (${m.year}, ${m.genre}): ${m.synopsis}`).join("\n");
    const system = `You are M.O.V.I.E-BOT 3000, a retro AI assistant on Netflix.com circa 2006. Reply in a friendly, slightly cheesy dial-up-era tone (short, ALL-CAPS movie titles quoted, use "!" often). Recommend 2-4 movies ONLY from this catalog:\n${catalog}\nAlways name them and give a one-line reason each. Keep the whole response under 120 words.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.message },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI error ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content ?? "(no reply)";
    return { reply };
  });

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AnalysisResultSchema } from "./schema";
import { buildMessages } from "./prompts";
import { AIParseError } from "@/lib/errors";
import type { CanonicalMatch } from "@/types/match";
import type { AudienceLevel, AnalysisMode, AnalysisResult } from "@/types/analysis";

function getOpenAIClient() {
  return new OpenAI();
}

export async function analyzeMatch(
  matchData: CanonicalMatch,
  audienceLevel: AudienceLevel,
  mode: AnalysisMode
): Promise<{ result: AnalysisResult; promptTokens: number; completionTokens: number }> {
  const messages = buildMessages(matchData, audienceLevel, mode);

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: zodResponseFormat(AnalysisResultSchema, "analysis"),
    temperature: 0.3,
    max_tokens: 2000,
  });

  const choice = completion.choices[0];

  if (choice.finish_reason === "length") {
    throw new AIParseError(
      "Analysis exceeded maximum length. Please try again."
    );
  }

  if (choice.message.refusal) {
    throw new AIParseError(
      "The AI could not generate an analysis for this match."
    );
  }

  const rawContent = choice.message.content;
  if (!rawContent) {
    throw new AIParseError("AI returned empty response.");
  }

  const parsed = JSON.parse(rawContent);
  const validated = AnalysisResultSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("AI output validation failed:", validated.error);
    throw new AIParseError("AI response did not match expected schema.");
  }

  return {
    result: validated.data,
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
  };
}

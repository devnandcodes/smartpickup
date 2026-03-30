import { z } from "zod";

export const KeyMomentSchema = z.object({
  minute: z.number().describe("Match minute of the moment"),
  title: z
    .string()
    .describe("Short title, e.g. 'Salah's Clinical Finish'"),
  description: z
    .string()
    .describe(
      "2-4 sentence explanation of what happened and why it mattered tactically. " +
      "Go beyond describing the event — explain the tactical context that created it."
    ),
  impact: z
    .enum(["low", "medium", "high"])
    .describe("How much this moment affected the match outcome"),
  involvedPlayers: z
    .array(z.string())
    .describe("Player names involved in this moment"),
});

export const AnalysisResultSchema = z.object({
  headline: z
    .string()
    .describe(
      "One-sentence match summary, newspaper-headline style, max 120 characters"
    ),
  matchNarrative: z
    .string()
    .describe(
      "3-5 paragraph story of the match: how it unfolded, turning points, final outcome. " +
      "Written for the specified audience level. Weave in statistical context naturally — " +
      "don't just list numbers, explain what they mean for the story."
    ),
  tacticalSummary: z.object({
    homeTeamApproach: z
      .string()
      .describe(
        "2-3 sentences on the home team's tactical approach and how well it worked"
      ),
    awayTeamApproach: z
      .string()
      .describe(
        "2-3 sentences on the away team's tactical approach and how well it worked"
      ),
    keyBattle: z
      .string()
      .describe(
        "The most important tactical battle or matchup in the game and who won it"
      ),
  }),
  xgStory: z
    .string()
    .describe(
      "2-3 sentences explaining the xG narrative: did the scoreline reflect the balance of play? " +
      "Who created better chances? Was anyone clinical or wasteful? " +
      "If xG data is unavailable, use shot data to infer chance quality and state the limitation."
    ),
  keyMoments: z
    .array(KeyMomentSchema)
    .min(2)
    .max(6)
    .describe(
      "The 2-6 most important moments of the match, ordered chronologically"
    ),
  statsInsight: z
    .string()
    .describe(
      "2-3 sentences interpreting the key stats. Focus on what the numbers reveal BEYOND the scoreline. " +
      "Use the pre-analyzed statistical context provided. " +
      "If a stat is null/unavailable, do not fabricate it."
    ),
  playerRatings: z
    .array(
      z.object({
        name: z.string(),
        team: z.string(),
        rating: z.number().min(1).max(10).describe("Rating out of 10"),
        rationale: z
          .string()
          .describe(
            "One sentence justification. Reward tactical contribution, " +
            "not just goals — a midfielder who controlled tempo or a defender " +
            "who neutralized threats deserves recognition."
          ),
      })
    )
    .min(2)
    .max(6)
    .describe("2-6 standout player ratings (best and worst performers)"),
  confidence: z.object({
    level: z
      .enum(["high", "medium", "low"])
      .describe("How confident the analysis is based on data completeness"),
    caveats: z
      .array(z.string())
      .describe(
        "List of caveats, e.g. 'xG data unavailable', 'limited event data', " +
        "'single-match xG — small sample size'"
      ),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type KeyMoment = z.infer<typeof KeyMomentSchema>;

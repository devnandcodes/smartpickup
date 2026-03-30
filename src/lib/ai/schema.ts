import { z } from "zod";

export const KeyMomentSchema = z.object({
  minute: z.number().describe("Match minute of the moment"),
  title: z
    .string()
    .describe("Short title, e.g. 'Salah's Clinical Finish'"),
  description: z
    .string()
    .describe(
      "1-2 sentence explanation of what happened and WHY it mattered. " +
      "Tactical context, not just play-by-play."
    ),
  impact: z
    .enum(["low", "medium", "high"])
    .describe("How much this moment affected the match outcome"),
  involvedPlayers: z
    .array(z.string())
    .describe("Player names involved in this moment"),
});

export const TacticalPatternSchema = z.object({
  name: z
    .string()
    .describe("Short pattern label, e.g. 'Counter-attack through right channel'"),
  description: z
    .string()
    .describe(
      "1-2 sentences describing the pattern and referencing specific events that demonstrate it."
    ),
  frequency: z
    .enum(["isolated", "recurring", "dominant"])
    .describe("How often this pattern appeared"),
});

export const AnalysisResultSchema = z.object({
  // --- TOP PRIORITY: Quick Take (the "bench comments") ---
  headline: z
    .string()
    .describe(
      "One-sentence match summary, newspaper-headline style, max 120 characters"
    ),
  quickTake: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe(
      "2-4 bullet points — the most important takeaways from the match. " +
      "Each bullet is one concise sentence. Ordered by importance. " +
      "A reader who only sees these bullets should understand the match. " +
      "Think: 'the 3 things to tell the bench at half-time.'"
    ),

  // --- NARRATIVE: Expandable depth ---
  matchNarrative: z
    .string()
    .describe(
      "2-3 paragraph story of the match. Keep it tight — no filler. " +
      "Weave in stats naturally. Written for the specified audience level."
    ),

  // --- TACTICAL: Structured for scanning ---
  tacticalSummary: z.object({
    homeTeamApproach: z
      .string()
      .describe("1-2 sentences on the home team's approach and whether it worked"),
    awayTeamApproach: z
      .string()
      .describe("1-2 sentences on the away team's approach and whether it worked"),
    keyBattle: z
      .string()
      .describe("One sentence on the decisive matchup and who won it"),
  }),

  // --- xG: Data story ---
  xgStory: z
    .string()
    .describe(
      "1-2 sentences: did the scoreline reflect the balance of play? " +
      "Who created better chances? Was anyone clinical or wasteful? " +
      "If xG unavailable, use shot data and state the limitation."
    ),

  // --- VULNERABILITIES: Risk/opportunity ---
  vulnerabilities: z.object({
    home: z
      .string()
      .describe(
        "One sentence on the home team's key exposed weakness. " +
        "Be specific: name the area, phase of play, or player matchup."
      ),
    away: z
      .string()
      .describe("One sentence on the away team's key exposed weakness."),
    missedOpportunity: z
      .string()
      .describe(
        "One sentence on the biggest missed opportunity that could have changed the result."
      ),
  }),

  // --- PATTERNS: Recurring behaviors ---
  patterns: z
    .array(TacticalPatternSchema)
    .min(1)
    .max(3)
    .describe(
      "1-3 recurring tactical patterns — repeated behaviors, not isolated incidents."
    ),

  // --- KEY MOMENTS: Timeline ---
  keyMoments: z
    .array(KeyMomentSchema)
    .min(2)
    .max(5)
    .describe(
      "2-5 pivotal moments, ordered chronologically. Only include moments that shifted the match."
    ),

  // --- PLAYER RATINGS: Top performers ---
  playerRatings: z
    .array(
      z.object({
        name: z.string(),
        team: z.string(),
        rating: z.number().min(1).max(10).describe("Rating out of 10"),
        rationale: z
          .string()
          .describe(
            "One sentence. Reward tactical contribution, not just goals."
          ),
      })
    )
    .min(2)
    .max(4)
    .describe("2-4 standout performers only — best and worst."),

  // --- META ---
  confidence: z.object({
    level: z
      .enum(["high", "medium", "low"])
      .describe("Confidence based on data completeness"),
    caveats: z
      .array(z.string())
      .describe("Data gaps, e.g. 'xG unavailable', 'limited event data'"),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type KeyMoment = z.infer<typeof KeyMomentSchema>;
export type TacticalPattern = z.infer<typeof TacticalPatternSchema>;

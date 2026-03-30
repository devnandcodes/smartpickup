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
  vulnerabilities: z.object({
    home: z
      .string()
      .describe(
        "1-2 sentences on the home team's key tactical vulnerability that was exposed or could have been exploited. " +
        "E.g., 'High defensive line left space behind for counter-attacks' or 'Weak pressing in midfield transition allowed easy progression.'"
      ),
    away: z
      .string()
      .describe(
        "1-2 sentences on the away team's key tactical vulnerability."
      ),
    missedOpportunities: z
      .string()
      .describe(
        "1-2 sentences on the biggest missed opportunity in the match — a chance, tactical adjustment, or substitution " +
        "that could have changed the outcome. Be specific about what should have happened differently."
      ),
  }),
  patterns: z
    .array(
      z.object({
        name: z
          .string()
          .describe("Short pattern label, e.g. 'Counter-attack through right channel'"),
        description: z
          .string()
          .describe(
            "2-3 sentences describing a recurring tactical pattern observed in the match. " +
            "Reference specific events or phases of play that demonstrate the pattern."
          ),
        frequency: z
          .enum(["isolated", "recurring", "dominant"])
          .describe("How often this pattern appeared in the match"),
      })
    )
    .min(1)
    .max(3)
    .describe(
      "1-3 recurring tactical patterns observed in the match — not individual moments, " +
      "but repeated behaviors or strategies that shaped how the game played out."
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

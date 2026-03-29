import type { CanonicalMatch } from "@/types/match";

export const MOCK_MATCHES: Record<string, CanonicalMatch> = {
  "mock-001": {
    match: {
      id: "mock-001",
      competition: "Premier League",
      status: "finished",
      kickoffAt: "2026-03-28T15:00:00Z",
      homeTeam: "Liverpool",
      awayTeam: "Arsenal",
      homeScore: 4,
      awayScore: 3,
    },
    stats: {
      possessionHome: 45,
      possessionAway: 55,
      shotsHome: 16,
      shotsAway: 14,
      shotsOnTargetHome: 8,
      shotsOnTargetAway: 6,
      xgHome: 3.2,
      xgAway: 2.1,
    },
    events: [
      {
        minute: 12,
        team: "Liverpool",
        type: "goal",
        player: "Mohamed Salah",
        description:
          "Salah finishes a quick counter-attack, slotting past the keeper at the near post.",
      },
      {
        minute: 23,
        team: "Arsenal",
        type: "goal",
        player: "Bukayo Saka",
        description:
          "Saka curls a free kick into the top corner from 25 yards.",
      },
      {
        minute: 31,
        team: "Liverpool",
        type: "goal",
        player: "Darwin Nunez",
        description:
          "Nunez heads in from a corner kick, rising above the Arsenal defence.",
      },
      {
        minute: 45,
        team: "Arsenal",
        type: "goal",
        player: "Kai Havertz",
        description:
          "Havertz taps in from close range after a scramble in the box.",
      },
      {
        minute: 58,
        team: "Liverpool",
        type: "goal",
        player: "Mohamed Salah",
        description:
          "Salah scores his second, cutting inside from the right and firing low.",
      },
      {
        minute: 67,
        team: "Arsenal",
        type: "red_card",
        player: "William Saliba",
        description:
          "Saliba receives a second yellow for a late challenge on Nunez.",
      },
      {
        minute: 72,
        team: "Liverpool",
        type: "goal",
        player: "Luis Diaz",
        description:
          "Diaz exploits the extra man, finishing a team move with a precise shot.",
      },
      {
        minute: 85,
        team: "Arsenal",
        type: "goal",
        player: "Martin Odegaard",
        description:
          "Odegaard pulls one back with a long-range strike despite being down to 10 men.",
      },
    ],
  },

  "mock-002": {
    match: {
      id: "mock-002",
      competition: "La Liga",
      status: "finished",
      kickoffAt: "2026-03-27T20:00:00Z",
      homeTeam: "Atletico Madrid",
      awayTeam: "Barcelona",
      homeScore: 1,
      awayScore: 0,
    },
    stats: {
      possessionHome: 38,
      possessionAway: 62,
      shotsHome: 8,
      shotsAway: 15,
      shotsOnTargetHome: 3,
      shotsOnTargetAway: 5,
      xgHome: null,
      xgAway: null,
    },
    events: [
      {
        minute: 55,
        team: "Atletico Madrid",
        type: "goal",
        player: "Antoine Griezmann",
        description:
          "Griezmann finishes a swift counter-attack, beating the offside trap to score the only goal.",
      },
      {
        minute: 78,
        team: "Barcelona",
        type: "yellow_card",
        player: "Gavi",
        description: "Gavi booked for a frustrated foul in midfield.",
      },
    ],
  },

  "mock-003": {
    match: {
      id: "mock-003",
      competition: "Bundesliga",
      status: "halftime",
      kickoffAt: "2026-03-29T17:30:00Z",
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      homeScore: 2,
      awayScore: 1,
    },
    stats: {
      possessionHome: 58,
      possessionAway: 42,
      shotsHome: 9,
      shotsAway: 6,
      shotsOnTargetHome: 4,
      shotsOnTargetAway: 3,
      xgHome: 1.8,
      xgAway: 0.9,
    },
    events: [
      {
        minute: 15,
        team: "Bayern Munich",
        type: "goal",
        player: "Harry Kane",
        description:
          "Kane converts a penalty after a handball in the box.",
      },
      {
        minute: 28,
        team: "Borussia Dortmund",
        type: "goal",
        player: "Julian Brandt",
        description:
          "Brandt equalizes with a curling effort from the edge of the area.",
      },
      {
        minute: 41,
        team: "Bayern Munich",
        type: "goal",
        player: "Jamal Musiala",
        description:
          "Musiala dribbles past two defenders and slots home to restore Bayern's lead before the break.",
      },
    ],
  },
};

export function getMockMatch(id: string): CanonicalMatch | null {
  return MOCK_MATCHES[id] ?? null;
}

export function getMockMatchList(): CanonicalMatch["match"][] {
  return Object.values(MOCK_MATCHES).map((m) => m.match);
}

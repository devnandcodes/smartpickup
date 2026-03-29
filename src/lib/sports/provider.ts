import type { CanonicalMatch, MatchSummary } from "@/types/match";
import { getMockMatch, getMockMatchList } from "./mock-data";

export interface SportsProvider {
  getMatchList(date?: string, competition?: string): Promise<MatchSummary[]>;
  getMatch(id: string): Promise<CanonicalMatch | null>;
}

class MockProvider implements SportsProvider {
  async getMatchList(): Promise<MatchSummary[]> {
    return getMockMatchList();
  }

  async getMatch(id: string): Promise<CanonicalMatch | null> {
    return getMockMatch(id);
  }
}

// Factory: returns mock provider for now, swap to Football-Data.org later
export function createSportsProvider(): SportsProvider {
  return new MockProvider();
}

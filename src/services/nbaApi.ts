const API_BASE_URL = "http://127.0.0.1:8000";

export interface Player {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  team?: string;
}

export interface SeasonStats {
  PLAYER_ID: number;
  GP: number;
  MIN: number;
  PTS: number;
  AST: number;
  REB: number;
  STL: number;
  BLK: number;
  FG3M: number;
  PRA: number;
  PA: number;
  PR: number;
  AR: number;
}

export interface GameLog {
  GAME_DATE: string;
  MATCHUP: string;
  WL: string;
  PTS: number;
  REB: number;
  AST: number;
  MIN?: number;
}

export interface TrendResult {
  current_active_streak: number;
  total_hits: number;
  hit_rate_percent: number;
  message: string;
}

export const nbaApi = {
  async getPlayers(): Promise<Player[]> {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) throw new Error("Failed to fetch players");
    return response.json();
  },

  async searchPlayers(query: string): Promise<Player[]> {
    const response = await fetch(`${API_BASE_URL}/players/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search players");
    return response.json();
  },

  async getSeasonStats(playerId: number, season: string = "2024-25"): Promise<SeasonStats> {
    const response = await fetch(`${API_BASE_URL}/players/${playerId}/season-stats?season=${season}`);
    if (!response.ok) throw new Error("Failed to fetch season stats");
    return response.json();
  },

  async getGameLogs(playerId: number, season: string = "2024-25"): Promise<GameLog[]> {
    const response = await fetch(`${API_BASE_URL}/players/${playerId}/game-logs?season=${season}`);
    if (!response.ok) throw new Error("Failed to fetch game logs");
    return response.json();
  },

  async analyzeTrend(playerId: number, stat: string, threshold: number, season: string = "2024-25"): Promise<TrendResult> {
    const response = await fetch(
      `${API_BASE_URL}/players/${playerId}/trend?stat=${stat}&threshold=${threshold}&season=${season}`
    );
    if (!response.ok) throw new Error("Failed to analyze trend");
    return response.json();
  },
};

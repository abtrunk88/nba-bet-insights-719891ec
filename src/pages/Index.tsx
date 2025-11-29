import { useState } from "react";
import { Player } from "@/services/nbaApi";
import { PlayerSearch } from "@/components/PlayerSearch";
import { SeasonStatsCard } from "@/components/SeasonStatsCard";
import { GameLogsTable } from "@/components/GameLogsTable";
import { TrendAnalysis } from "@/components/TrendAnalysis";
import { useQuery } from "@tanstack/react-query";
import { nbaApi } from "@/services/nbaApi";
import { Activity, TrendingUp } from "lucide-react";

const Index = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  const { data: seasonStats, isLoading: statsLoading } = useQuery({
    queryKey: ["season-stats", selectedPlayer?.id],
    queryFn: () => nbaApi.getSeasonStats(selectedPlayer!.id),
    enabled: !!selectedPlayer,
  });

  const { data: gameLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["game-logs", selectedPlayer?.id],
    queryFn: () => nbaApi.getGameLogs(selectedPlayer!.id),
    enabled: !!selectedPlayer,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gradient">NBA Betting Insights</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Advanced player statistics and trend analysis for sports betting
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-2xl font-display font-bold text-foreground">Find Your Player</h2>
              <p className="text-muted-foreground">Search for any NBA player to view their stats and trends</p>
            </div>
            <PlayerSearch onSelectPlayer={setSelectedPlayer} selectedPlayer={selectedPlayer} />
          </div>

          {/* Selected Player Info */}
          {selectedPlayer && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">{selectedPlayer.full_name}</h2>
                  {selectedPlayer.team && (
                    <p className="text-muted-foreground">{selectedPlayer.team}</p>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              {statsLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading season stats...</p>
                </div>
              ) : seasonStats ? (
                <SeasonStatsCard stats={seasonStats} />
              ) : null}

              {/* Game Logs Section */}
              {logsLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading game logs...</p>
                </div>
              ) : gameLogs && gameLogs.length > 0 ? (
                <GameLogsTable gameLogs={gameLogs} />
              ) : null}

              {/* Trend Analysis Section */}
              <TrendAnalysis playerId={selectedPlayer.id} />
            </div>
          )}

          {/* Empty State */}
          {!selectedPlayer && (
            <div className="text-center py-20">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-display font-semibold text-muted-foreground mb-2">
                No Player Selected
              </h3>
              <p className="text-muted-foreground">
                Search for a player above to view their stats and betting insights
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>NBA Betting Insights Dashboard • Data from NBA Stats API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

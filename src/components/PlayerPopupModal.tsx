import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { nbaApi } from "@/services/nbaApi";
import { Activity, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerPopupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerId: number;
  playerName: string;
  opponentTeamId: string;
  opponentTeamName: string;
}

export function PlayerPopupModal({
  open,
  onOpenChange,
  playerId,
  playerName,
  opponentTeamId,
  opponentTeamName,
}: PlayerPopupModalProps) {
  const { data: popupData, isLoading, error } = useQuery({
    queryKey: ["player-popup", playerId, opponentTeamId],
    queryFn: () => nbaApi.getPlayerPopupData(playerId, opponentTeamId),
    enabled: open && !!playerId && !!opponentTeamId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-4 gap-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-primary" />
            <span>{playerName}</span>
            <span className="text-muted-foreground text-sm font-normal ml-auto">
              vs {opponentTeamName}
            </span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive text-sm">
            Erreur lors du chargement des données.
          </div>
        ) : popupData ? (
          <div className="grid gap-4">
            {/* SECTION A: RECENT FORM (Last 6 Games) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Forme du Moment (Last 6 Games)
              </h3>
              <Card className="bg-secondary/30">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* PTS */}
                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 text-center">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">PTS</p>
                      <p className="text-3xl font-bold text-primary">
                        {popupData.recent_form_avg.PTS?.toFixed(1) || "0.0"}
                      </p>
                    </div>

                    {/* REB */}
                    <div className="bg-nba-blue/10 p-3 rounded-lg border border-nba-blue/20 text-center">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">REB</p>
                      <p className="text-3xl font-bold text-nba-blue">
                        {popupData.recent_form_avg.REB?.toFixed(1) || "0.0"}
                      </p>
                    </div>

                    {/* AST */}
                    <div className="bg-accent/10 p-3 rounded-lg border border-accent/20 text-center">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">AST</p>
                      <p className="text-3xl font-bold text-accent">
                        {popupData.recent_form_avg.AST?.toFixed(1) || "0.0"}
                      </p>
                    </div>

                    {/* PRA - Highlighted */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-3 rounded-lg border-2 border-purple-500/40 text-center">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">PRA</p>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {popupData.recent_form_avg.PRA?.toFixed(1) || "0.0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SECTION C: H2H HISTORY (vs Opponent) */}
            {popupData.h2h_history && popupData.h2h_history.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Historique H2H vs {opponentTeamName}
                </h3>
                <Card className="bg-secondary/30">
                  <CardContent className="p-3">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-border/50">
                            <TableHead className="text-left py-2 px-2 text-xs font-semibold">Date</TableHead>
                            <TableHead className="text-right py-2 px-2 text-xs font-semibold">Min</TableHead>
                            <TableHead className="text-right py-2 px-2 text-xs font-semibold">PTS</TableHead>
                            <TableHead className="text-right py-2 px-2 text-xs font-semibold">REB</TableHead>
                            <TableHead className="text-right py-2 px-2 text-xs font-semibold">AST</TableHead>
                            <TableHead className="text-right py-2 px-2 text-xs font-semibold font-bold">PRA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {popupData.h2h_history.slice(0, 5).map((game, idx) => (
                            <TableRow
                              key={idx}
                              className={cn(
                                "border-b border-border/30 transition-colors",
                                game.PTS > 25 ? "bg-green-500/10 hover:bg-green-500/20" : "hover:bg-secondary/50"
                              )}
                            >
                              <TableCell className="py-2 px-2 text-sm text-foreground">
                                {game.GAME_DATE}
                              </TableCell>
                              <TableCell className="py-2 px-2 text-right text-sm text-foreground">
                                {game.MIN?.toFixed(0) || "0"}
                              </TableCell>
                              <TableCell
                                className={cn(
                                  "py-2 px-2 text-right text-sm font-semibold",
                                  game.PTS > 25
                                    ? "text-green-600 dark:text-green-400 text-base"
                                    : "text-foreground"
                                )}
                              >
                                {game.PTS?.toFixed(0) || "0"}
                              </TableCell>
                              <TableCell className="py-2 px-2 text-right text-sm text-foreground">
                                {game.REB?.toFixed(1) || "0.0"}
                              </TableCell>
                              <TableCell className="py-2 px-2 text-right text-sm text-foreground">
                                {game.AST?.toFixed(1) || "0.0"}
                              </TableCell>
                              <TableCell className="py-2 px-2 text-right text-sm font-bold text-primary">
                                {game.PRA?.toFixed(1) || "0.0"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {popupData.h2h_history.length > 5 && (
                      <p className="text-xs text-muted-foreground mt-2 px-2">
                        Affichage des 5 derniers matchs (total: {popupData.h2h_history.length})
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SECTION D: TREND */}
            {popupData.season_trend && (
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tendance Saison
                </h3>
                <Card className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">SEUIL</span>
                        <span className="text-lg font-bold text-primary">
                          {popupData.season_trend.threshold?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-muted-foreground">HIT RATE</span>
                        <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                          {popupData.season_trend.hit_rate?.toFixed(1) || "0.0"}%
                        </span>
                      </div>
                      <p className="text-sm text-foreground border-t border-border pt-3">
                        {popupData.season_trend.message || "Aucune tendance détectée"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

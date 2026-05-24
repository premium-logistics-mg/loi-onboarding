"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentEventsListProps {
  eclates: Array<{
    vehicule: string;
    plaque: string;
    marque: string;
    position: string;
    kmMontage: number;
    dernierKm: number;
    cause: string;
    date: string;
  }>;
  permutations: Array<{
    vehicule: string;
    plaque: string;
    marque: string;
    position: string;
    kmPermutation: number;
    date: string;
  }>;
}

export function RecentEventsList({
  eclates,
  permutations,
}: RecentEventsListProps) {
  // Combine and sort by date
  const allEvents = [
    ...eclates.map((e) => ({
      type: "eclate" as const,
      vehicule: e.vehicule,
      plaque: e.plaque,
      marque: e.marque,
      position: e.position,
      details: `${e.cause} à ${(e.dernierKm - e.kmMontage).toLocaleString("fr-FR")} km`,
      date: e.date,
    })),
    ...permutations.map((p) => ({
      type: "permutation" as const,
      vehicule: p.vehicule,
      plaque: p.plaque,
      marque: p.marque,
      position: p.position,
      details: `à ${p.kmPermutation.toLocaleString("fr-FR")} km`,
      date: p.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Événements récents
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Éclatements et permutations
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[240px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Date
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Type
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Véhicule
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Détails
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEvents.map((event, index) => (
                <TableRow
                  key={`${event.type}-${event.vehicule}-${index}`}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="py-2 text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell className="py-2">
                    {event.type === "eclate" ? (
                      <Badge className="bg-status-danger/20 text-status-danger border-status-danger/30 text-xs">
                        Éclaté
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        Permutation
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="font-medium text-foreground text-xs">
                      {event.vehicule}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">
                      {event.marque}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">
                    {event.position} · {event.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

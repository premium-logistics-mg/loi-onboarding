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

interface TiresByVehicleTableProps {
  data: Array<{
    vehicule: string;
    plaque: string;
    reference: string;
    marque: string;
    position: string;
    kmMontage: number;
    dernierKm: number;
    etat: string;
  }>;
}

export function TiresByVehicleTable({ data }: TiresByVehicleTableProps) {
  const getStatusBadge = (etat: string) => {
    switch (etat) {
      case "ok":
        return (
          <Badge className="bg-status-ok/20 text-status-ok border-status-ok/30 hover:bg-status-ok/30">
            OK
          </Badge>
        );
      case "surveiller":
        return (
          <Badge className="bg-status-warning/20 text-status-warning border-status-warning/30 hover:bg-status-warning/30">
            À surveiller
          </Badge>
        );
      case "eclate":
        return (
          <Badge className="bg-status-danger/20 text-status-danger border-status-danger/30 hover:bg-status-danger/30">
            Éclaté
          </Badge>
        );
      default:
        return <Badge variant="outline">{etat}</Badge>;
    }
  };

  // Group by vehicle
  const groupedData = data.reduce(
    (acc, item) => {
      const key = `${item.vehicule}-${item.plaque}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, typeof data>
  );

  // Get unique vehicles with their first tire entry for display
  const uniqueVehicles = Object.entries(groupedData).map(([key, tires]) => ({
    key,
    vehicule: tires[0].vehicule,
    plaque: tires[0].plaque,
    tires,
  }));

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Pneus par véhicule
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          État et kilométrage des pneumatiques
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Véhicule
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Position
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Marque
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  Km parcourus
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-center">
                  État
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 12).map((tire, index) => (
                <TableRow
                  key={`${tire.vehicule}-${tire.position}-${index}`}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="py-2">
                    <div>
                      <span className="font-medium text-foreground text-sm">
                        {tire.vehicule}
                      </span>
                      <span className="text-muted-foreground text-xs ml-2">
                        {tire.plaque}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2">
                    {tire.position}
                  </TableCell>
                  <TableCell className="text-xs text-foreground py-2">
                    {tire.marque}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground py-2">
                    {(tire.dernierKm - tire.kmMontage).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {getStatusBadge(tire.etat)}
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

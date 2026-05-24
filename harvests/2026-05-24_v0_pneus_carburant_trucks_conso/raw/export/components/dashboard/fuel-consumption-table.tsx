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
import { BAREME_CIBLE_L_PAR_100KM } from "@/lib/fleet-data";

interface FuelConsumptionTableProps {
  data: Array<{
    vehicule: string;
    plaque: string;
    kmEffectues: number;
    litres: number;
    lParKm: number;
    voyagesADM: number;
    voyagesTMM: number;
    voyagesTANA: number;
  }>;
}

export function FuelConsumptionTable({ data }: FuelConsumptionTableProps) {
  const baremeL100km = BAREME_CIBLE_L_PAR_100KM; // 70 L/100km

  const getStatusBadge = (lParKm: number) => {
    const lPar100km = lParKm * 100;
    if (lPar100km <= baremeL100km - 2) {
      return (
        <Badge className="bg-status-ok/20 text-status-ok border-status-ok/30 hover:bg-status-ok/30">
          Optimal
        </Badge>
      );
    } else if (lPar100km <= baremeL100km) {
      return (
        <Badge className="bg-status-warning/20 text-status-warning border-status-warning/30 hover:bg-status-warning/30">
          Normal
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-status-danger/20 text-status-danger border-status-danger/30 hover:bg-status-danger/30">
          Surconso
        </Badge>
      );
    }
  };

  const getEcart = (lParKm: number) => {
    const ecart = ((lParKm * 100) - baremeL100km).toFixed(1);
    const ecartNum = parseFloat(ecart);
    if (ecartNum > 0) {
      return <span className="text-status-danger">+{ecart}</span>;
    } else if (ecartNum < 0) {
      return <span className="text-status-ok">{ecart}</span>;
    }
    return <span className="text-muted-foreground">0</span>;
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Consommation par camion
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Barème cible: {baremeL100km} L/100km
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
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  Km
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  Litres
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  L/100km
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  Écart
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-center">
                  Statut
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((camion) => (
                <TableRow
                  key={camion.vehicule}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="py-2">
                    <div>
                      <span className="font-medium text-foreground text-sm">
                        {camion.vehicule}
                      </span>
                      <span className="text-muted-foreground text-xs ml-2">
                        {camion.plaque}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground py-2">
                    {camion.kmEffectues.toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground py-2">
                    {camion.litres.toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground py-2">
                    {(camion.lParKm * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm py-2">
                    {getEcart(camion.lParKm)}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {getStatusBadge(camion.lParKm)}
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

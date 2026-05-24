"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FuelDetailTableProps {
  data: Array<{
    date: string;
    station: string;
    vehicule: string;
    litres: number;
    voyage: string;
    trajet: string;
    bc: string;
  }>;
}

export function FuelDetailTable({ data }: FuelDetailTableProps) {
  const [search, setSearch] = useState("");
  const [stationFilter, setStationFilter] = useState("all");

  const stations = Array.from(new Set(data.map((d) => d.station)));

  const filteredData = data.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.vehicule.toLowerCase().includes(search.toLowerCase()) ||
      item.trajet.toLowerCase().includes(search.toLowerCase());
    const matchesStation =
      stationFilter === "all" || item.station === stationFilter;
    return matchesSearch && matchesStation;
  });

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">
              Détail des pleins
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} enregistrements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-[150px] pl-7 text-xs bg-background"
              />
            </div>
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger className="h-8 w-[130px] text-xs bg-background">
                <SelectValue placeholder="Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Date
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Véhicule
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Station
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">
                  Litres
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Trajet
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow
                  key={`${item.date}-${item.vehicule}-${index}`}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="py-2 text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="font-medium text-foreground text-sm">
                      {item.vehicule}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">
                    {item.station.split(" ")[0]}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground py-2">
                    {item.litres.toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground truncate max-w-[150px]">
                    {item.trajet}
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

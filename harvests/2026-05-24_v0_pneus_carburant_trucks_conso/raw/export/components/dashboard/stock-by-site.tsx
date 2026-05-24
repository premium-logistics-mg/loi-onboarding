"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockBySiteProps {
  data: Array<{
    site: string;
    marque: string;
    quantite: number;
  }>;
}

export function StockBySite({ data }: StockBySiteProps) {
  // Group by site
  const stockBySite = data.reduce(
    (acc, item) => {
      if (!acc[item.site]) {
        acc[item.site] = { total: 0, marques: [] as { marque: string; quantite: number }[] };
      }
      acc[item.site].total += item.quantite;
      acc[item.site].marques.push({ marque: item.marque, quantite: item.quantite });
      return acc;
    },
    {} as Record<string, { total: number; marques: { marque: string; quantite: number }[] }>
  );

  const sites = Object.entries(stockBySite);
  const totalStock = sites.reduce((sum, [, site]) => sum + site.total, 0);

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Stock pneus par site
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {totalStock} pneus en stock
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sites.map(([siteName, site]) => (
          <div key={siteName} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{siteName}</span>
              <span className="font-mono text-sm text-primary">{site.total}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(site.total / totalStock) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {site.marques.map((m) => (
                <span
                  key={`${siteName}-${m.marque}`}
                  className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                >
                  {m.marque}: {m.quantite}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

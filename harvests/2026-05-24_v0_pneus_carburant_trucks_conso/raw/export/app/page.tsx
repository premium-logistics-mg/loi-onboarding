"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/kpi-card";
import { BrandComparisonChart } from "@/components/dashboard/brand-comparison-chart";
import { TiresByVehicleTable } from "@/components/dashboard/tires-by-vehicle-table";
import { RecentEventsList } from "@/components/dashboard/recent-events-list";
import { StockBySite } from "@/components/dashboard/stock-by-site";
import { WearTrackingTable } from "@/components/dashboard/wear-tracking-table";
import { FuelConsumptionTable } from "@/components/dashboard/fuel-consumption-table";
import { StationDistributionChart } from "@/components/dashboard/station-distribution-chart";
import { FuelDetailTable } from "@/components/dashboard/fuel-detail-table";
import { FuelTrackingTable } from "@/components/dashboard/fuel-tracking-table";
import {
  statsParMarque,
  pneusMontés,
  pneusEclates,
  permutations,
  stockPneus,
  wearMeasurements,
  consommationCamions,
  recapStation,
  detailFuel,
  totalLitresMois,
  totalKmMois,
  coutCarburantMois,
  vehiculesSurconso,
  BAREME_CIBLE_L_PAR_100KM,
  flotte,
} from "@/lib/fleet-data";
import {
  Circle,
  Fuel,
  Gauge,
  Package,
  TrendingDown,
  Truck,
  AlertTriangle,
  MapPin,
} from "lucide-react";

export default function DashboardPage() {
  // Calculs KPI Pneus
  const meilleureMarque = [...statsParMarque].sort(
    (a, b) => a.coutParKm - b.coutParKm
  )[0];
  const dureeVieMoyenne =
    statsParMarque.reduce((acc, s) => acc + s.dureeVieMoyenne, 0) /
    statsParMarque.length;
  const tauxEclatementGlobal =
    (pneusEclates.length / (pneusMontés.length + pneusEclates.length)) * 100;
  const totalStockPneus = stockPneus.reduce((acc, s) => acc + s.quantite, 0);

  // Calculs KPI Carburant
  const consoMoyenneL100km = (totalLitresMois / totalKmMois) * 100;
  const ecartVsBareme = consoMoyenneL100km - BAREME_CIBLE_L_PAR_100KM;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-foreground">
                    Maintenance Manager
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Joel Transport · LOI Cockpit
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-status-ok" />
                <span>{flotte.total} véhicules actifs</span>
              </div>
              <span className="font-mono">Avril 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="pneus" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger
              value="pneus"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Circle className="h-3.5 w-3.5 mr-1.5" />
              Pneus
            </TabsTrigger>
            <TabsTrigger
              value="carburant"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Fuel className="h-3.5 w-3.5 mr-1.5" />
              Carburant
            </TabsTrigger>
          </TabsList>

          {/* === SECTION PNEUS === */}
          <TabsContent value="pneus" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                label="Marque la plus rentable"
                value={meilleureMarque.marque}
                unit={`${meilleureMarque.coutParKm.toFixed(1)} MGA/km`}
                delta={-12}
                deltaLabel="vs moyenne"
                variant="success"
                icon={<TrendingDown className="h-4 w-4" />}
              />
              <KPICard
                label="Durée de vie moyenne"
                value={Math.round(dureeVieMoyenne / 1000)}
                unit="000 km"
                delta={8}
                deltaLabel="vs mois dernier"
                cible="25 000 km"
                icon={<Gauge className="h-4 w-4" />}
              />
              <KPICard
                label="Taux d'éclatement"
                value={tauxEclatementGlobal.toFixed(1)}
                unit="%"
                delta={-2}
                deltaLabel="vs mois dernier"
                cible="< 5%"
                variant={tauxEclatementGlobal > 5 ? "warning" : "default"}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              <KPICard
                label="Stock pneus"
                value={totalStockPneus}
                unit="unités"
                delta={5}
                deltaLabel="vs mois dernier"
                variant="default"
                icon={<Package className="h-4 w-4" />}
              />
            </div>

            {/* Charts & Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BrandComparisonChart data={statsParMarque} />
              <TiresByVehicleTable data={pneusMontés} />
            </div>

            {/* Wear Tracking - Real-time */}
            <WearTrackingTable 
              data={wearMeasurements}
              onAction={(action, item) => {
                console.log(`Action: ${action}`, item);
                // In production, this would trigger a workflow/notification
              }}
            />

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RecentEventsList
                eclates={pneusEclates}
                permutations={permutations}
              />
              <StockBySite data={stockPneus} />
              <StationDistributionChart data={recapStation} />
            </div>
          </TabsContent>

          {/* === SECTION CARBURANT === */}
          <TabsContent value="carburant" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                label="Consommation moyenne"
                value={consoMoyenneL100km.toFixed(1)}
                unit="L/100km"
                delta={ecartVsBareme > 0 ? -Math.abs(ecartVsBareme) : Math.abs(ecartVsBareme)}
                deltaLabel="vs barème"
                cible={`${BAREME_CIBLE_L_PAR_100KM} L/100km`}
                variant={ecartVsBareme > 2 ? "warning" : "success"}
                icon={<Gauge className="h-4 w-4" />}
              />
              <KPICard
                label="Coût carburant du mois"
                value={(coutCarburantMois / 1000000).toFixed(1)}
                unit="M MGA"
                delta={-3}
                deltaLabel="vs mois dernier"
                icon={<Fuel className="h-4 w-4" />}
              />
              <KPICard
                label="Litres livrés"
                value={Math.round(totalLitresMois / 1000)}
                unit="000 L"
                delta={2}
                deltaLabel="vs mois dernier"
                icon={<MapPin className="h-4 w-4" />}
              />
              <KPICard
                label="Véhicules en surconso"
                value={vehiculesSurconso.length}
                unit={`sur ${consommationCamions.length}`}
                delta={vehiculesSurconso.length > 3 ? -vehiculesSurconso.length : vehiculesSurconso.length}
                deltaLabel=""
                cible="0 véhicule"
                variant={vehiculesSurconso.length > 3 ? "danger" : vehiculesSurconso.length > 0 ? "warning" : "success"}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
            </div>

            {/* Charts & Tables Row */}
            <div className="grid grid-cols-1 gap-4">
              <FuelConsumptionTable data={consommationCamions} />
            </div>

            {/* Fuel Tracking - Real-time */}
            <FuelTrackingTable 
              data={consommationCamions}
              onAction={(action, item) => {
                console.log(`Action: ${action}`, item);
                // In production, this would trigger a workflow/notification
              }}
            />

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-4">
              <FuelDetailTable data={detailFuel} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>SO·3 Transport Health</span>
              <span>·</span>
              <span>Dispo 85% · Marge 18%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">P4 OPS</span>
              <span>·</span>
              <span className="font-mono">P2 CASH</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

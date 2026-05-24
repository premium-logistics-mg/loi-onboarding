"use client";

import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileText,
  Fuel,
  Gauge,
  MapPin,
  RefreshCw,
  Route,
  Settings,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
  Wrench,
  CircleGauge,
  Search,
  Ban,
  MessageSquareWarning,
  Car,
  CalendarClock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  PenLine,
} from "lucide-react";
import { BAREME_CIBLE_L_PAR_100KM, PRIX_CARBURANT_MGA } from "@/lib/fleet-data";

interface FuelConsumptionData {
  vehicule: string;
  plaque: string;
  kmEffectues: number;
  litres: number;
  lParKm: number;
  voyagesADM: number;
  voyagesTMM: number;
  voyagesTANA: number;
  commentaire?: string;
}

interface FuelTrackingTableProps {
  data: FuelConsumptionData[];
  onAction?: (action: string, item: FuelConsumptionData) => void;
  onCommentChange?: (vehicule: string, comment: string) => void;
}

export function FuelTrackingTable({ data, onAction, onCommentChange }: FuelTrackingTableProps) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.forEach(item => {
      initial[item.vehicule] = item.commentaire || "";
    });
    return initial;
  });

  // Example comments for placeholder guidance
  const exampleComments = [
    "Fuite à vérifier",
    "Contrôle carburateur",
    "Anomalie suspectée",
    "Plein non justifié",
    "Écart kilométrage",
    "Siphonnage possible",
    "Conduite agressive",
    "Trajet non déclaré",
  ];

  // Initialize and update time only on client side to avoid hydration mismatch
  useEffect(() => {
    setLastUpdate(new Date());
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCommentChange = (vehicule: string, comment: string) => {
    setComments(prev => ({ ...prev, [vehicule]: comment }));
    onCommentChange?.(vehicule, comment);
  };

  const toggleRowExpand = (vehicule: string) => {
    setExpandedRow(prev => prev === vehicule ? null : vehicule);
  };

  const baremeL100km = BAREME_CIBLE_L_PAR_100KM; // 70 L/100km

  // Calculate consumption rate in L/100km
  const getLPar100km = (item: FuelConsumptionData) => {
    return item.lParKm * 100;
  };

  // Calculate variance vs target
  const getEcart = (item: FuelConsumptionData) => {
    return getLPar100km(item) - baremeL100km;
  };

  // Calculate monthly fuel cost for this vehicle
  const getCoutMensuel = (item: FuelConsumptionData) => {
    return item.litres * PRIX_CARBURANT_MGA;
  };

  // Calculate potential savings if at target
  const getEconomiesPotentielles = (item: FuelConsumptionData) => {
    const ecart = getEcart(item);
    if (ecart <= 0) return 0;
    const litresExces = (ecart / 100) * item.kmEffectues;
    return litresExces * PRIX_CARBURANT_MGA;
  };

  // Determine status based on consumption vs barème
  const getStatus = (item: FuelConsumptionData) => {
    const ecart = getEcart(item);
    const ecartPercent = (ecart / baremeL100km) * 100;

    // Critical: > 5% above target (> 73.5 L/100km)
    if (ecartPercent > 5) {
      return { label: "Surconso", variant: "danger" as const, action: true };
    }

    // Warning: 2-5% above target (71.4 - 73.5 L/100km)
    if (ecartPercent > 2) {
      return { label: "Attention", variant: "warning" as const, action: true };
    }

    // Watch: 0-2% above target (70 - 71.4 L/100km)
    if (ecart > 0) {
      return { label: "Surveiller", variant: "watch" as const, action: true };
    }

    // OK: at or below target
    return { label: "Optimal", variant: "success" as const, action: false };
  };

  const getStatusBadge = (status: ReturnType<typeof getStatus>) => {
    const variants = {
      danger: "bg-status-danger/20 text-status-danger border-status-danger/30",
      warning: "bg-status-warning/20 text-status-warning border-status-warning/30",
      watch: "bg-accent/20 text-accent border-accent/30",
      success: "bg-status-ok/20 text-status-ok border-status-ok/30",
    };
    return (
      <Badge variant="outline" className={`${variants[status.variant]} font-medium`}>
        {status.variant === "danger" && <AlertTriangle className="h-3 w-3 mr-1" />}
        {status.variant === "warning" && <Bell className="h-3 w-3 mr-1" />}
        {status.variant === "success" && <CheckCircle2 className="h-3 w-3 mr-1" />}
        {status.label}
      </Badge>
    );
  };

  // Calculate summary KPIs
  const criticalCount = data.filter((d) => getStatus(d).variant === "danger").length;
  const warningCount = data.filter((d) => getStatus(d).variant === "warning").length;
  const totalEconomies = data.reduce((acc, d) => acc + getEconomiesPotentielles(d), 0);
  const avgEcart = data.reduce((acc, d) => acc + getEcart(d), 0) / data.length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-accent/20 flex items-center justify-center">
              <Fuel className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Suivi Consommation Carburant
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Alertes temps réel vs barème {baremeL100km} L/100km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-ok opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-ok"></span>
              </span>
              <span>En direct</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-7 px-2"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actualiser les données</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Summary KPIs row */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-status-danger/20 flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 text-status-danger" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Surconso</p>
              <p className="text-sm font-mono font-semibold text-status-danger">{criticalCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-status-warning/20 flex items-center justify-center">
              <Bell className="h-3 w-3 text-status-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Attention</p>
              <p className="text-sm font-mono font-semibold text-status-warning">{warningCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-accent/20 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Écart moy.</p>
              <p className={`text-sm font-mono font-semibold ${avgEcart > 0 ? "text-status-danger" : "text-status-ok"}`}>
                {avgEcart > 0 ? "+" : ""}{avgEcart.toFixed(1)} <span className="text-xs text-muted-foreground">L</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
              <TrendingDown className="h-3 w-3 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Économies pot.</p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {(totalEconomies / 1000000).toFixed(1)} <span className="text-xs text-muted-foreground">M</span>
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-medium text-muted-foreground w-8"></TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Véhicule</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">L/100km</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Écart</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Litres</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Km</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Coût mois</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Commentaire
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Statut</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .sort((a, b) => {
                  // Sort by urgency: critical first, then warning, then watch, then ok
                  const statusOrder = { danger: 0, warning: 1, watch: 2, success: 3 };
                  return statusOrder[getStatus(a).variant] - statusOrder[getStatus(b).variant];
                })
                .map((item) => {
                  const lPar100km = getLPar100km(item);
                  const ecart = getEcart(item);
                  const coutMensuel = getCoutMensuel(item);
                  const status = getStatus(item);
                  const economiesPot = getEconomiesPotentielles(item);

                  return (
                    <Fragment key={item.vehicule}>
                    <TableRow className="hover:bg-muted/10">
                      {/* Expand button for comment */}
                      <TableCell className="py-2 w-8">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRowExpand(item.vehicule)}
                        >
                          {expandedRow === item.vehicule ? (
                            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="py-2">
                        <div>
                          <span className="font-mono text-xs text-foreground">{item.plaque}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">{item.vehicule}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {item.voyagesADM + item.voyagesTMM + item.voyagesTANA} voyages
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`font-mono text-sm font-semibold ${
                              ecart > 3.5 ? "text-status-danger" : ecart > 1.4 ? "text-status-warning" : ecart > 0 ? "text-accent" : "text-status-ok"
                            }`}
                          >
                            {lPar100km.toFixed(1)}
                          </span>
                          {/* Progress bar showing consumption vs target */}
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                ecart > 3.5
                                  ? "bg-status-danger"
                                  : ecart > 1.4
                                  ? "bg-status-warning"
                                  : ecart > 0
                                  ? "bg-accent"
                                  : "bg-status-ok"
                              }`}
                              style={{ width: `${Math.min((lPar100km / 80) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            ecart > 3.5 ? "text-status-danger" : ecart > 1.4 ? "text-status-warning" : ecart > 0 ? "text-accent" : "text-status-ok"
                          }`}
                        >
                          {ecart > 0 ? "+" : ""}{ecart.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <span className="font-mono text-sm text-foreground">
                          {item.litres.toLocaleString("fr-FR")}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <span className="font-mono text-sm text-muted-foreground">
                          {item.kmEffectues.toLocaleString("fr-FR")}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-sm text-foreground">
                            {(coutMensuel / 1000000).toFixed(1)}M
                          </span>
                          {economiesPot > 0 && (
                            <span className="text-[10px] text-status-danger">
                              -{(economiesPot / 1000).toFixed(0)}k pot.
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* Comment preview cell */}
                      <TableCell className="py-2 max-w-[180px]">
                        {comments[item.vehicule] ? (
                          <div className="flex items-start gap-1">
                            <MessageSquare className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {comments[item.vehicule]}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleRowExpand(item.vehicule)}
                            className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                          >
                            <PenLine className="h-3 w-3" />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {getStatusBadge(status)}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {status.action ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant={status.variant === "danger" ? "destructive" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                              >
                                <Wrench className="h-3 w-3 mr-1" />
                                Agir
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                              {/* SURCONSO CRITIQUE: Actions urgentes */}
                              {status.variant === "danger" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("convocation_chauffeur", item)}
                                    className="text-status-danger font-medium"
                                  >
                                    <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                                    Convoquer chauffeur
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("blocage_carte", item)}
                                    className="text-status-danger"
                                  >
                                    <Ban className="h-3.5 w-3.5 mr-2" />
                                    Bloquer carte carburant
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("audit_trajets", item)}
                                  >
                                    <Route className="h-3.5 w-3.5 mr-2" />
                                    Audit trajets GPS
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("controle_mecanique", item)}
                                  >
                                    <Wrench className="h-3.5 w-3.5 mr-2" />
                                    Contrôle mécanique urgent
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* ATTENTION: Actions préventives */}
                              {status.variant === "warning" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("avertissement_chauffeur", item)}
                                    className="text-status-warning font-medium"
                                  >
                                    <MessageSquareWarning className="h-3.5 w-3.5 mr-2" />
                                    Avertissement chauffeur
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("formation_ecoconduite", item)}
                                  >
                                    <User className="h-3.5 w-3.5 mr-2" />
                                    Formation éco-conduite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("revision_itineraire", item)}
                                  >
                                    <MapPin className="h-3.5 w-3.5 mr-2" />
                                    Révision itinéraires
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* ATTENTION + CRITIQUE: Contrôles techniques */}
                              {(status.variant === "warning" || status.variant === "danger") && (
                                <>
                                  <DropdownMenuItem onClick={() => onAction?.("verification_injecteurs", item)}>
                                    <Settings className="h-3.5 w-3.5 mr-2" />
                                    Vérifier injecteurs
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("controle_pression_pneus", item)}>
                                    <CircleGauge className="h-3.5 w-3.5 mr-2" />
                                    Contrôle pression pneus
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("filtre_air_carburant", item)}>
                                    <Fuel className="h-3.5 w-3.5 mr-2" />
                                    Vérifier filtres air/carburant
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* SURVEILLER: Contrôles de routine */}
                              {status.variant === "watch" && (
                                <>
                                  <DropdownMenuItem onClick={() => onAction?.("rappel_ecoconduite", item)}>
                                    <User className="h-3.5 w-3.5 mr-2" />
                                    Rappel éco-conduite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("optimisation_chargement", item)}>
                                    <Truck className="h-3.5 w-3.5 mr-2" />
                                    Optimisation chargement
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("verification_ralenti", item)}>
                                    <Car className="h-3.5 w-3.5 mr-2" />
                                    Vérifier temps ralenti
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Actions communes */}
                              <DropdownMenuItem onClick={() => onAction?.("releve_compteur", item)}>
                                <Gauge className="h-3.5 w-3.5 mr-2" />
                                Relevé compteur kilométrique
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onAction?.("rapport_consommation", item)}>
                                <FileText className="h-3.5 w-3.5 mr-2" />
                                Générer rapport détaillé
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onAction?.("planifier_entretien", item)}>
                                <CalendarClock className="h-3.5 w-3.5 mr-2" />
                                Planifier entretien préventif
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {/* Expanded comment row */}
                    {expandedRow === item.vehicule && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={10} className="py-3">
                          <div className="flex flex-col gap-2 px-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-accent" />
                              <span className="text-sm font-medium text-foreground">
                                Commentaire du pointeur - {item.plaque} ({item.vehicule})
                              </span>
                            </div>
                            <Textarea
                              value={comments[item.vehicule] || ""}
                              onChange={(e) => handleCommentChange(item.vehicule, e.target.value)}
                              placeholder="Ex: fuite à vérifier, contrôle carburateur, anomalie suspectée, plein non justifié, écart kilométrage..."
                              className="min-h-[60px] text-sm bg-background resize-none"
                            />
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="text-[10px] text-muted-foreground mr-1">Suggestions:</span>
                              {exampleComments.map((example) => (
                                <button
                                  key={example}
                                  onClick={() => {
                                    const current = comments[item.vehicule] || "";
                                    const newComment = current ? `${current}, ${example.toLowerCase()}` : example;
                                    handleCommentChange(item.vehicule, newComment);
                                  }}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {example}
                                </button>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    </Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        {/* Footer with last update time */}
<div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
  <p className="text-xs text-muted-foreground">
  Dernière maj: {lastUpdate ? lastUpdate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
  </p>
          <p className="text-xs text-muted-foreground">
            Barème cible: <span className="font-mono font-semibold text-foreground">{baremeL100km}</span> L/100km
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

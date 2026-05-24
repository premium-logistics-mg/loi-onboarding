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
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  MoreHorizontal,
  RefreshCw,
  RotateCw,
  Wrench,
  Gauge,
  TrendingDown,
  Bell,
  ArrowLeftRight,
  Thermometer,
  FileText,
  ShieldAlert,
  Recycle,
  CircleGauge,
  Replace,
  Truck,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  PenLine,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface WearMeasurement {
  id: string;
  vehicule: string;
  plaque: string;
  position: string;
  marque: string;
  epaisseurInitiale: number; // mm
  epaisseurActuelle: number; // mm
  kmMontage: number;
  kmActuel: number;
  derniereReleve: string;
  seuilAlerte: number; // mm
  seuilCritique: number; // mm
  commentaire?: string; // Commentaire du pointeur
}

interface WearTrackingTableProps {
  data: WearMeasurement[];
  onAction?: (action: string, item: WearMeasurement) => void;
  onCommentChange?: (id: string, comment: string) => void;
}

export function WearTrackingTable({ data, onAction, onCommentChange }: WearTrackingTableProps) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>(() => {
    // Initialize comments from data
    const initial: Record<string, string> = {};
    data.forEach(item => {
      initial[item.id] = item.commentaire || "";
    });
    return initial;
  });

  // Example comments for placeholder guidance
  const exampleComments = [
    "Gonflage anormal",
    "Parallélisme à vérifier",
    "Usure en dents de scie",
    "Traces de chauffage flanc",
    "Coupure superficielle",
    "Usure centrale (surpression)",
    "Usure latérale (sous-gonflage)",
    "Hernie détectée",
  ];

  // Initialize and update time only on client side to avoid hydration mismatch
  useEffect(() => {
    setLastUpdate(new Date());
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCommentChange = (id: string, comment: string) => {
    setComments(prev => ({ ...prev, [id]: comment }));
    onCommentChange?.(id, comment);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // Calculate consumption rate (mm per 1000 km)
  const getConsoEpaisseur = (item: WearMeasurement) => {
    const kmParcourus = item.kmActuel - item.kmMontage;
    if (kmParcourus <= 0) return 0;
    const epaisseurConsommee = item.epaisseurInitiale - item.epaisseurActuelle;
    return (epaisseurConsommee / kmParcourus) * 1000; // mm per 1000 km
  };

  // Calculate remaining distance before critical threshold
  const getKmRestants = (item: WearMeasurement) => {
    const consoRate = getConsoEpaisseur(item);
    if (consoRate <= 0) return Infinity;
    const epaisseurRestante = item.epaisseurActuelle - item.seuilCritique;
    return (epaisseurRestante / consoRate) * 1000;
  };

  // Determine status based on thresholds and consumption rate
  const getStatus = (item: WearMeasurement) => {
    const consoRate = getConsoEpaisseur(item);
    const kmRestants = getKmRestants(item);
    
    // Critical: below critical threshold or < 5000 km remaining
    if (item.epaisseurActuelle <= item.seuilCritique || kmRestants < 5000) {
      return { label: "Critique", variant: "danger" as const, action: "Remplacer" };
    }
    
    // Alert: below alert threshold or < 10000 km remaining or high consumption rate
    if (
      item.epaisseurActuelle <= item.seuilAlerte ||
      kmRestants < 10000 ||
      consoRate > 0.8 // > 0.8 mm/1000km is high wear
    ) {
      return { label: "Alerte", variant: "warning" as const, action: "Lubrifier/Permuter" };
    }
    
    // Watch: moderate consumption rate
    if (consoRate > 0.5) {
      return { label: "Surveiller", variant: "watch" as const, action: "Contrôler" };
    }
    
    // OK: normal wear
    return { label: "OK", variant: "success" as const, action: null };
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
  const criticalCount = data.filter(d => getStatus(d).variant === "danger").length;
  const alertCount = data.filter(d => getStatus(d).variant === "warning").length;
  const avgConsoRate = data.reduce((acc, d) => acc + getConsoEpaisseur(d), 0) / data.length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-accent/20 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Suivi Usure Pneus
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pointages épaisseur en temps réel
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
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-status-danger/20 flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 text-status-danger" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critiques</p>
              <p className="text-sm font-mono font-semibold text-status-danger">{criticalCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-status-warning/20 flex items-center justify-center">
              <Bell className="h-3 w-3 text-status-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alertes</p>
              <p className="text-sm font-mono font-semibold text-status-warning">{alertCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-accent/20 flex items-center justify-center">
              <TrendingDown className="h-3 w-3 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Conso moy.</p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {avgConsoRate.toFixed(2)} <span className="text-xs text-muted-foreground">mm/Mkm</span>
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
                <TableHead className="text-xs font-medium text-muted-foreground">Position</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Épaisseur</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Conso/Mkm</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">KM restants</TableHead>
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
                  const consoRate = getConsoEpaisseur(item);
                  const kmRestants = getKmRestants(item);
                  const status = getStatus(item);
                  const usurePercent = ((item.epaisseurInitiale - item.epaisseurActuelle) / item.epaisseurInitiale) * 100;

                  return (
                    <Fragment key={item.id}>
                    <TableRow className="hover:bg-muted/10">
                      {/* Expand button for comment */}
                      <TableCell className="py-2 w-8">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRowExpand(item.id)}
                        >
                          {expandedRow === item.id ? (
                            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="py-2">
                        <div>
                          <span className="font-mono text-xs text-foreground">{item.plaque}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">{item.marque}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-xs text-muted-foreground">{item.position}</span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-sm font-semibold text-foreground">
                              {item.epaisseurActuelle.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">mm</span>
                          </div>
                          {/* Progress bar showing wear */}
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                usurePercent > 70
                                  ? "bg-status-danger"
                                  : usurePercent > 50
                                  ? "bg-status-warning"
                                  : "bg-status-ok"
                              }`}
                              style={{ width: `${100 - usurePercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {item.epaisseurInitiale.toFixed(0)}mm initial
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            consoRate > 0.8
                              ? "text-status-danger"
                              : consoRate > 0.5
                              ? "text-status-warning"
                              : "text-foreground"
                          }`}
                        >
                          {consoRate.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <span
                          className={`font-mono text-sm ${
                            kmRestants < 5000
                              ? "text-status-danger font-semibold"
                              : kmRestants < 10000
                              ? "text-status-warning font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {kmRestants === Infinity
                            ? "-"
                            : kmRestants < 1000
                            ? `${Math.round(kmRestants)}`
                            : `${(kmRestants / 1000).toFixed(1)}k`}
                        </span>
                      </TableCell>
                      {/* Comment preview cell */}
                      <TableCell className="py-2 max-w-[180px]">
                        {comments[item.id] ? (
                          <div className="flex items-start gap-1">
                            <MessageSquare className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {comments[item.id]}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleRowExpand(item.id)}
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
                            <DropdownMenuContent align="end" className="w-56">
                              {/* CRITIQUE: Actions urgentes de remplacement */}
                              {status.variant === "danger" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("demontage_immediat", item)}
                                    className="text-status-danger font-medium"
                                  >
                                    <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                                    Démontage immédiat
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("bon_sortie", item)}
                                    className="text-status-danger"
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-2" />
                                    Émettre bon de sortie
                                  </DropdownMenuItem>
                                  {/* Recreusage possible si épaisseur > 2mm et carcasse OK */}
                                  {item.epaisseurActuelle >= 2.5 && (
                                    <DropdownMenuItem onClick={() => onAction?.("recreusage", item)}>
                                      <Recycle className="h-3.5 w-3.5 mr-2" />
                                      Recreusage (si carcasse OK)
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                              
                              {/* ALERTE: Actions préventives prioritaires */}
                              {status.variant === "warning" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onAction?.("planifier_remplacement", item)}
                                    className="text-status-warning font-medium"
                                  >
                                    <Replace className="h-3.5 w-3.5 mr-2" />
                                    Planifier remplacement
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("recreusage", item)}>
                                    <Recycle className="h-3.5 w-3.5 mr-2" />
                                    Recreusage préventif
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {/* ALERTE + CRITIQUE: Permutation & Lubrification */}
                              {(status.variant === "warning" || status.variant === "danger") && (
                                <>
                                  <DropdownMenuItem onClick={() => onAction?.("permutation_croisee", item)}>
                                    <ArrowLeftRight className="h-3.5 w-3.5 mr-2" />
                                    Permutation croisée AV/AR
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("permutation_jumele", item)}>
                                    <RotateCw className="h-3.5 w-3.5 mr-2" />
                                    Inversion jumelé INT/EXT
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("graissage", item)}>
                                    <Droplets className="h-3.5 w-3.5 mr-2" />
                                    Ordre graissage/lubrification
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {/* SURVEILLER: Contrôles techniques */}
                              {status.variant === "watch" && (
                                <>
                                  <DropdownMenuItem onClick={() => onAction?.("controle_pression", item)}>
                                    <CircleGauge className="h-3.5 w-3.5 mr-2" />
                                    Contrôle pression (bar)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("equilibrage", item)}>
                                    <Activity className="h-3.5 w-3.5 mr-2" />
                                    Équilibrage roue
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onAction?.("alignement", item)}>
                                    <Truck className="h-3.5 w-3.5 mr-2" />
                                    Vérifier parallélisme
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {/* Actions communes à tous les statuts avec action */}
                              <DropdownMenuItem onClick={() => onAction?.("pointage_supplementaire", item)}>
                                <Gauge className="h-3.5 w-3.5 mr-2" />
                                Nouveau pointage épaisseur
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onAction?.("inspection_visuelle", item)}>
                                <Thermometer className="h-3.5 w-3.5 mr-2" />
                                Inspection visuelle (coupures, hernies)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {/* Expanded comment row */}
                    {expandedRow === item.id && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={9} className="py-3">
                          <div className="flex flex-col gap-2 px-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-accent" />
                              <span className="text-sm font-medium text-foreground">
                                Commentaire du pointeur - {item.plaque} ({item.position})
                              </span>
                            </div>
                            <Textarea
                              value={comments[item.id] || ""}
                              onChange={(e) => handleCommentChange(item.id, e.target.value)}
                              placeholder="Ex: gonflage anormal, parallélisme à vérifier, usure en dents de scie, traces de chauffage flanc, coupure superficielle..."
                              className="min-h-[60px] text-sm bg-background resize-none"
                            />
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="text-[10px] text-muted-foreground mr-1">Suggestions:</span>
                              {exampleComments.map((example) => (
                                <button
                                  key={example}
                                  onClick={() => {
                                    const current = comments[item.id] || "";
                                    const newComment = current ? `${current}, ${example.toLowerCase()}` : example;
                                    handleCommentChange(item.id, newComment);
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

        {/* Footer with last update */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Dernière MàJ: {lastUpdate ? lastUpdate.toLocaleTimeString("fr-FR") : "--:--:--"}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Seuils: Alerte &lt; 6mm · Critique &lt; 3mm
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

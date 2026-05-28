/* global React, PhoneShell, AppHeader, BottomNav, SectionLabel, Chip */
// Scorecards.jsx — Screen 7 · Full-width scorecards for B-K01..04

function Scorecards() {
  return (
    <PhoneShell screenLabel="07 · Scorecards" offline>
      <AppHeader
        title="Mes scores"
        subtitle="Pacte TER terrain · pilier P4"
        right={
          <Chip kind="accent" compact>SO·2</Chip>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        <SectionLabel right={
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: "rgba(240,238,235,0.55)" }}>
            7 derniers jours
          </span>
        }>
          KPIs Bernardin
        </SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 18px" }}>
          <Scorecard
            code="B-K01"
            label="Délai ATA → livraison client (Mode A)"
            value="3,2"
            unit="j"
            target="≤ ETA+4"
            pct={0.85}
            status="ok"
            spark={[4.6, 4.2, 3.9, 4.0, 3.5, 3.4, 3.2]}
            targetValue={4}
            forecastValue={3.0}
            captionMeta="asof 28 mai · J-7"
          />
          <Scorecard
            code="B-K02"
            label="Livraison → restitution conteneur vide"
            value="28"
            unit="h"
            target="≤ 24 h"
            pct={0.55}
            status="warn"
            spark={[22, 26, 30, 32, 28, 29, 28]}
            targetValue={24}
            forecastValue={26}
            captionMeta="asof 28 mai · J-7"
          />
          <Scorecard
            code="B-K03"
            label="Empotages dans timing closing date (Mode E)"
            value="100"
            unit="%"
            target="100 %"
            pct={1.0}
            status="ok"
            spark={[100, 100, 92, 100, 100, 100, 100]}
            targetValue={100}
            captionMeta="asof 28 mai · J-7"
          />
          <Scorecard
            code="B-K04"
            label="Visites douanières Rouge clôturées même jour"
            value="72"
            unit="%"
            target="≥ 80 %"
            pct={0.72}
            status="warn"
            spark={[60, 65, 70, 78, 75, 70, 72]}
            targetValue={80}
            forecastValue={78}
            captionMeta="asof 28 mai · J-7"
          />
        </div>

        <SectionLabel>Scores complémentaires</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 18px 32px" }}>
          <ComplementaryRow
            label="0 défaut PV livraison"
            detail="Signature client · état conteneur"
            value="0"
            status="ok"
          />
          <ComplementaryRow
            label="0 dérive timing > 24 h sans escalade"
            detail="Vers Mohamed / Tudi"
            value="1"
            status="warn"
          />
        </div>
      </div>
      <BottomNav active="scores" />
    </PhoneShell>
  );
}

function Scorecard({ code, label, value, unit, target, pct, status, spark, targetValue, forecastValue, captionMeta }) {
  const colors = { ok: "#5BC58B", warn: "#E3A053", err: "#E4734D" };
  const c = colors[status];
  const p = Math.max(0, Math.min(1, pct));

  return (
    <div
      style={{
        background: "#161A24",
        border: "1px solid #242835",
        borderRadius: 8,
        padding: "14px 16px",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            fontWeight: 600,
            color: "#3EAA9B",
            background: "rgba(62, 170, 155, 0.14)",
            padding: "2px 6px",
            borderRadius: 2,
            letterSpacing: "0.04em",
          }}
        >
          {code}
        </span>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            color: "rgba(240,238,235,0.55)",
          }}
        >
          {captionMeta}
        </span>
      </div>

      <div style={{ fontSize: 13.5, color: "#F0EEEB", lineHeight: 1.3, marginBottom: 12, letterSpacing: "-0.005em" }}>
        {label}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 40,
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: c,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
            {unit && (
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,238,235,0.55)", marginLeft: 4, fontWeight: 500 }}>
                {unit}
              </span>
            )}
          </span>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "rgba(240,238,235,0.55)" }}>
            cible {target}
          </span>
        </div>
        <ScorecardSparkline points={spark} targetValue={targetValue} forecastValue={forecastValue} color={c} />
      </div>

      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginBottom: 5 }}>
        <div style={{ height: "100%", width: `${p * 100}%`, background: c }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "rgba(240,238,235,0.5)" }}>
        <span>{Math.round(p * 100)} % de la cible</span>
        <span>tendance {forecastValue !== undefined ? "→ " + forecastValue + (unit || "") : "stable"}</span>
      </div>
    </div>
  );
}

function ScorecardSparkline({ points = [], width = 140, height = 50, color = "#3EAA9B", targetValue, forecastValue }) {
  if (!points.length) return null;
  const all = [...points, targetValue, forecastValue].filter((v) => typeof v === "number");
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const pad = 4;
  const innerH = height - pad * 2;
  const histW = forecastValue !== undefined ? width * 0.74 : width;
  const fcW = width - histW;
  const x = (i) => (i * histW) / (points.length - 1 || 1);
  const y = (v) => pad + innerH - ((v - min) / range) * innerH;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(" ");
  const lastX = x(points.length - 1);
  const lastY = y(points[points.length - 1]);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", flexShrink: 0 }}>
      {typeof targetValue === "number" && (
        <line x1="0" x2={width} y1={y(targetValue)} y2={y(targetValue)} stroke="rgba(240,238,235,0.35)" strokeWidth="1" strokeDasharray="2 3" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {forecastValue !== undefined && (
        <line x1={lastX} x2={lastX + fcW} y1={lastY} y2={y(forecastValue)} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      )}
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      {forecastValue !== undefined && (
        <circle cx={lastX + fcW} cy={y(forecastValue)} r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
      )}
    </svg>
  );
}

function ComplementaryRow({ label, detail, value, status }) {
  const colors = { ok: "#5BC58B", warn: "#E3A053", err: "#E4734D" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: "#161A24",
        border: "1px solid #242835",
        borderRadius: 6,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#F0EEEB", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(240,238,235,0.55)", marginTop: 2 }}>{detail}</div>
      </div>
      <div
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 22,
          fontWeight: 500,
          color: colors[status],
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

window.Scorecards = Scorecards;

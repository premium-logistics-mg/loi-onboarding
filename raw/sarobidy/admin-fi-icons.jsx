/* global React */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi Sarobidy — Icons (line, 1.6px, currentColor)
// Lucide-style, inlined. Zero emoji.
// ════════════════════════════════════════════════════════════════

function AfIcon({ name, size = 18, stroke = 1.6, color = "currentColor", style }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    style: { display: "block", flexShrink: 0, ...style },
  };
  switch (name) {
    // Nav
    case "grid":         return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "chat":         return <svg {...p}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.6-4.8A8 8 0 1 1 21 12z"/></svg>;
    case "chart":        return <svg {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>;
    case "book":         return <svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H7a3 3 0 0 0-3 3z"/><path d="M19 19v2H6"/></svg>;
    case "user":         return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    // Status / trend
    case "trend-up":     return <svg {...p}><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>;
    case "trend-down":   return <svg {...p}><polyline points="3 7 9 13 13 9 21 17"/><polyline points="15 17 21 17 21 11"/></svg>;
    case "trend-flat":   return <svg {...p}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="16 8 20 12 16 16"/></svg>;
    // Pillars
    case "pillar-exec":  return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case "pillar-cash":  return <svg {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg>;
    case "pillar-loyal": return <svg {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>;
    case "pillar-flow":  return <svg {...p}><path d="M3 7c4 0 4 4 8 4s4-4 8-4"/><path d="M3 13c4 0 4 4 8 4s4-4 8-4"/></svg>;
    // Work queue types
    case "type-fact":    return <svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V8z"/><path d="M14 3v5h5"/><line x1="8" y1="13" x2="14" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>;
    case "type-cnaps":   return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><polyline points="9 12 11 14 15 10"/></svg>;
    case "type-achat":   return <svg {...p}><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2l2.5 12h12l2-8H6"/></svg>;
    case "type-stc":     return <svg {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
    // Actions
    case "plus":         return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "arrow-right":  return <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>;
    case "x":            return <svg {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>;
    case "check":        return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case "check-circle": return <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="16 10 11 15 8 12"/></svg>;
    case "alert":        return <svg {...p}><path d="M12 3l10 17H2z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.8" fill={color} stroke="none"/></svg>;
    case "clock":        return <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>;
    case "lock":         return <svg {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
    case "info":         return <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.8" fill={color} stroke="none"/></svg>;
    // Coaching cause icons
    case "bolt":         return <svg {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>;
    case "link":         return <svg {...p}><path d="M10 14a4 4 0 0 1 0-6l3-3a4 4 0 1 1 6 6l-2 2"/><path d="M14 10a4 4 0 0 1 0 6l-3 3a4 4 0 0 1-6-6l2-2"/></svg>;
    case "users":        return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15c3 0 6 2 6 5"/></svg>;
    case "spark":        return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    // Pipeline step icons
    case "step-demande": return <svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="14 3 14 9 20 9"/></svg>;
    case "step-matrice": return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "step-haja":    return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case "step-paye":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9 13l2 2 4-5"/></svg>;
    case "clipboard":     return <svg {...p}><rect x="6" y="4" width="12" height="18" rx="1"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 13l2 2 4-4"/></svg>;
    // misc
    case "search":       return <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>;
    case "filter":       return <svg {...p}><polygon points="3 4 21 4 14 13 14 20 10 21 10 13"/></svg>;
    case "more":         return <svg {...p}><circle cx="5" cy="12" r="1" fill={color}/><circle cx="12" cy="12" r="1" fill={color}/><circle cx="19" cy="12" r="1" fill={color}/></svg>;
    case "shield":       return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>;
    case "circle":       return <svg {...p}><circle cx="12" cy="12" r="8"/></svg>;
    case "diamond":      return <svg {...p}><polygon points="12 3 21 12 12 21 3 12"/></svg>;
    case "square":       return <svg {...p}><rect x="5" y="5" width="14" height="14" rx="1"/></svg>;
    case "triangle":     return <svg {...p}><path d="M12 4l9 16H3z"/></svg>;
    default:             return null;
  }
}

window.AfIcon = AfIcon;

/* global React, SERGE, StatusChip, Modal, Select, SectionRule, docState */
/* ============================================================
   DocumentationDM.jsx — ONGLET 4 · Documentation (NEW)
   4.1 dropdown chauffeur (cross-onglet) · 4.2 arbre docs ·
   4.3 icônes statut · 4.4 bandeau confidentialité · 4.5 lightbox
   ============================================================ */
const { useState: useStateDOC, useEffect: useEffectDOC } = React;

function statusIcon(st) {
  if (st === "ok")   return { icon: "check-circle-2", color: "var(--ok)" };
  if (st === "warn") return { icon: "clock", color: "var(--warn)" };
  if (st === "err")  return { icon: "x-circle", color: "var(--err)" };
  return { icon: "minus-circle", color: "var(--fg-mute)" };
}

function buildTree(d) {
  return [
    { group: "Identité", n: 5, docs: [
      { name: "CIN", st: "ok", meta: "validée · 12/01/2024" },
      { name: `Permis · catégorie ${d.cat}`, st: docState(d.permisDays), meta: `échéance ${d.permisExp}${d.permisDays < 60 ? ` · ${d.permisDays} j` : ""}` },
      { name: "Justificatif de résidence", st: "ok", meta: "renouvelé · 03/2025" },
      { name: "Contrat de travail", st: "ok", meta: `ancienneté ${d.anc} ans` },
      { name: "Visite médicale", st: docState(d.medDays), meta: d.medDays < 0 ? `expirée ${d.medExp} · convocation` : `valide ${d.medExp}`, confid: true },
    ]},
    { group: "Formation", n: 4, docs: [
      { name: "Théorie embauche", st: "ok", meta: "validée" },
      { name: "Accompagnement MENTOR", st: "ok", meta: "clôturé J+90" },
      { name: "Certifications HSE", st: d.inc > 0 ? "warn" : "ok", meta: d.inc > 0 ? "recyclage planifié" : "à jour" },
      { name: "Conduite 6X4 mining", st: "ok", meta: "habilitation active" },
    ]},
    { group: "Voyages · historique (W02 · 30 derniers)", n: 3, docs: [
      { name: `Voyage #${230 + (d.permisDays % 9)} · ${d.route}`, st: "ok", meta: `${d.matiere} · clôturé propre` },
      { name: `Voyage #${224 + (d.permisDays % 7)} · ${d.route}`, st: "ok", meta: `${d.matiere} · facturé` },
      { name: "… 28 voyages supplémentaires", st: "na", meta: "lien onglet historique" },
    ]},
    { group: "Authority Matrix · DDV chauffeur (W11)", n: 1, docs: [
      { name: "DDV catégorie 13 · historique", st: "ok", meta: "0 dépassement seuil · 30 j" },
    ]},
    { group: "M13 chauffeur", n: 1, docs: [
      { name: "Entrées M13 filtrées", st: "na", meta: `${SERGE.m13.filter(m => m.driver === d.id).length} entrées · lien onglet Carnet` },
    ]},
    { group: "Évaluations", n: 3, docs: [
      { name: "Onboarding J+7 / J+30 / J+90", st: "ok", meta: "clôturé · titularisé" },
      { name: "Trimestriel Pacte TER", st: "ok", meta: "Édienne · privé sauf score", confid: true },
      { name: "Annuel 360°", st: "na", meta: "privé sauf résumé", confid: true },
    ]},
  ];
}

function DocTreeGroup({ group, onDoc }) {
  const [open, setOpen] = useStateDOC(true);
  useEffectDOC(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 20); return () => clearTimeout(t); }, [open]);
  return (
    <div style={{ borderBottom: "1px solid var(--border-soft)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer" }}>
        <i data-lucide={open ? "chevron-down" : "chevron-right"} style={{ width: 15, height: 15, color: "var(--fg-3)" }} />
        <i data-lucide="folder" style={{ width: 15, height: 15, color: "var(--accent)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{group.group}</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>({group.n})</span>
      </div>
      {open && group.docs.map((doc, i) => {
        const si = statusIcon(doc.st);
        return (
          <div key={i} onClick={() => onDoc(doc)} style={{ display: "grid", gridTemplateColumns: "32px auto 1fr auto auto", gap: 10, alignItems: "center", padding: "9px 16px 9px 44px", cursor: "pointer", borderTop: "1px solid var(--border-soft)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elev-1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <i data-lucide={si.icon} style={{ width: 15, height: 15, color: si.color }} />
            <i data-lucide="file-text" style={{ width: 14, height: 14, color: "var(--fg-3)" }} />
            <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{doc.name}</span>
            {doc.confid && <span title="RBAC Édienne · RLS B17" style={{ display: "inline-flex" }}><i data-lucide="lock" style={{ width: 12, height: 12, color: "var(--fg-mute)" }} /></span>}
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: doc.st === "err" ? "var(--err)" : doc.st === "warn" ? "var(--warn)" : "var(--fg-3)" }}>{doc.meta}</span>
          </div>
        );
      })}
    </div>
  );
}

function DocumentationDM({ selectedId, onSelect }) {
  const [doc, setDoc] = useStateDOC(null);
  const dId = selectedId || SERGE.drivers[0].id;
  const d = SERGE.drivers.find(x => x.id === dId);
  const tree = buildTree(d);

  useEffectDOC(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 40); return () => clearTimeout(t); }, [dId, doc]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "26px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* 4.1 header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600 }}>Arbre documentaire · chauffeur</span>
        <Select value={dId} onChange={(e) => onSelect(e.target.value)}>
          {SERGE.drivers.map(x => <option key={x.id} value={x.id}>{x.id} · {x.ct} · {x.client}</option>)}
        </Select>
        <StatusChip kind={d.statut === "actif" ? "ok" : d.statut === "conge" ? "warn" : "err"} mono>{d.statut}</StatusChip>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>cross-onglet · présélection Fleet Grid</span>
      </div>

      {/* 4.4 confidentialité */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6 }}>
        <i data-lucide="shield-check" style={{ width: 15, height: 15, color: "var(--fg-3)" }} />
        <span style={{ fontSize: 12, color: "var(--fg-2)" }}>Données médicales · RBAC Édienne uniquement (RLS B17). Serge voit les faits opérationnels seulement.</span>
      </div>

      {/* 4.2 tree */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)" }}>
          <i data-lucide="folder-tree" style={{ width: 16, height: 16, color: "var(--accent)" }} />
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{d.id}</span>
          <span style={{ fontSize: 12, color: "var(--fg-3)" }}>· dossier documentaire complet</span>
        </div>
        {tree.map((g, i) => <DocTreeGroup key={i} group={g} onDoc={setDoc} />)}
      </div>

      {/* 4.3 légende */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 11, color: "var(--fg-3)" }}>
        {[["check-circle-2", "var(--ok)", "présent · à jour"], ["clock", "var(--warn)", "échéance < 60 j"], ["x-circle", "var(--err)", "expiré · manquant"], ["minus-circle", "var(--fg-mute)", "non applicable"]].map((l, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <i data-lucide={l[0]} style={{ width: 13, height: 13, color: l[1] }} /> {l[2]}
          </span>
        ))}
      </div>

      {/* 4.5 lightbox */}
      <Modal open={!!doc} onClose={() => setDoc(null)} width={480} eyebrow={`${d.id} · document`} title={doc?.name || ""}>
        {doc && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 180, background: "var(--bg-elev-1)", border: "1px dashed var(--border)", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--fg-3)" }}>
              <i data-lucide="file-text" style={{ width: 28, height: 28 }} />
              <span style={{ fontSize: 12 }}>Aperçu document · mock</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[["Statut", doc.meta], ["Confidentialité", doc.confid ? "RBAC Édienne · RLS B17" : "opérationnel · Serge"], ["Responsable", doc.confid ? "Édienne · RH" : "Serge · Driver Manager"]].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-soft)" }}>
                  <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{r[0]}</span>
                  <span style={{ fontSize: 13, color: "var(--fg-1)", fontFamily: "Inter" }}>{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

window.DocumentationDM = DocumentationDM;

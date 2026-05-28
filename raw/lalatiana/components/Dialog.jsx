/* global React */
const { useEffect: dlgUseEffect } = React;

// ───────── DIALOG SHELL ─────────
function Dialog({ open, onClose, title, sub, children, maxWidth = 760, footer }) {
  dlgUseEffect(() => {
    if (!open) return;
    const t = setTimeout(() => window.lucide && lucide.createIcons(), 30);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 80,
      background: "color-mix(in srgb, #061829 70%, transparent)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "60px 20px", overflowY: "auto",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 12, maxWidth, width: "100%",
        boxShadow: "var(--shadow-2)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 24px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 4, border: "1px solid var(--border)",
            background: "var(--surface-2)", color: "var(--fg-2)", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <i data-lucide="x" style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
        {footer && (
          <div style={{
            padding: "14px 24px", borderTop: "1px solid var(--border)",
            background: "var(--bg-elev-1)",
            display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center", flexWrap: "wrap",
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────── FORM ATOMS ─────────
function FormSection({ tag, title, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        {tag && <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
          padding: "2px 6px", borderRadius: 2, background: "var(--accent-soft)",
          color: "var(--accent)", letterSpacing: "0.08em",
        }}>{tag}</span>}
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
        {hint && <span style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: "auto" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 6, fontWeight: 500 }}>
        {label}{required && <span style={{ color: "var(--err)", marginLeft: 4 }}>*</span>}
      </div>
      {children}
    </label>
  );
}

const fieldBaseStyle = {
  width: "100%", boxSizing: "border-box",
  background: "var(--bg)", color: "var(--fg-1)",
  border: "1px solid var(--border)", borderRadius: 4,
  padding: "8px 10px", fontSize: 13, fontFamily: "Inter, sans-serif",
  outline: "none",
};

function TextInput(props) {
  return <input {...props} style={{ ...fieldBaseStyle, ...(props.style || {}) }} />;
}

function TextArea(props) {
  return <textarea {...props} rows={props.rows || 3} style={{ ...fieldBaseStyle, resize: "vertical", fontFamily: "Inter, sans-serif", ...(props.style || {}) }} />;
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      ...fieldBaseStyle, appearance: "none",
      backgroundImage: "linear-gradient(45deg, transparent 50%, var(--fg-3) 50%), linear-gradient(135deg, var(--fg-3) 50%, transparent 50%)",
      backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
      backgroundSize: "5px 5px",
      backgroundRepeat: "no-repeat",
      paddingRight: 28,
    }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

function Radio({ value, onChange, options, name }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(o => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const on = value === v;
        return (
          <label key={v} style={{
            display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            padding: "8px 12px", borderRadius: 4,
            border: `1px solid ${on ? "var(--accent)" : "var(--border)"}`,
            background: on ? "var(--accent-soft)" : "var(--bg)",
            color: on ? "var(--accent)" : "var(--fg-2)",
            fontSize: 12.5,
          }}>
            <input
              type="radio"
              name={name}
              checked={on}
              onChange={() => onChange(v)}
              style={{ accentColor: "var(--accent)" }}
            />
            {l}
          </label>
        );
      })}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
      padding: "8px 12px", borderRadius: 4,
      border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
      background: checked ? "var(--accent-soft)" : "var(--bg)",
      color: checked ? "var(--accent)" : "var(--fg-2)",
      fontSize: 12.5,
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: "var(--accent)" }}
      />
      {label}
    </label>
  );
}

// ───────── BUTTONS ─────────
function PrimaryBtn({ children, onClick, icon, type = "button", style }) {
  return (
    <button type={type} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "9px 14px", borderRadius: 4,
      background: "var(--accent)", color: "var(--accent-fg)",
      border: "1px solid var(--accent)", fontWeight: 600, fontSize: 13, cursor: "pointer",
      fontFamily: "Inter, sans-serif", letterSpacing: 0,
      ...(style || {}),
    }}>
      {icon && <i data-lucide={icon} style={{ width: 14, height: 14 }} />}
      {children}
    </button>
  );
}
function SecondaryBtn({ children, onClick, icon, style }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "9px 14px", borderRadius: 4,
      background: "var(--surface-2)", color: "var(--fg-1)",
      border: "1px solid var(--border)", fontWeight: 500, fontSize: 13, cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      ...(style || {}),
    }}>
      {icon && <i data-lucide={icon} style={{ width: 14, height: 14 }} />}
      {children}
    </button>
  );
}
function DangerBtn({ children, onClick, icon, style }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "9px 14px", borderRadius: 4,
      background: "color-mix(in srgb, var(--warn) 14%, transparent)",
      color: "var(--warn)",
      border: "1px solid color-mix(in srgb, var(--warn) 40%, transparent)",
      fontWeight: 600, fontSize: 13, cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      ...(style || {}),
    }}>
      {icon && <i data-lucide={icon} style={{ width: 14, height: 14 }} />}
      {children}
    </button>
  );
}
function GhostBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 14px", borderRadius: 4,
      background: "transparent", color: "var(--fg-2)",
      border: "1px solid var(--border)", fontWeight: 500, fontSize: 13, cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      ...(style || {}),
    }}>{children}</button>
  );
}

Object.assign(window, { Dialog, FormSection, Field, TextInput, TextArea, Select, Radio, Checkbox, PrimaryBtn, SecondaryBtn, DangerBtn, GhostBtn });

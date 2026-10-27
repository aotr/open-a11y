/**
 * AccessibilityPanel — React component that renders the full settings panel
 * inline, rather than as a floating overlay. Useful for embedding in
 * settings pages or dashboard areas.
 *
 * All tools and profiles are derived from the shared manifest.
 *
 * @example
 *   <AccessibilityPanel />
 */
"use client";

import { useCallback } from "react";
import { useAccessibility } from "../hooks/useAccessibility";
import { PROFILES } from "../../profiles";
import { LANGUAGES } from "../../i18n/languages";
import { translate } from "../../i18n/translator";
import { renderLucideIcon } from "../../ui/icons/lucide";
import {
  CONTINUOUS_TOOLS,
  getTool,
  isExclusiveTool,
  toolsByCategory,
  type ContinuousTool,
  type Tool,
} from "../../tools/manifest";

const PRIMARY = "var(--asw-brand-primary, #0f766e)";

function ToolIcon({
  id,
  size = 28,
  color = "#475569",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-flex", color }}
      dangerouslySetInnerHTML={{ __html: renderLucideIcon(id, size) }}
    />
  );
}

function ToolButton({
  tool,
  label,
  enabled,
  onToggle,
}: {
  tool: Tool;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        aspectRatio: "6 / 5",
        borderRadius: "12px",
        padding: "10px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8px",
        cursor: "pointer",
        border: `2px solid ${enabled ? PRIMARY : "var(--asw-border, #e2e5ea)"}`,
        background: enabled ? "rgba(15, 118, 110, 0.08)" : "var(--asw-card-bg, #fff)",
        fontFamily: "inherit",
        fontSize: "16px",
        color: "inherit",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      aria-pressed={enabled}
    >
      <ToolIcon id={tool.icon} color={enabled ? PRIMARY : "#475569"} />
      <span style={{ fontSize: "12px", lineHeight: "1.2", fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function ContinuousControl({
  tool,
  label,
  value,
  onChange,
}: {
  tool: ContinuousTool;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const step = (direction: 1 | -1) => {
    const next = Math.max(tool.min, Math.min(tool.max, value + direction * tool.step));
    const decimals = String(tool.step).split(".")[1]?.length ?? 0;
    onChange(Number(next.toFixed(decimals)));
  };

  return (
    <div
      style={{
        background: "var(--asw-card-bg, #fff)",
        padding: "16px 20px",
        borderRadius: "12px",
        marginBottom: "12px",
        border: "1px solid var(--asw-border, #e2e5ea)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ToolIcon id={tool.icon} size={20} color={PRIMARY} />
        <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "14px",
        }}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Decrease ${label}`}
          style={stepButtonStyle}
        >
          <ToolIcon id="minus" size={18} color="#242424" />
        </button>
        <span
          aria-live="polite"
          style={{ fontSize: "18px", fontWeight: 600, minWidth: "60px", textAlign: "center" }}
        >
          {tool.format(value)}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`Increase ${label}`}
          style={stepButtonStyle}
        >
          <ToolIcon id="plus" size={18} color="#242424" />
        </button>
      </div>
    </div>
  );
}

const stepButtonStyle = {
  background: "var(--asw-bg, #f0f2f6)",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  border: "2px solid transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: 0.65,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export function AccessibilityPanel() {
  const { engine, states, lang, toggleTool, applyProfile, deactivateProfile, setLanguage, reset } =
    useAccessibility();

  const labels = engine?.config?.labels ?? {};
  const label = (key: string) => labels[key] ?? translate(key, lang);
  const brand = engine?.config?.brand;
  const footerText = brand?.footerText ?? (brand?.name ? `Accessibility by ${brand.name}` : "");

  const activeProfile = typeof states.activeProfile === "string" ? states.activeProfile : null;

  const setContinuous = useCallback(
    (tool: ContinuousTool, value: number) => {
      toggleTool(tool.id, value);
    },
    [toggleTool],
  );

  const isEnabled = (tool: Tool): boolean => {
    if (isExclusiveTool(tool)) return states[tool.group.stateKey] === tool.id;
    return !!states[tool.id];
  };

  const renderTools = (tools: Tool[]) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
      {tools.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          label={label(tool.labelKey)}
          enabled={isEnabled(tool)}
          onToggle={() => toggleTool(tool.id)}
        />
      ))}
    </div>
  );

  const contentTools = toolsByCategory("content");
  const contentButtons = contentTools.filter((tool) => getTool(tool.id)?.kind !== "continuous");

  return (
    <div style={{ padding: "20px", maxWidth: "560px", margin: "0 auto" }}>
      <Section title={label("categories.profiles")}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {Object.values(PROFILES).map((profile) => {
            const selected = activeProfile === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() =>
                  selected ? deactivateProfile(profile.id) : applyProfile(profile.id)
                }
                aria-pressed={selected}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: `2px solid ${selected ? PRIMARY : "transparent"}`,
                  background: selected ? "rgba(15, 118, 110, 0.08)" : "var(--asw-card-bg, #fff)",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ToolIcon id={profile.icon} size={24} color={selected ? PRIMARY : "#475569"} />
                <span>{label(profile.label)}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={label("language.label")}>
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label={label("language.label")}
          style={{
            width: "100%",
            padding: "0 15px",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "45px",
            background: "var(--asw-card-bg, #fff)",
            color: "inherit",
            border: "2px solid var(--asw-border, #e2e5ea)",
            height: "45px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </Section>

      <Section title={label("categories.content")}>
        {CONTINUOUS_TOOLS.map((tool) => {
          const raw = states[tool.stateKey];
          const value = typeof raw === "number" ? raw : tool.defaultValue;
          return (
            <ContinuousControl
              key={tool.id}
              tool={tool}
              label={label(tool.labelKey)}
              value={value}
              onChange={(next) => setContinuous(tool, next)}
            />
          );
        })}
        {renderTools(contentButtons)}
      </Section>

      <Section title={label("categories.color")}>{renderTools(toolsByCategory("color"))}</Section>

      <Section title={label("categories.textAlign")}>
        {renderTools(toolsByCategory("text-align"))}
      </Section>

      <Section title={label("categories.tools")}>{renderTools(toolsByCategory("tools"))}</Section>

      <button
        type="button"
        onClick={reset}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "15px",
          fontWeight: 600,
          background: PRIMARY,
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {label("widget.reset")}
      </button>

      {footerText && (
        <footer
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid var(--asw-border, #e2e5ea)",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--asw-text-muted, #64748b)",
          }}
        >
          {brand?.url ? (
            <a
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              {footerText}
            </a>
          ) : (
            <span>{footerText}</span>
          )}
        </footer>
      )}
    </div>
  );
}

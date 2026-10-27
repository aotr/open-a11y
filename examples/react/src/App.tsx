import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityEngine, localStorageAdapter } from "@aotr/open-a11y";
import { AccessibilityProvider, AccessibilityWidget } from "@aotr/open-a11y/react";
import {
  DEFAULT_DEMO_STATE,
  createDemoCustomizer,
  mountStateInspector,
  toDemoConfig,
  type DemoUiState,
} from "../../shared/customizer";

const engine = new AccessibilityEngine({ storage: localStorageAdapter });

export function App() {
  const [state, setState] = useState<DemoUiState>(DEFAULT_DEMO_STATE);
  const config = useMemo(() => toDemoConfig(state), [state]);
  const customizerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customizerRef.current) return;
    createDemoCustomizer(customizerRef.current, DEFAULT_DEMO_STATE, (next) => {
      setState(next);
    });
  }, []);

  useEffect(() => {
    if (!stateRef.current) return;
    return mountStateInspector(stateRef.current, engine);
  }, []);

  useEffect(() => {
    void engine.setLanguage(state.language);
  }, [state.language]);

  return (
    <AccessibilityProvider engine={engine} autoInit>
      <AccessibilityWidget config={config} />
      <main className="demo-shell">
        <header className="demo-header">
          <div>
            <div className="demo-brand">
              <span className="demo-mark">a11y</span> open-a11y
            </div>
            <h1>Accessibility that fits the page, not the other way around.</h1>
          </div>
          <span className="demo-badge">React 19</span>
        </header>

        <p className="demo-lede">
          The React adapter provides a provider, hooks, and declarative components. The engine
          remains the single state owner; the panel and floating widget stay in sync through one
          subscription.
        </p>

        <div className="demo-grid">
          <section className="demo-card">
            <h2>Typed by default</h2>
            <p>
              Use <code>useAccessibility()</code> for the context, or{" "}
              <code>useAccessibilityTool('font-weight')</code> for one tool. Both read the same
              canonical state as the web component menu.
            </p>
            <ul>
              <li>React 17+ peer dependency.</li>
              <li>Declarative widget lifecycle.</li>
              <li>Profiles, reset, language, and persistence included.</li>
            </ul>
          </section>
          <section className="demo-card">
            <h2>Live state</h2>
            <div ref={stateRef} />
          </section>
        </div>

        <div ref={customizerRef} />

        <footer className="demo-footer">
          <span>open-a11y · MIT licensed</span>
          <a href="https://github.com/aotr/open-a11y">GitHub</a>
        </footer>
      </main>
    </AccessibilityProvider>
  );
}

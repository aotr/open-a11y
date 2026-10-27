/**
 * useAccessibilityTool — Hook for an individual tool's state and controls.
 *
 * @example
 *   const { enabled, toggle } = useAccessibilityTool('font-weight')
 *   return <button onClick={toggle}>{enabled ? 'ON' : 'OFF'}</button>
 *
 * @example
 *   const { value, setValue } = useAccessibilityTool('font-size')
 *   // value is a number (1.0 = 100%)
 *   return <input type="range" value={value} onChange={e => setValue(+e.target.value)} />
 */
"use client";

import { useCallback, useMemo } from "react";
import { useAccessibilityContext } from "../provider/AccessibilityProvider";
import { getTool, isContinuousTool, isExclusiveTool } from "../../tools/manifest";

export function useAccessibilityTool(toolId: string) {
  const ctx = useAccessibilityContext();
  const tool = getTool(toolId);
  const stateKey = isContinuousTool(tool)
    ? tool.stateKey
    : isExclusiveTool(tool)
      ? tool.group.stateKey
      : toolId;

  const isEnabled = useMemo(() => {
    if (isExclusiveTool(tool)) return ctx.settings.states?.[tool.group.stateKey] === tool.id;
    return !!ctx.settings.states?.[stateKey];
  }, [ctx.settings.states, stateKey, tool]);

  const value = useMemo(() => ctx.settings.states?.[stateKey], [ctx.settings.states, stateKey]);

  const toggle = useCallback(() => {
    ctx.toggleTool(toolId);
  }, [ctx, toolId]);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      ctx.toggleTool(toolId, enabled);
    },
    [ctx, toolId],
  );

  const setValue = useCallback(
    (val: unknown) => {
      if (isContinuousTool(tool)) {
        ctx.toggleTool(toolId, Number(val));
      } else {
        ctx.toggleTool(toolId, !!val);
      }
    },
    [ctx, toolId, tool],
  );

  return {
    /** Whether the tool is currently enabled */
    enabled: isEnabled,
    /** Raw value of the tool state (numeric for continuous tools) */
    value,
    /** Toggle the tool (boolean flip) */
    toggle,
    /** Explicitly set enabled state */
    setEnabled,
    /** Set a value (numeric tools) or enabled state */
    setValue,
  };
}

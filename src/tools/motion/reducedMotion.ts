import { injectToolCSS } from "../../css/cssInjector";
import type { IToolConfig } from "../../types";
import { ALL_SELECTORS } from "../../css/selectors";

const reducedMotionConfig: IToolConfig = {
  id: "reduced-motion",
  selector: "html",
  childrenSelector: ALL_SELECTORS,
  styles: {
    transition: "none",
    animation: "none",
    "scroll-behavior": "auto",
  },
};

export default function reducedMotion(enable = false): void {
  injectToolCSS({ ...reducedMotionConfig, enable });
}

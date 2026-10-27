import { injectToolCSS } from "../../css/cssInjector";
import type { IToolConfig } from "../../types";
import { ALL_ELEMENT_SELECTORS } from "../../css/selectors";

const fontWeightConfig: IToolConfig = {
  id: "font-weight",
  selector: "html",
  childrenSelector: ALL_ELEMENT_SELECTORS,
  styles: {
    "font-weight": "700",
  },
};

export default function fontWeight(enable = false): void {
  injectToolCSS({ ...fontWeightConfig, enable });
}

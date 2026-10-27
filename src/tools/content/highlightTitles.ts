import { injectToolCSS } from "../../css/cssInjector";
import type { IToolConfig } from "../../types";
import { HEADER_SELECTORS } from "../../css/selectors";

const highlightTitlesConfig: IToolConfig = {
  id: "highlight-title",
  selector: "html",
  childrenSelector: HEADER_SELECTORS,
  styles: {
    outline: "3px solid #0048ff",
    "outline-offset": "2px",
  },
};

export default function highlightTitles(enable = false): void {
  injectToolCSS({ ...highlightTitlesConfig, enable });
}

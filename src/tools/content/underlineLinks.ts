import { injectToolCSS } from "../../css/cssInjector";
import type { IToolConfig } from "../../types";

const underlineLinksConfig: IToolConfig = {
  id: "underline-links",
  selector: "html.asw-underline-links",
  childrenSelector: ["a[href]"],
  styles: {
    "text-decoration-line": "underline !important",
    "text-decoration-color": "currentColor !important",
    "text-decoration-thickness": "max(1px, 0.08em) !important",
    "text-underline-offset": "0.16em !important",
    "text-decoration-skip-ink": "auto !important",
  },
};

export default function underlineLinks(enable = false): void {
  injectToolCSS({ ...underlineLinksConfig, enable });
}

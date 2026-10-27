import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const source = fs.readFileSync(path.join(repo, "src/angular/index.ts"), "utf8");

const replacements = [
  [/from ["']\.\.\/engine\/AccessibilityEngine["']/g, 'from "@aotr/open-a11y"'],
  [/from ["']\.\.\/types\/ISettings["']/g, 'from "@aotr/open-a11y"'],
  [/from ["']\.\.\/ui\/wire-up["']/g, 'from "@aotr/open-a11y"'],
  [/from ["']\.\.\/ui\/lifecycle["']/g, 'from "@aotr/open-a11y"'],
  [/from ["']\.\.\/storage["']/g, 'from "@aotr/open-a11y"'],
];

let output = source;
for (const [from, to] of replacements) output = output.replace(from, to);
output = `// Generated from src/angular/index.ts by scripts/sync-angular.mjs.\n${output}`;

const target = path.join(repo, "angular-lib/src/public-api.ts");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, output);
console.log("Synced Angular adapter source");

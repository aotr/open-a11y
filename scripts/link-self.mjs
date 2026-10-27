import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const scope = path.join(root, "node_modules", "@aotr");
const link = path.join(scope, "open-a11y");

fs.mkdirSync(scope, { recursive: true });
try {
  const stat = fs.lstatSync(link);
  if (stat.isSymbolicLink()) fs.unlinkSync(link);
} catch {}
fs.symlinkSync(root, link, "dir");
console.log(`Linked ${link} -> ${root}`);

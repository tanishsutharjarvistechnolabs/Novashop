import fs from "node:fs";
import path from "node:path";

function staticPagesDir() {
  return path.join(process.cwd(), "src", "static", "pages");
}

export function readStaticPageHtml(fileName: string) {
  const fullPath = path.join(staticPagesDir(), fileName);
  return fs.readFileSync(fullPath, "utf8");
}

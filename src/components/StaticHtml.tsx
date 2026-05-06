import type { StaticHtmlProps } from "@/interfaces";

export function StaticHtml({ html }: StaticHtmlProps) {
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}

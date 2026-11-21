import { defaultLocale } from "@/i18n/config";

/** The site lives under /en/ and /zh/. A static export cannot redirect, so the bare address forwards in the browser. */
export default function RootPage() {
  const target = defaultLocale + "/";
  return (
    <>
      <meta httpEquiv="refresh" content={"0; url=" + target} />
      <a href={target}>{target}</a>
    </>
  );
}

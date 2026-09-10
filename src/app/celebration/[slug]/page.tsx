import CelebrationDetailClient from "./CelebrationDetailClient";

// Same static-export constraint as /charities/[slug]: celebrations are
// created at runtime by hosts, so there's no set of slugs known at build
// time to pre-render. This route builds a single shell at
// /celebration/_shell; public/_redirects rewrites /celebration/* to it with
// a 200 (a rewrite, not a redirect, so the browser keeps the real slug in
// the URL), and CelebrationDetailClient reads the slug from
// window.location and fetches it client-side.
//
// generateStaticParams can't live in a "use client" file, which is why the
// UI sits in CelebrationDetailClient.tsx instead of here.
export function generateStaticParams() {
  return [{ slug: "_shell" }];
}

export default function CelebrationDetailPage() {
  return <CelebrationDetailClient />;
}

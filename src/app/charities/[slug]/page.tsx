import CharityDetailClient from "./CharityDetailClient";

// Static export can't pre-render one HTML file per charity slug anymore --
// charities are added at runtime by a non-technical admin, not known at
// build time (see docs/plan.md "Phase 7: Live Charity Data"). Instead this
// route builds a single static shell at /charities/_shell; public/_redirects
// rewrites any /charities/* request to that shell (200, so the URL bar keeps
// the real slug), and CharityDetailClient reads the actual slug from
// window.location client-side and fetches it. Standard technique for
// dynamic routes on a static host -- see the nginx try_files example in
// node_modules/next/dist/docs/01-app/02-guides/static-exports.md for the
// same idea applied to a different static host.
//
// generateStaticParams must live in this Server Component file -- a page
// can't be both "use client" and export it -- so the actual UI lives in
// CharityDetailClient.tsx instead.
export function generateStaticParams() {
  return [{ slug: "_shell" }];
}

export default function CharityDetailPage() {
  return <CharityDetailClient />;
}

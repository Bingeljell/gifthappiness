// Shows a charity's uploaded logo when it has one, falling back to the
// existing category-initial badge otherwise (most charities won't have a
// logo uploaded yet -- see docs/plan.md "Phase 8: Charity Pictures").
export default function CharityBadge({
  logoUrl,
  category,
  size = "md",
}: {
  logoUrl: string | null;
  category: string;
  size?: "md" | "lg";
}) {
  const dimension = size === "lg" ? "w-16 h-16" : "w-14 h-14";

  if (logoUrl) {
    // object-contain (not cover) -- a logo's whole mark matters, unlike a
    // photo where cropping the edges is fine. The white background + small
    // padding avoids a hard edge/gap where a non-square or transparent-bg
    // logo doesn't fill the circle.
    return (
      <div className={`${dimension} rounded-full bg-white border border-gray-100 shrink-0 p-2`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={category} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={`${dimension} rounded-full bg-soft-pink text-primary-pink flex items-center justify-center font-black text-sm shrink-0`}>
      {category.slice(0, 2).toUpperCase()}
    </div>
  );
}

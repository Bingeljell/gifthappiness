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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={category} className={`${dimension} rounded-full object-cover border border-gray-100 shrink-0`} />;
  }

  return (
    <div className={`${dimension} rounded-full bg-soft-pink text-primary-pink flex items-center justify-center font-black text-sm shrink-0`}>
      {category.slice(0, 2).toUpperCase()}
    </div>
  );
}

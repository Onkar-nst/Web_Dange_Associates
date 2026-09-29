// The one section label ("eyebrow") style used across the site: soft blue pill,
// dot, small uppercase tracked text. Use `dark` on dark backgrounds.
export default function SectionLabel({ children, dark = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-widest ${
        dark ? "border-white/15 bg-white/10 text-blue-200 backdrop-blur" : "border-blue-100 bg-blue-50 text-blue-700"
      } ${className}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dark ? "bg-blue-300" : "bg-blue-400"}`} />
      {children}
    </span>
  );
}

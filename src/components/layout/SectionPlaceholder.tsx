/**
 * Interim body for nav routes whose full page is still being built. Keeps
 * the navigation free of dead links during the page-by-page build-out;
 * each route file replaces this with its real content when that page is
 * built.
 */
export default function SectionPlaceholder({
  noteAr,
  noteEn,
}: {
  noteAr?: string;
  noteEn?: string;
}) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-wrap-sm px-5 py-28 text-center sm:px-8 sm:py-36 lg:px-10">
        <div className="inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-forest-700">
          <span aria-hidden className="h-[2px] w-7 bg-scarlet-400" />
          <span className="ar">قيد الإعداد</span>
          <span className="en">In preparation</span>
        </div>
        <p className="mt-6 font-disp text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-snug tracking-tight text-text-1">
          <span className="ar">يجري إعداد هذه الصفحة وستُتاح قريباً.</span>
          <span className="en">
            This page is being prepared and will be available shortly.
          </span>
        </p>
        <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-text-3">
          <span className="ar">
            {noteAr ?? "نعمل على إصدارها ضمن المرحلة الحالية من تطوير الموقع."}
          </span>
          <span className="en">
            {noteEn ??
              "It is part of the current phase of the site build and will go live soon."}
          </span>
        </p>
      </div>
    </section>
  );
}

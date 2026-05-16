import Link from "next/link";

interface Crumb {
  href: string;
  ar: string;
  en: string;
}

interface PageHeaderProps {
  kickerAr: string;
  kickerEn: string;
  titleAr: string;
  titleEn: string;
  leadAr?: string;
  leadEn?: string;
  crumbs?: Crumb[];
}

/**
 * Federation page-header band. Server component (no client cost): the
 * navigation fade-in is handled globally by app/template.tsx. Used on
 * every interior route so titling, breadcrumb, and the dark masthead
 * read identically site-wide.
 */
export default function PageHeader({
  kickerAr,
  kickerEn,
  titleAr,
  titleEn,
  leadAr,
  leadEn,
  crumbs = [],
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
      />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.14]" />

      <div className="relative mx-auto max-w-wrap px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-white">
            <span className="ar">الرئيسية</span>
            <span className="en">Home</span>
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-2">
              <span aria-hidden className="text-white/25">/</span>
              {i === crumbs.length - 1 ? (
                <span className="text-white/70">
                  <span className="ar">{c.ar}</span>
                  <span className="en">{c.en}</span>
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="transition-colors hover:text-white"
                >
                  <span className="ar">{c.ar}</span>
                  <span className="en">{c.en}</span>
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-6 inline-flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-forest-400">
          <span aria-hidden className="h-[2px] w-8 bg-scarlet-400" />
          <span className="ar">{kickerAr}</span>
          <span className="en">{kickerEn}</span>
        </div>

        <h1 className="font-disp t-h1 max-w-4xl leading-[1.08] tracking-tight text-white">
          <span className="ar">{titleAr}</span>
          <span className="en">{titleEn}</span>
        </h1>

        {leadAr && leadEn && (
          <p className="mt-6 max-w-3xl text-[1.0625rem] leading-relaxed text-white/65 sm:text-[1.15rem]">
            <span className="ar">{leadAr}</span>
            <span className="en">{leadEn}</span>
          </p>
        )}
      </div>
    </section>
  );
}

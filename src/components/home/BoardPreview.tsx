"use client";

import type { BoardMember } from "@/lib/queries/home";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function BoardPreview({ members }: { members: BoardMember[] }) {
  return (
    <section className="bg-ivory2">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">مجلس الإدارة</span>
              <span className="en">Board of Directors</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">القائدات خلف النادي</span>
            <span className="en">The Women Behind the Club</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        {members.length === 0 ? (
          <p className="text-center text-sm text-ink3 opacity-70">
            <span className="ar">لم تتم إضافة أعضاء المجلس بعد.</span>
            <span className="en">Board members have not been added yet.</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {members.map((m) => (
              <article
                key={m.id}
                className="group relative bg-white border border-stone pt-10 pb-7 px-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.3)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red via-white to-green2" />

                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="absolute -inset-1 bg-gradient-to-br from-red via-white to-green2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-full h-full rounded-full bg-ink overflow-hidden flex items-center justify-center text-ivory">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.image_url}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-disp text-2xl">{initials(m.name)}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-disp text-xl text-ink mb-2 leading-tight">
                  {m.name}
                </h3>
                {m.role && (
                  <div className="text-[0.78rem] uppercase tracking-[0.2em] text-red font-bold">
                    {m.role}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

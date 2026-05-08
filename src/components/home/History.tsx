"use client";

interface Milestone {
  year:  string;
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  accent: "red" | "green" | "ink" | "gold";
}

const MILESTONES: Milestone[] = [
  {
    year:  "1991",
    ar:    "التأسيس",
    en:    "Foundation",
    arDsc: "تأسس النادي رسمياً ليكون أول كيان نسائي مخصص للشطرنج والثقافة في إمارة الشارقة.",
    enDsc: "The club is officially established as one of the first dedicated women&rsquo;s chess and cultural institutions in the Emirate of Sharjah.",
    accent: "red",
  },
  {
    year:  "2000s",
    ar:    "البنية الاحترافية",
    en:    "Professional Era",
    arDsc: "إطلاق برامج تدريبية احترافية وتأهيل أول جيل من المدربات الإماراتيات.",
    enDsc: "Launch of professional training programmes and the qualification of the first generation of Emirati women coaches.",
    accent: "green",
  },
  {
    year:  "2010s",
    ar:    "التميّز الإقليمي",
    en:    "Regional Excellence",
    arDsc: "حصد الميداليات في البطولات الخليجية والعربية، وتمثيل الإمارات في المحافل الدولية.",
    enDsc: "Medal-winning performances at GCC and Arab championships, and international representation of the UAE.",
    accent: "ink",
  },
  {
    year:  "2018",
    ar:    "اعتماد الجودة",
    en:    "ISO Certification",
    arDsc: "حصل النادي على شهادة الجودة العالمية ISO تتويجاً لمنظومته الإدارية الاحترافية.",
    enDsc: "The club is awarded international ISO quality certification, recognising its professional management framework.",
    accent: "gold",
  },
  {
    year:  "اليوم • Today",
    ar:    "الجيل الجديد",
    en:    "The New Generation",
    arDsc: "أكثر من 180 لاعبة في برامج النادي، ومنظومة رقمية حديثة لإدارة التدريب والتقييم.",
    enDsc: "Over 180 active players across our programmes, supported by a modern digital platform for training and assessment.",
    accent: "red",
  },
];

export default function History() {
  return (
    <section className="bg-ivory2 relative overflow-hidden">
      <div className="chess-tex absolute inset-0 opacity-30" />
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">التاريخ والإرث</span>
              <span className="en">History &amp; Legacy</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">أكثر من ثلاثة عقود من العطاء</span>
            <span className="en">Over three decades of legacy</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — visible on md+ */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone to-transparent" />

          <div className="space-y-10 md:space-y-16">
            {MILESTONES.map((m, i) => {
              const accentMap = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
              const colorMap  = { red: "#D42B3C", green: "#007A38", ink: "#141414", gold: "#A07820" } as const;
              const isLeft = i % 2 === 0;

              return (
                <div key={i} className="md:grid md:grid-cols-2 md:gap-10 items-center">
                  {/* Year card */}
                  <div className={`${isLeft ? "md:text-right md:order-1" : "md:order-2 md:pl-8"}`}>
                    <div className={`inline-block ${isLeft ? "" : ""}`}>
                      <div className="font-disp text-5xl sm:text-6xl font-bold leading-none mb-2" style={{ color: colorMap[m.accent] }}>
                        {m.year}
                      </div>
                      <div className="text-[0.65rem] uppercase tracking-[0.22em] font-bold text-ink">
                        <span className="ar">{m.ar}</span>
                        <span className="en">{m.en}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dot — desktop only */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2" style={{ top: `${50}%` }}>
                    <div className={`w-3 h-3 rounded-full ${accentMap[m.accent]} ring-4 ring-ivory2`} />
                  </div>

                  {/* Description */}
                  <div className={`mt-3 md:mt-0 ${isLeft ? "md:order-2 md:pl-8" : "md:order-1 md:text-right md:pr-8"}`}>
                    <div className={`bg-white border-t-[3px] ${accentMap[m.accent]} border border-stone p-6 sm:p-7 max-w-md ${isLeft ? "" : "md:ml-auto"}`}>
                      <p className="text-base leading-[1.85] text-ink2">
                        <span className="ar">{m.arDsc}</span>
                        <span className="en" dangerouslySetInnerHTML={{ __html: m.enDsc }} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

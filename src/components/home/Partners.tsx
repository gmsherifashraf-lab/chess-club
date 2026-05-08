"use client";

interface Partner {
  ar: string;
  en: string;
  type: "government" | "sports" | "cultural" | "education";
}

const PARTNERS: Partner[] = [
  { ar: "حكومة الشارقة",                     en: "Sharjah Government",            type: "government" },
  { ar: "الهيئة العامة للرياضة",            en: "General Authority of Sports",    type: "sports"     },
  { ar: "اتحاد الإمارات للشطرنج",            en: "UAE Chess Federation",          type: "sports"     },
  { ar: "هيئة الشارقة للرياضة",              en: "Sharjah Sports Council",        type: "sports"     },
  { ar: "دائرة الثقافة بالشارقة",            en: "Sharjah Department of Culture", type: "cultural"   },
  { ar: "مجلس الشارقة للتعليم",              en: "Sharjah Education Council",     type: "education"  },
  { ar: "جامعة الشارقة",                     en: "University of Sharjah",         type: "education"  },
  { ar: "الاتحاد العربي للشطرنج",            en: "Arab Chess Federation",         type: "sports"     },
];

const typeColor = {
  government: "border-red",
  sports:     "border-green2",
  cultural:   "border-gold",
  education:  "border-ink",
} as const;

export default function Partners() {
  return (
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">الشركاء والداعمون</span>
              <span className="en">Partners &amp; Supporters</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">شراكات مؤسسية تليق بالنادي</span>
            <span className="en">Institutional partnerships of distinction</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2 mb-6" />
          <p className="text-base leading-[1.85] text-ink3 max-w-2xl mx-auto">
            <span className="ar">
              نفخر بشراكاتنا الراسخة مع الجهات الحكومية والرياضية والثقافية في الإمارات.
            </span>
            <span className="en">
              We are proud of our long-standing partnerships with UAE government,
              sporting, and cultural institutions.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PARTNERS.map((p, i) => (
            <div
              key={i}
              className={`group bg-ivory2 border-l-[3px] ${typeColor[p.type]} border-y border-r border-stone p-5 sm:p-6 transition-all hover:bg-white hover:-translate-y-1 hover:shadow-[0_18px_44px_-22px_rgba(20,20,20,0.25)]`}
            >
              <div className="font-disp text-base sm:text-lg text-ink leading-tight">
                <span className="ar">{p.ar}</span>
                <span className="en">{p.en}</span>
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.18em] text-ink3 font-semibold mt-2 opacity-70">
                <span className="ar">شريك مؤسسي</span>
                <span className="en">Institutional Partner</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

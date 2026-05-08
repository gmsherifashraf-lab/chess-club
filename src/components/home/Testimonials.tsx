"use client";

interface Quote {
  ar:    string;
  en:    string;
  whoAr: string;
  whoEn: string;
  roleAr: string;
  roleEn: string;
  accent: "red" | "green" | "ink";
}

const QUOTES: Quote[] = [
  {
    ar:     "النادي لم يُعلّم ابنتي الشطرنج فقط، بل علّمها كيف تُفكّر وكيف تختار قراراتها بثقة. اليوم هي إنسانة مختلفة.",
    en:     "The club didn&rsquo;t just teach my daughter chess — it taught her how to think and how to make decisions with confidence. She is a different person today.",
    whoAr:  "أم لاعبة في فريق النخبة",
    whoEn:  "Parent of an Elite Squad player",
    roleAr: "ولية أمر",
    roleEn: "Parent",
    accent: "red",
  },
  {
    ar:     "بيئة احترافية ومُلهِمة، ونموذج راقٍ لما يجب أن يكون عليه النادي النسائي في الإمارات. شراكتنا مع النادي مصدر فخر.",
    en:     "A professional and inspiring environment — a model of what a women&rsquo;s sporting club should be in the UAE. Our partnership is a source of pride.",
    whoAr:  "ممثل جهة شريكة",
    whoEn:  "Institutional partner",
    roleAr: "شريك مؤسسي",
    roleEn: "Institutional Partner",
    accent: "green",
  },
  {
    ar:     "بدأتُ في النادي وأنا في السابعة. اليوم أُمثّل الإمارات في البطولات الدولية. كل ما حققته بدأ من هنا.",
    en:     "I started at the club when I was seven. Today I represent the UAE in international tournaments. Everything I&rsquo;ve achieved began here.",
    whoAr:  "لاعبة في فريق النخبة",
    whoEn:  "Elite Squad player",
    roleAr: "لاعبة",
    roleEn: "Player",
    accent: "ink",
  },
];

const accentMap = { red: "#D42B3C", green: "#007A38", ink: "#141414" } as const;

export default function Testimonials() {
  return (
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">شهادات</span>
              <span className="en">Testimonials</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">بصوت عائلتنا</span>
            <span className="en">In the words of our family</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className="relative bg-ivory2 border border-stone p-8 sm:p-10 transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.3)]"
            >
              <div
                className="absolute top-3 right-5 font-disp text-7xl leading-none opacity-15 select-none"
                style={{ color: accentMap[q.accent] }}
              >
                &ldquo;
              </div>
              <blockquote className="relative text-base sm:text-lg leading-[1.85] text-ink2 mb-7">
                <span className="ar" dangerouslySetInnerHTML={{ __html: q.ar }} />
                <span className="en" dangerouslySetInnerHTML={{ __html: q.en }} />
              </blockquote>
              <div className="h-px w-12 mb-4" style={{ background: accentMap[q.accent] }} />
              <figcaption>
                <div className="font-disp text-base text-ink mb-1">
                  <span className="ar">{q.whoAr}</span>
                  <span className="en">{q.whoEn}</span>
                </div>
                <div className="text-[0.62rem] uppercase tracking-[0.22em] font-bold" style={{ color: accentMap[q.accent] }}>
                  <span className="ar">{q.roleAr}</span>
                  <span className="en">{q.roleEn}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

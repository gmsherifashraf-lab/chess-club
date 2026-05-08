"use client";

interface Member {
  ar:        string;          // Arabic full name (without honorific)
  en:        string;          // English full name
  arRole:    string;
  enRole:    string;
  honorific?: { ar: string; en: string };
  highlighted?: boolean;
}

const HONORIFIC = { ar: "سعادة", en: "H.E." };

const BOARD: Member[] = [
  {
    ar:    "نجلاء عبدالله أحمد الدرويشي الشامسي",
    en:    "Najla Abdullah Ahmed Al Darwishi Al Shamsi",
    arRole: "رئيسة مجلس الإدارة",
    enRole: "Chairperson of the Board",
    honorific: HONORIFIC,
    highlighted: true,
  },
  {
    ar:    "أروى محمد سلطان محمد العويس",
    en:    "Arwa Mohammed Sultan Mohammed Al Owais",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "أمينة جمعة حسن صالح الجسمي",
    en:    "Amina Juma Hassan Saleh Al Jasmi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "إيمان محمد مبارك محمد العلي",
    en:    "Iman Mohammed Mubarak Mohammed Al Ali",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "حمدة سالم سلطان العقروبي السويدي",
    en:    "Hamda Salem Sultan Al Aqroubi Al Suwaidi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "علياء علي غريب أحمد المزمي",
    en:    "Alia Ali Gharib Ahmed Al Mazmi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "ميثاء عيسى خلفان بن عيسى الذبحاني",
    en:    "Maitha Issa Khalfan bin Isa Al Dhabahi",
    arRole: "الأمين العام",
    enRole: "Secretary General",
    honorific: HONORIFIC,
    highlighted: true,
  },
];

const EXECUTIVE = {
  ar: "آمنة الملا",
  en: "Amna Al Mulla",
  arRole: "المدير التنفيذي",
  enRole: "Executive Director",
};

function initials(name: string): string {
  return name
    .replace(/^(H\.E\.|Her Excellency|سعادة)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function BoardOfDirectors() {
  return (
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">مجلس الإدارة</span>
              <span className="en">Board of Directors</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">القيادة المؤسسية للنادي</span>
            <span className="en">Institutional Leadership</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2 mb-6" />
          <p className="text-base sm:text-lg leading-[1.85] text-ink3">
            <span className="ar">
              يقود النادي مجلس إدارة من سيدات إماراتيات يجمعن بين الخبرة المؤسسية والريادة الاجتماعية.
            </span>
            <span className="en">
              The club is led by a board of distinguished Emirati women combining
              institutional expertise with social leadership.
            </span>
          </p>
        </div>

        {/* Board cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 mb-16">
          {BOARD.map((m, i) => (
            <article
              key={i}
              className={`group relative bg-ivory2 border ${m.highlighted ? "border-red" : "border-stone"} pt-9 pb-7 px-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(20,20,20,0.35)]`}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red via-white to-green2" />

              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="absolute -inset-1 bg-gradient-to-br from-red via-white to-green2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full rounded-full bg-ink overflow-hidden flex items-center justify-center text-ivory">
                  <span className="font-disp text-2xl">{initials(m.en)}</span>
                </div>
              </div>

              {m.honorific && (
                <div className="text-[0.6rem] uppercase tracking-[0.22em] text-red font-bold mb-2">
                  <span className="ar">{m.honorific.ar}</span>
                  <span className="en">{m.honorific.en}</span>
                </div>
              )}

              <h3 className="font-disp text-[1.05rem] text-ink mb-3 leading-tight px-1">
                <span className="ar">{m.ar}</span>
                <span className="en">{m.en}</span>
              </h3>

              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3 font-semibold border-t border-stone pt-3 mt-3">
                <span className="ar">{m.arRole}</span>
                <span className="en">{m.enRole}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Executive Leadership */}
        <div className="border-t border-stone pt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[0.62rem] uppercase tracking-[0.22em] text-red font-bold mb-3">
              <span className="ar">الإدارة التنفيذية</span>
              <span className="en">Executive Leadership</span>
            </div>
            <h3 className="font-disp text-2xl sm:text-3xl text-ink">
              <span className="ar">القيادة التنفيذية للنادي</span>
              <span className="en">Operational Leadership</span>
            </h3>
          </div>

          <div className="max-w-md mx-auto">
            <article className="relative bg-ink text-ivory pt-9 pb-8 px-6 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red via-white to-green2" />
              <div
                aria-hidden
                className="absolute -bottom-20 -right-20 w-[260px] h-[260px] rounded-full blur-3xl opacity-25"
                style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="absolute -inset-1 bg-gradient-to-br from-red via-white to-green2 rounded-full opacity-80" />
                  <div className="relative w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-ink">
                    <span className="font-disp text-2xl">{initials(EXECUTIVE.en)}</span>
                  </div>
                </div>
                <h3 className="font-disp text-2xl text-ivory mb-3 leading-tight">
                  <span className="ar">{EXECUTIVE.ar}</span>
                  <span className="en">{EXECUTIVE.en}</span>
                </h3>
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-red font-bold">
                  <span className="ar">{EXECUTIVE.arRole}</span>
                  <span className="en">{EXECUTIVE.enRole}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

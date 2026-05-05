"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Lang = "ar" | "en";

interface LangCtx {
  lang: Lang;
  dir:  "rtl" | "ltr";
  toggle: () => void;
}

const Ctx = createContext<LangCtx>({ lang: "en", dir: "ltr", toggle: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggle = useCallback(() => setLang(l => l === "ar" ? "en" : "ar"), []);

  // Sync html attributes
  useEffect(() => {
    document.documentElement.setAttribute("dir",  lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  return (
    <Ctx.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);

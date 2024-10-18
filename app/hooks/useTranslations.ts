"use client";

import { useEffect, useState } from "react";

interface Translation {
  label: string;
  translations: Record<string, string>;
}

export function useTranslations() {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(storedLanguage);

    // Obtener las traducciones desde la API
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data: Translation[]) => {
        const trans = data.reduce(
          (acc, item) => {
            acc[item.label] =
              item.translations[storedLanguage] || item.translations["en"];
            return acc;
          },
          {} as Record<string, string>,
        );
        setTranslations(trans);
      });
  }, [currentLanguage]);

  return { translations, currentLanguage };
}

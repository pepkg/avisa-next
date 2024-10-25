"use client";

import { useEffect, useState } from "react";

interface Language {
  iso: string;
  names: { [key: string]: string };
  published: boolean;
}

export default function LanguageSelector() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Obtener los lenguajes desde el backend
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo los lenguajes que son públicos
        const publicLanguages = data.filter((lang: Language) => lang.published);
        setLanguages(publicLanguages);
      });

    // Detectar el idioma del navegador o usar el guardado en localStorage
    const browserLanguage = navigator.language.slice(0, 2);
    setCurrentLanguage(
      localStorage.getItem("language") || browserLanguage || "en",
    );
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
    // Recargar la página para aplicar el cambio de idioma
    window.location.reload();
  };

  return (
    <div>
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        {languages.map((lang) => (
          <option key={lang.iso} value={lang.iso}>
            {lang.names[currentLanguage] || lang.names["en"]}
          </option>
        ))}
      </select>
    </div>
  );
}

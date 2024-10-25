import React, { useState } from "react";

interface MultilangTextFieldProps {
  translations: Record<string, string>; // Traducciones actuales
  languages: { iso: string }[]; // Lista de idiomas
  onChange: (iso: string, value: string) => void; // Función para manejar los cambios
  fieldLabel: string; // El literal traducido del campo
}

const MultilangTextField: React.FC<MultilangTextFieldProps> = ({
  translations,
  languages,
  onChange,
  fieldLabel,
}) => {
  const [activeLang, setActiveLang] = useState<string>(
    languages[0]?.iso || "en",
  ); // Idioma activo

  return (
    <div className="mb-4">
      {/* Título de la sección */}
      <h2 className="text-xl font-semibold mb-2">{fieldLabel}</h2>

      {/* Pestañas de selección de idioma */}
      <div className="tabs">
        {languages.map((lang) => (
          <button
            key={lang.iso}
            className={`tab ${activeLang === lang.iso ? "tab-active bg-blue-500 text-white" : ""}`}
            onClick={() => setActiveLang(lang.iso)}
          >
            {lang.iso.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Campo de texto para el idioma activo */}
      <div className="mt-4">
        <input
          type="text"
          value={translations[activeLang] || ""}
          onChange={(e) => onChange(activeLang, e.target.value)}
          placeholder={`Texto en ${activeLang.toUpperCase()}`}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
};

export default MultilangTextField;

"use client";

import { useEffect, useState } from "react";

interface Translation {
  _id: string;
  label: string;
  translations: Record<string, string>;
}

export default function Translations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [newTranslation, setNewTranslation] = useState({
    label: "",
    translations: { en: "", es: "" },
  });

  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => setTranslations(data));
  }, []);

  const handleAddTranslation = async () => {
    const res = await fetch("/api/translations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTranslation),
    });

    if (res.ok) {
      const createdTranslation = await res.json();
      setTranslations([...translations, createdTranslation]);
      setNewTranslation({ label: "", translations: { en: "", es: "" } });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestionar Traducciones</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Etiqueta"
          value={newTranslation.label}
          onChange={(e) =>
            setNewTranslation({ ...newTranslation, label: e.target.value })
          }
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          placeholder="Inglés"
          value={newTranslation.translations.en}
          onChange={(e) =>
            setNewTranslation({
              ...newTranslation,
              translations: {
                ...newTranslation.translations,
                en: e.target.value,
              },
            })
          }
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          placeholder="Español"
          value={newTranslation.translations.es}
          onChange={(e) =>
            setNewTranslation({
              ...newTranslation,
              translations: {
                ...newTranslation.translations,
                es: e.target.value,
              },
            })
          }
          className="input input-bordered w-full mb-2"
        />
        <button className="btn btn-primary" onClick={handleAddTranslation}>
          Agregar Traducción
        </button>
      </div>

      <ul>
        {translations.map((trans) => (
          <li key={trans._id}>
            <strong>{trans.label}:</strong> {trans.translations.en} /{" "}
            {trans.translations.es}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "../../../DashboardLayout";
import MultilangTextField from "@/components/MultilangTextField";

export default function EditLanguage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState({
    iso: "",
    names: { en: "", es: "" },
  });
  const [languages, setLanguages] = useState<{ iso: string }[]>([]);
  const { translations: translationLiterals } = useTranslations();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cargar los idiomas disponibles
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data));
    // Cargar el item si es una edición
    if (params.id !== "new") {
      fetch(`/api/languages/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setLanguage(data);
          setIsEdit(true);
        });
    }
  }, [params.id]);

  const handleSave = async () => {
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(`/api/languages/${isEdit ? params.id : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(language),
    });

    if (res.ok) {
      // Redirigir al listado con un mensaje de éxito
      const successMessage = isEdit ? "edit_success=true" : "add_success=true";
      router.push(`/app/dashboard/languages?${successMessage}`);
    }
  };

  // Función para manejar los cambios en los campos de traducción
  const handleTranslationChange = (iso: string, value: string) => {
    setLanguage({
      ...language,
      names: {
        ...language.names,
        [iso]: value, // Actualiza el valor en el idioma específico
      },
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">
        {isEdit
          ? translationLiterals["languages_edit_title"] || "Editar Idioma"
          : translationLiterals["add_language_button"] ||
            "Agregar Nuevo Idioma"}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Código ISO"
          value={language.iso}
          onChange={(e) => setLanguage({ ...language, iso: e.target.value })}
          className="input input-bordered w-full mb-2"
        />
        {/* Usamos el componente MultilangTextField para el campo de traducción */}
        <MultilangTextField
          translations={language.names}
          languages={languages} // Lista de idiomas disponibles
          onChange={handleTranslationChange} // Función para actualizar la traducción
          fieldLabel={
            translationLiterals["translations_field"] || "Traducciones"
          } // Literal traducido como título de la sección
        />
        <button className="btn btn-primary" onClick={handleSave}>
          {isEdit
            ? translationLiterals["languages_edit_title"] || "Editar Idioma"
            : translationLiterals["add_language_button"] ||
              "Agregar Nuevo Idioma"}
        </button>
      </div>
    </DashboardLayout>
  );
}

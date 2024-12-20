"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "../../../DashboardLayout";
import MultilangTextField from "@/components/MultilangTextField";

export default function EditTranslation({
  params,
}: {
  params: { id: string };
}) {
  const [translation, setTranslation] = useState({
    label: "",
    translations: { en: "", es: "" }, // Inicializar con los idiomas disponibles
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

    // Si es edición, cargar la traducción
    if (params.id !== "new") {
      fetch(`/api/translations/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTranslation(data);
          setIsEdit(true);
        });
    }
  }, [params.id]);

  const handleSave = async () => {
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(`/api/translations/${isEdit ? params.id : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(translation),
    });

    if (res.ok) {
      const successMessage = isEdit ? "edit_success=true" : "add_success=true";
      router.push(`/app/dashboard/translations?${successMessage}`);
    }
  };

  // Función para manejar los cambios en los campos de traducción
  const handleTranslationChange = (iso: string, value: string) => {
    setTranslation({
      ...translation,
      translations: {
        ...translation.translations,
        [iso]: value, // Actualiza el valor en el idioma específico
      },
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">
        {isEdit
          ? translationLiterals["translations_edit_title"] ||
            "Editar Traducción"
          : translationLiterals["add_translation_button"] ||
            "Agregar Nueva Traducción"}
      </h1>
      <div className="mb-4">
        {/* Campo para la etiqueta */}
        <input
          type="text"
          placeholder="Etiqueta"
          value={translation.label}
          onChange={(e) =>
            setTranslation({ ...translation, label: e.target.value })
          }
          className="input input-bordered w-full mb-2"
        />

        {/* Usamos el componente MultilangTextField para el campo de traducción */}
        <MultilangTextField
          translations={translation.translations}
          languages={languages} // Lista de idiomas disponibles
          onChange={handleTranslationChange} // Función para actualizar la traducción
          fieldLabel={
            translationLiterals["translations_field"] || "Traducciones"
          } // Literal traducido como título de la sección
        />

        <button className="btn btn-primary" onClick={handleSave}>
          {isEdit
            ? translationLiterals["translations_edit_title"] ||
              "Editar Traducción"
            : translationLiterals["add_translation_button"] ||
              "Agregar Nueva Traducción"}
        </button>
      </div>
    </DashboardLayout>
  );
}

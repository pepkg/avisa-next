"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "../../../DashboardLayout";

export default function EditTranslation({
  params,
}: {
  params: { id: string };
}) {
  const [translation, setTranslation] = useState({
    label: "",
    translations: { en: "", es: "" },
  });
  const { translations: translationLiterals } = useTranslations();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();

  // Cargar la traducción si es una edición
  useEffect(() => {
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
      // Redirigir al listado con un mensaje de éxito
      const successMessage = isEdit ? "edit_success=true" : "add_success=true";
      router.push(`/app/dashboard/translations?${successMessage}`);
    }
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
        <input
          type="text"
          placeholder="Etiqueta"
          value={translation.label}
          onChange={(e) =>
            setTranslation({ ...translation, label: e.target.value })
          }
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          placeholder="Inglés"
          value={translation.translations.en}
          onChange={(e) =>
            setTranslation({
              ...translation,
              translations: { ...translation.translations, en: e.target.value },
            })
          }
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          placeholder="Español"
          value={translation.translations.es}
          onChange={(e) =>
            setTranslation({
              ...translation,
              translations: { ...translation.translations, es: e.target.value },
            })
          }
          className="input input-bordered w-full mb-2"
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

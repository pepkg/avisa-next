"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "../DashboardLayout";

interface Translation {
  _id: string;
  label: string;
  translations: Record<string, string>;
}

export default function Translations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const { translations: translationLiterals } = useTranslations();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => setTranslations(data));
  }, []);

  // Mostrar mensajes de éxito según el parámetro
  useEffect(() => {
    if (searchParams.get("edit_success") === "true") {
      setShowSuccessMessage("Traducción editada con éxito.");
    } else if (searchParams.get("add_success") === "true") {
      setShowSuccessMessage("Traducción agregada con éxito.");
    } else if (searchParams.get("success") === "true") {
      setShowSuccessMessage("Traducción eliminada con éxito.");
    }
  }, [searchParams]);

  const handleDismissMessage = () => {
    setShowSuccessMessage(""); // Cerrar el mensaje de éxito
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/translations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTranslations(translations.filter((trans) => trans._id !== id));
      setShowDeleteDialog(null); // Cerrar el diálogo de confirmación
      router.push("/app/dashboard/translations?success=true"); // Redirigir con el mensaje de éxito
    } else {
      console.error("Failed to delete translation");
    }
  };

  return (
    <DashboardLayout>
      {/* Mostrar el mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <p>{showSuccessMessage}</p>
          <button className="text-red-500 ml-4" onClick={handleDismissMessage}>
            Cerrar
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">
        {translationLiterals["translations_list_title"] ||
          "Gestionar Traducciones"}
      </h1>

      <ul>
        {translations.map((trans) => (
          <li
            key={trans._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <strong>{trans.label}:</strong> {trans.translations.en} /{" "}
              {trans.translations.es}
            </div>
            <div>
              <a
                href={`/app/dashboard/translations/edit/${trans._id}`}
                className="text-blue-500 hover:underline"
              >
                {translationLiterals["edit_button"] || "Editar"}
              </a>
              <button
                className="text-red-500 hover:underline ml-4"
                onClick={() => setShowDeleteDialog(trans._id)}
              >
                {translationLiterals["delete_button"] || "Eliminar"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>
              {translationLiterals["delete_confirmation"] ||
                "¿Estás seguro de que quieres eliminar esta traducción?"}
            </p>
            <div className="mt-4">
              <button
                className="btn btn-danger mr-4"
                onClick={() => handleDelete(showDeleteDialog)}
              >
                {translationLiterals["confirm_delete"] || "Confirmar"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteDialog(null)}
              >
                {translationLiterals["cancel_button"] || "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

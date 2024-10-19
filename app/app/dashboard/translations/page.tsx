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
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    [],
  ); // Para la selección múltiple
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false); // Para eliminar por lotes
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
    setShowSuccessMessage("");
  };

  // Manejar la selección individual de una traducción
  const handleSelectTranslation = (id: string) => {
    setSelectedTranslations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  // Seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selectedTranslations.length === translations.length) {
      setSelectedTranslations([]); // Deseleccionar todo
    } else {
      setSelectedTranslations(translations.map((trans) => trans._id)); // Seleccionar todo
    }
  };

  // Eliminar traducciones seleccionadas por lotes
  const handleBatchDelete = async () => {
    if (selectedTranslations.length > 0) {
      const promises = selectedTranslations.map((id) =>
        fetch(`/api/translations/${id}`, {
          method: "DELETE",
        }),
      );
      await Promise.all(promises);
      setTranslations(
        translations.filter(
          (trans) => !selectedTranslations.includes(trans._id),
        ),
      );
      setSelectedTranslations([]);
      setShowBatchDeleteDialog(false);
      setShowSuccessMessage("Traducciones eliminadas con éxito.");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/translations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTranslations(translations.filter((trans) => trans._id !== id));
      setShowDeleteDialog(null);
      router.push("/app/dashboard/translations?success=true");
    } else {
      console.error("Failed to delete translation");
    }
  };

  return (
    <DashboardLayout>
      {/* Mostrar mensaje de éxito */}
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

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedTranslations.length === translations.length}
              />
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["label_column"] || "Etiqueta"}
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["translations_column"] || "Traducciones"}
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["actions_column"] || "Acciones"}
            </th>
          </tr>
        </thead>
        <tbody>
          {translations.map((trans) => (
            <tr key={trans._id} className="border-t">
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedTranslations.includes(trans._id)}
                  onChange={() => handleSelectTranslation(trans._id)}
                />
              </td>
              <td className="border px-4 py-2">{trans.label}</td>
              <td className="border px-4 py-2">
                {trans.translations.en} / {trans.translations.es}
              </td>
              <td className="border px-4 py-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón de eliminar por lotes */}
      {selectedTranslations.length > 0 && (
        <button
          className="btn btn-danger mt-4"
          onClick={() => setShowBatchDeleteDialog(true)}
        >
          {translationLiterals["batch_delete_button"] ||
            "Eliminar seleccionados"}
        </button>
      )}

      {/* Diálogo de confirmación para eliminar por lotes */}
      {showBatchDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>
              {translationLiterals["batch_delete_confirmation"] ||
                "¿Estás seguro de que quieres eliminar las traducciones seleccionadas?"}
            </p>
            <div className="mt-4">
              <button
                className="btn btn-danger mr-4"
                onClick={handleBatchDelete}
              >
                {translationLiterals["confirm_delete"] || "Confirmar"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowBatchDeleteDialog(false)}
              >
                {translationLiterals["cancel_button"] || "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

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

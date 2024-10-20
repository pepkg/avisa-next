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

interface Language {
  iso: string;
  names: Record<string, string>;
}

export default function Translations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<
    Translation[]
  >([]);
  const [languages, setLanguages] = useState<Language[]>([]); // Para almacenar los idiomas
  const { translations: translationLiterals } = useTranslations();
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"label" | "translations">("label");
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({}); // Para almacenar el tab activo de cada fila
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cargar las traducciones y los idiomas
  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data);
        setFilteredTranslations(data); // Inicialmente muestra todas las traducciones
      });

    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data)); // Cargar los idiomas disponibles
  }, []);

  useEffect(() => {
    if (searchParams.get("edit_success") === "true") {
      setShowSuccessMessage(
        translationLiterals["translations_edit_success_message"] ||
          "Traducción editada con éxito.",
      );
    } else if (searchParams.get("add_success") === "true") {
      setShowSuccessMessage(
        translationLiterals["translations_add_success_message"] ||
          "Traducción agregada con éxito.",
      );
    } else if (searchParams.get("success") === "true") {
      setShowSuccessMessage(
        translationLiterals["translations_del_success_message"] ||
          "Traducción eliminada con éxito.",
      );
    }
  }, [searchParams, translationLiterals]);

  const handleDismissMessage = () => {
    setShowSuccessMessage("");
  };

  const handleSort = (column: "label" | "translations") => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newOrder);

    const sortedTranslations = [...filteredTranslations].sort((a, b) => {
      const aValue = column === "label" ? a.label : a.translations.en;
      const bValue = column === "label" ? b.label : b.translations.en;

      if (aValue < bValue) return newOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredTranslations(sortedTranslations);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = translations.filter((trans) =>
      trans.label.toLowerCase().includes(value),
    );
    setFilteredTranslations(filtered);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setFilteredTranslations(translations); // Restablecer a todas las traducciones
    setSortBy("label"); // Restablecer ordenación
    setSortOrder("asc");
  };

  const handleSelectTranslation = (id: string) => {
    setSelectedTranslations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedTranslations.length === filteredTranslations.length) {
      setSelectedTranslations([]);
    } else {
      setSelectedTranslations(filteredTranslations.map((trans) => trans._id));
    }
  };

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
      setFilteredTranslations(
        filteredTranslations.filter(
          (trans) => !selectedTranslations.includes(trans._id),
        ),
      );
      setSelectedTranslations([]);
      setShowBatchDeleteDialog(false);
      setShowSuccessMessage(
        translationLiterals["translations_delete_message"] ||
          "Traducciones eliminadas con éxito.",
      );
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/translations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTranslations(translations.filter((trans) => trans._id !== id));
      setFilteredTranslations(
        filteredTranslations.filter((trans) => trans._id !== id),
      );
      setShowDeleteDialog(null);
      router.push("/app/dashboard/translations?success=true");
    } else {
      console.error(
        translationLiterals["translations_delete_err_message"] ||
          "Failed to delete translation",
      );
    }
  };

  // Manejar el cambio de tab
  const handleTabChange = (id: string, iso: string) => {
    setActiveTab((prevTabs) => ({
      ...prevTabs,
      [id]: iso,
    }));
  };

  return (
    <DashboardLayout>
      {showSuccessMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <p>{showSuccessMessage}</p>
          <button className="text-red-500 ml-4" onClick={handleDismissMessage}>
            {translationLiterals["close_button"] || "Cerrar"}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">
        {translationLiterals["translations_list_title"] ||
          "Gestionar Traducciones"}
      </h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={
              translationLiterals["search_placeholder"] || "Buscar por literal"
            }
            className="input input-bordered w-full mr-2"
          />
          <button className="btn btn-secondary" onClick={handleResetSearch}>
            {translationLiterals["reset_button"] || "Resetear"}
          </button>
        </div>
        <a
          href="/app/dashboard/translations/edit/new"
          className="btn btn-primary ml-4"
        >
          {translationLiterals["add_translation_button"] ||
            "Agregar nueva traducción"}
        </a>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedTranslations.length === filteredTranslations.length
                }
              />
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["label_column"] || "Etiqueta"}
              <button onClick={() => handleSort("label")}>
                {sortBy === "label" && sortOrder === "asc" ? "▲" : "▼"}
              </button>
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["translations_column"] || "Traducciones"}
              <button onClick={() => handleSort("translations")}>
                {sortBy === "translations" && sortOrder === "asc" ? "▲" : "▼"}
              </button>
            </th>
            <th className="border px-4 py-2">
              {translationLiterals["actions_column"] || "Acciones"}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTranslations.map((trans) => (
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
                <div className="tabs">
                  {languages.map((lang) => (
                    <button
                      key={lang.iso}
                      className={`tab ${
                        activeTab[trans._id] === lang.iso ? "tab-active" : ""
                      }`}
                      onClick={() => handleTabChange(trans._id, lang.iso)}
                    >
                      {lang.iso.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="translation-content">
                  {trans.translations[activeTab[trans._id]] ||
                    trans.translations.en}
                </div>
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

      {selectedTranslations.length > 0 && (
        <button
          className="btn btn-danger mt-4"
          onClick={() => setShowBatchDeleteDialog(true)}
        >
          {translationLiterals["batch_delete_button"] ||
            "Eliminar seleccionados"}
        </button>
      )}

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

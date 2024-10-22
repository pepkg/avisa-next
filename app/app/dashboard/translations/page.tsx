"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "../DashboardLayout";
import TableHeaderControls from "@/components/TableHeaderControls";
import SuccessMessage from "@/components/SuccessMessage";
import BatchDeleteDialog from "@/components/BatchDeleteDialog";
import DeleteDialog from "@/components/DeleteDialog";
import DataTable from "@/components/DataTable";

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
  const [languages, setLanguages] = useState<Language[]>([]);
  const { translations: translationLiterals } = useTranslations();
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    [],
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<keyof Translation>("label");
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data);
        setFilteredTranslations(data);
      });

    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data));
  }, []);

  const handleSort = (column: keyof Translation | string) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column as keyof Translation);
    setSortOrder(newOrder);

    const sortedTranslations = [...filteredTranslations].sort((a, b) => {
      const aValue = column === "label" ? a.label : a.translations.en;
      const bValue = column === "label" ? b.label : b.translations.en;

      return aValue < bValue
        ? newOrder === "asc"
          ? -1
          : 1
        : newOrder === "asc"
          ? 1
          : -1;
    });

    setFilteredTranslations(sortedTranslations);
  };

  const handleSelectTranslation = (id: string) => {
    setSelectedTranslations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const handleTabChange = (id: string, iso: string) => {
    setActiveTab((prevTabs) => ({
      ...prevTabs,
      [id]: iso,
    }));
  };

  const handleSelectAll = () => {
    if (selectedTranslations.length === filteredTranslations.length) {
      setSelectedTranslations([]); // Deseleccionar todos
    } else {
      setSelectedTranslations(filteredTranslations.map((trans) => trans._id)); // Seleccionar todos
    }
  };

  return (
    <DashboardLayout>
      <SuccessMessage
        modelKey="translations"
        translationLiterals={translationLiterals}
      />

      <h1 className="text-2xl font-bold mb-4">
        {translationLiterals["translations_list_title"] ||
          "Gestionar Traducciones"}
      </h1>

      <TableHeaderControls
        addButtonText={
          translationLiterals["add_translation_button"] ||
          "Agregar nueva traducción"
        }
        resetButtonText={translationLiterals["reset_button"] || "Reset"}
        addButtonHref="/app/dashboard/translations/edit/new"
        searchPlaceholder={
          translationLiterals["search_placeholder"] || "Buscar por literal"
        }
        onFilter={(searchTerm) =>
          setFilteredTranslations(
            translations.filter((trans) =>
              trans.label.toLowerCase().includes(searchTerm),
            ),
          )
        }
        onReset={() => {
          setFilteredTranslations(translations);
          setSortBy("label");
          setSortOrder("asc");
        }}
      />

      <DataTable<Translation>
        data={filteredTranslations}
        columns={[
          {
            key: "select",
            label: (
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedTranslations.length === filteredTranslations.length &&
                  filteredTranslations.length > 0
                }
              />
            ),
            render: (item) => (
              <input
                type="checkbox"
                checked={selectedTranslations.includes(item._id)}
                onChange={() => handleSelectTranslation(item._id)}
              />
            ),
          },
          {
            key: "label",
            label: translationLiterals["label_column"] || "Etiqueta",
            sortable: true,
          },
          {
            key: "translations",
            label: translationLiterals["translations_column"] || "Traducciones",
            sortable: true,
            render: (item) => (
              <div>
                <div className="tabs">
                  {languages.map((lang) => (
                    <button
                      key={lang.iso}
                      className={`tab ${
                        activeTab[item._id] === lang.iso ? "tab-active" : ""
                      }`}
                      onClick={() => handleTabChange(item._id, lang.iso)}
                    >
                      {lang.iso.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="translation-content">
                  {item.translations[activeTab[item._id]] ||
                    item.translations.en}
                </div>
              </div>
            ),
          },
        ]}
        actions={[
          {
            label: translationLiterals["edit_button"] || "Editar",
            onClick: (item) =>
              router.push(`/app/dashboard/translations/edit/${item._id}`),
          },
          {
            label: translationLiterals["delete_button"] || "Eliminar",
            onClick: (item) => setShowDeleteDialog(item._id),
            buttonClass: "text-red-500",
          },
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectItem={handleSelectTranslation}
        isSelected={(id) => selectedTranslations.includes(id)}
        allSelected={
          selectedTranslations.length === filteredTranslations.length
        }
        languages={languages}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <BatchDeleteDialog
        selectedCount={selectedTranslations.length}
        showDialog={showBatchDeleteDialog}
        onShowDialog={() => setShowBatchDeleteDialog(true)}
        onConfirmBatchDelete={async () => {
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
        }}
        onCancelBatchDelete={() => setShowBatchDeleteDialog(false)}
        translationLiterals={translationLiterals}
      />

      <DeleteDialog
        showDialog={!!showDeleteDialog}
        itemId={showDeleteDialog}
        onDeleteSuccess={() => {
          setTranslations(
            translations.filter((trans) => trans._id !== showDeleteDialog),
          );
          setFilteredTranslations(
            filteredTranslations.filter(
              (trans) => trans._id !== showDeleteDialog,
            ),
          );
          setShowDeleteDialog(null);
          setSelectedTranslations([]);
          router.push("/app/dashboard/translations?success=true");
        }}
        onCancelDelete={() => setShowDeleteDialog(null)}
        translationLiterals={translationLiterals}
        deleteUrl="/api/translations"
      />
    </DashboardLayout>
  );
}

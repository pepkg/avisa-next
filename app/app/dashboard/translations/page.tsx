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
  _id: string;
  iso: string;
  names: Record<string, string>;
}

export default function Translations() {
  const [items, setItems] = useState<Translation[]>([]);
  const [filteredItems, setFilteredItems] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const { translations: translationLiterals } = useTranslations();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<keyof Translation>("label");
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Obtener idioma del navegador o seleccionado por el usuario
  const defaultLanguage =
    localStorage.getItem("language") || navigator.language.slice(0, 2); // 'en', 'es', etc.

  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data);

        // Configurar el tab activo por defecto basado en el idioma del navegador
        const initialActiveTabs: { [key: string]: string } = {};
        data.forEach((item: Language) => {
          initialActiveTabs[item._id] = defaultLanguage; // Usamos el idioma por defecto del usuario
        });
        setActiveTab(initialActiveTabs);
      });

    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data));
  }, [defaultLanguage]);

  const handleSort = (column: keyof Translation | string) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column as keyof Translation);
    setSortOrder(newOrder);

    const sortedItems = [...filteredItems].sort((a, b) => {
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

    setFilteredItems(sortedItems);
  };

  const handleTabChange = (id: string, iso: string) => {
    setActiveTab((prevTabs) => ({
      ...prevTabs,
      [id]: iso,
    }));
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
          setFilteredItems(
            items.filter((filteredItem) =>
              filteredItem.label.toLowerCase().includes(searchTerm),
            ),
          )
        }
        onReset={() => {
          setFilteredItems(items);
          setSortBy("label");
          setSortOrder("asc");
        }}
      />

      <DataTable<Translation>
        data={filteredItems}
        columns={[
          {
            key: "label",
            label:
              translationLiterals["label_column"] || "Etiqueta del literal",
            sortable: true,
          },
          {
            key: "names",
            label: translationLiterals["names_column"] || "Nombre del Idioma",
            sortable: true,
            multilang: true,
            multilangField: "translations", // Especificamos que el campo multilenguaje es "names"
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
        languages={languages}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        translationLiterals={translationLiterals}
      />

      <BatchDeleteDialog
        selectedCount={selectedItems.length}
        showDialog={showBatchDeleteDialog}
        onShowDialog={() => setShowBatchDeleteDialog(true)}
        onConfirmBatchDelete={async () => {
          const promises = selectedItems.map((id) =>
            fetch(`/api/translations/${id}`, {
              method: "DELETE",
            }),
          );
          await Promise.all(promises);
          setItems(
            items.filter(
              (filteredItem) => !selectedItems.includes(filteredItem._id),
            ),
          );
          setFilteredItems(
            filteredItems.filter(
              (filteredItem) => !selectedItems.includes(filteredItem._id),
            ),
          );
          setSelectedItems([]);
          setShowBatchDeleteDialog(false);
        }}
        onCancelBatchDelete={() => setShowBatchDeleteDialog(false)}
        translationLiterals={translationLiterals}
      />

      <DeleteDialog
        showDialog={!!showDeleteDialog}
        itemId={showDeleteDialog}
        onDeleteSuccess={() => {
          setItems(
            items.filter(
              (filteredItem) => filteredItem._id !== showDeleteDialog,
            ),
          );
          setFilteredItems(
            filteredItems.filter(
              (filteredItem) => filteredItem._id !== showDeleteDialog,
            ),
          );
          setShowDeleteDialog(null);
          setSelectedItems([]);
          router.push("/app/dashboard/translations?success=true");
        }}
        onCancelDelete={() => setShowDeleteDialog(null)}
        translationLiterals={translationLiterals}
        deleteUrl="/api/translations"
      />
    </DashboardLayout>
  );
}

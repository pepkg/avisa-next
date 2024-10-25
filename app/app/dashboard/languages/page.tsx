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

interface Language {
  _id: string;
  iso: string;
  names: Record<string, string>;
  published: boolean;
}

export default function Languages() {
  const [items, setItems] = useState<Language[]>([]);
  const [filteredItems, setFilteredItems] = useState<Language[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const { translations: translationLiterals } = useTranslations();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<keyof Language>("iso");
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const defaultLanguage =
    localStorage.getItem("language") || navigator.language.slice(0, 2);

  useEffect(() => {
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => {
        setLanguages(data);
        setItems(data);
        const initialActiveTabs: { [key: string]: string } = {};
        data.forEach((item: Language) => {
          initialActiveTabs[item._id] = defaultLanguage;
        });
        setActiveTab(initialActiveTabs);
      });
  }, [defaultLanguage]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSort = (column: keyof Language | string) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column as keyof Language);
    setSortOrder(newOrder);

    const sortedItems = [...filteredItems].sort((a, b) => {
      const aValue = column === "iso" ? a.iso : a.names.en;
      const bValue = column === "iso" ? b.iso : b.names.en;

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

  const updateLocalPublishedStatus = (languageId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === languageId
          ? { ...item, published: !item.published }
          : item,
      ),
    );
  };

  const syncWithDatabase = async (
    languageId: string,
    newPublishedStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/languages/${languageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newPublishedStatus }),
      });

      if (!response.ok) {
        console.error(
          "Error al actualizar en la base de datos:",
          response.status,
        );
        updateLocalPublishedStatus(languageId);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud PUT:", error);
      updateLocalPublishedStatus(languageId);
    }
  };

  // Función principal para el cambio de estado de publicación
  const handlePublicToggle = (language: Language) => {
    updateLocalPublishedStatus(language._id);
    syncWithDatabase(language._id, !language.published);
  };

  return (
    <DashboardLayout>
      <SuccessMessage
        modelKey="languages"
        translationLiterals={translationLiterals}
      />

      <h1 className="text-2xl font-bold mb-4">
        {translationLiterals["languages_list_title"] || "Gestionar Idiomas"}
      </h1>

      <TableHeaderControls
        addButtonText={
          translationLiterals["add_language_button"] || "Agregar nuevo idioma"
        }
        resetButtonText={translationLiterals["reset_button"] || "Reset"}
        addButtonHref="/app/dashboard/languages/edit/new"
        searchPlaceholder={
          translationLiterals["search_placeholder"] || "Buscar por literal"
        }
        onFilter={(searchTerm) =>
          setFilteredItems(
            items.filter((filteredItem) =>
              filteredItem.iso.toLowerCase().includes(searchTerm),
            ),
          )
        }
        onReset={() => {
          setFilteredItems(items);
          setSortBy("iso");
          setSortOrder("asc");
        }}
      />

      <DataTable<Language>
        data={filteredItems}
        columns={[
          {
            key: "iso",
            label: translationLiterals["iso_column"] || "Código ISO",
            sortable: true,
          },
          {
            key: "names",
            label: translationLiterals["names_column"] || "Nombre del Idioma",
            sortable: true,
            multilang: true,
            multilangField: "names",
          },
          {
            key: "published",
            label:
              translationLiterals["published_column"] ||
              "Estado de publicación",
            render: (language) => (
              <button
                onClick={() => handlePublicToggle(language)}
                className={`px-4 py-2 rounded ${
                  language.published ? "bg-green-500" : "bg-yellow-500"
                } text-white`}
              >
                {language.published
                  ? translationLiterals["published_state"]
                  : translationLiterals["draft_state"]}
              </button>
            ),
          },
        ]}
        actions={[
          {
            label: translationLiterals["edit_button"] || "Editar",
            onClick: (item) =>
              router.push(`/app/dashboard/languages/edit/${item._id}`),
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
            fetch(`/api/languages/${id}`, {
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
          router.push("/app/dashboard/languages?success=true");
        }}
        onCancelDelete={() => setShowDeleteDialog(null)}
        translationLiterals={translationLiterals}
        deleteUrl="/api/languages"
      />
    </DashboardLayout>
  );
}

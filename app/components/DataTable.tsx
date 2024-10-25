import React, { useState } from "react";

interface DataTableColumn<T extends object> {
  key: keyof T | string; // Permitir también "select" u otros campos no directamente en T
  label: React.ReactNode; // ReactNode para permitir JSX como <input />
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  multilang?: boolean;
  multilangField?: keyof T; // Campo donde están los datos multilingües
  isBoolean?: boolean; // Para identificar columnas booleanas
  onBooleanToggle?: (item: T, value: boolean) => void; // Función para manejar el cambio en el switch
}

interface DataTableProps<
  T extends { _id: string; translations?: Record<string, string> },
> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: Array<{
    label: string;
    onClick: (item: T) => void;
    buttonClass?: string;
  }>;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  onSort?: (column: keyof T | string) => void;
  languages?: { iso: string }[];
  activeTab?: { [key: string]: string };
  onTabChange?: (id: string, iso: string) => void;
  translationLiterals: Record<string, string>;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  allSelected?: boolean;
}

export default function DataTable<
  T extends { _id: string; translations?: Record<string, string> },
>({
  data,
  columns,
  actions,
  sortBy,
  sortOrder,
  onSort,
  languages,
  activeTab,
  onTabChange,
  translationLiterals,
  selectedItems: externalSelectedItems,
  onSelectItem: externalOnSelectItem,
  allSelected: externalAllSelected,
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    externalSelectedItems || [],
  );

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item._id));
    }
  };

  const allSelected =
    externalAllSelected !== undefined
      ? externalAllSelected
      : selectedItems.length === data.length;

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={allSelected}
            />
          </th>
          {columns.map((column) => (
            <th key={String(column.key)} className="border px-4 py-2">
              {column.label}
              {column.sortable && onSort && (
                <button onClick={() => onSort(column.key)}>
                  {sortBy === column.key && sortOrder === "asc" ? "▲" : "▼"}
                </button>
              )}
            </th>
          ))}
          {actions && (
            <th className="border px-4 py-2">
              {translationLiterals["actions_column"] || "Acciones"}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border-t">
            <td className="border px-4 py-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() =>
                  externalOnSelectItem
                    ? externalOnSelectItem(item._id)
                    : handleSelectItem(item._id)
                }
              />
            </td>
            {columns.map((column) => (
              <td key={String(column.key)} className="border px-4 py-2">
                {/* Renderizado para la columna multilingüe */}
                {column.multilang &&
                  languages &&
                  onTabChange &&
                  item[column.multilangField as keyof T] &&
                  typeof item[column.multilangField as keyof T] ===
                    "object" && (
                    <div>
                      <div className="tabs">
                        {languages.map((lang) => (
                          <button
                            key={lang.iso}
                            className={`tab ${
                              activeTab && activeTab[item._id] === lang.iso
                                ? "tab-active bg-blue-500 text-white"
                                : "tab"
                            }`}
                            onClick={() => onTabChange(item._id, lang.iso)}
                          >
                            {lang.iso.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="translation-content">
                        {activeTab &&
                        activeTab[item._id] &&
                        (
                          item[column.multilangField as keyof T] as Record<
                            string,
                            string
                          >
                        )[activeTab[item._id]]
                          ? (
                              item[column.multilangField as keyof T] as Record<
                                string,
                                string
                              >
                            )[activeTab[item._id]]
                          : (
                              item[column.multilangField as keyof T] as Record<
                                string,
                                string
                              >
                            )?.["en"]}
                      </div>
                    </div>
                  )}

                {/* Renderizado para columnas booleanas */}
                {/* {column.isBoolean && column.onBooleanToggle && (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item[column.key as keyof T] as boolean}
                      onChange={(e) => {
                        //column.onBooleanToggle!(item, e.target.checked)
                        console.log(e.target.checked);
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                )} */}

                {/* Renderizado para otras columnas */}
                {!column.multilang &&
                  !column.isBoolean &&
                  (column.render
                    ? column.render(item)
                    : (item[column.key as keyof T] as React.ReactNode))}
              </td>
            ))}
            {actions && (
              <td className="border px-4 py-2">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    className={`btn ${action.buttonClass || ""} ml-2`}
                    onClick={() => action.onClick(item)}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

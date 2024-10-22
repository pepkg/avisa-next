import React from "react";

interface DataTableColumn<T extends object> {
  key: keyof T | string; // Permitir también "select" u otros campos no directamente en T
  label: React.ReactNode; // ReactNode para permitir JSX como <input />
  sortable?: boolean;
  render?: (item: T) => React.ReactNode; // Para renderizar contenido personalizado
}

// Declaramos el tipo que extiende a T con la propiedad _id y translations
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
  onSelectItem?: (id: string) => void;
  isSelected?: (id: string) => boolean;
  allSelected?: boolean;
  onSelectAll?: () => void;
  languages?: { iso: string }[];
  activeTab?: { [key: string]: string };
  onTabChange?: (id: string, iso: string) => void;
}

// Ya sabemos que T incluye _id y translations, entonces podemos utilizarlo sin problema
export default function DataTable<
  T extends { _id: string; translations?: Record<string, string> },
>({
  data,
  columns,
  actions,
  sortBy,
  sortOrder,
  onSort,
  onSelectItem,
  isSelected,
  allSelected,
  onSelectAll,
  languages,
  activeTab,
  onTabChange,
}: DataTableProps<T>) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
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
          {actions && <th className="border px-4 py-2">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border-t">
            {columns.map((column) => (
              <td key={String(column.key)} className="border px-4 py-2">
                {column.key === "select" && (
                  <>
                    {onSelectAll && (
                      <input
                        type="checkbox"
                        onChange={onSelectAll}
                        checked={allSelected || false}
                      />
                    )}
                    {onSelectItem && (
                      <input
                        type="checkbox"
                        onChange={() => onSelectItem(item._id)}
                        checked={isSelected ? isSelected(item._id) : false}
                      />
                    )}
                  </>
                )}

                {column.key === "translations" &&
                  languages &&
                  onTabChange &&
                  item.translations && ( // Ya podemos usar translations
                    <div>
                      <div className="tabs">
                        {languages.map((lang) => (
                          <button
                            key={lang.iso}
                            className={`tab ${
                              activeTab && activeTab[item._id] === lang.iso
                                ? "tab-active"
                                : ""
                            }`}
                            onClick={() => onTabChange(item._id, lang.iso)}
                          >
                            {lang.iso.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="translation-content">
                        {(activeTab &&
                          item.translations[activeTab[item._id]]) ||
                          item.translations.en}
                      </div>
                    </div>
                  )}

                {column.key !== "select" &&
                  column.key !== "translations" &&
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

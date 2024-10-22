import React, { useState } from "react";

interface TableHeaderControlsProps {
  addButtonText: string;
  resetButtonText: string;
  addButtonHref: string;
  searchPlaceholder: string;
  onFilter: (searchTerm: string) => void; // Nueva función para filtrar resultados
  onReset: () => void; // Función para resetear la búsqueda
}

const TableHeaderControls: React.FC<TableHeaderControlsProps> = ({
  addButtonText,
  resetButtonText,
  addButtonHref,
  searchPlaceholder,
  onFilter,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    onFilter(value); // Filtra los resultados desde aquí
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    onReset(); // Resetea la búsqueda y los resultados filtrados
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleResetSearch}
          className="bg-gray-200 px-4 py-1 ml-2 rounded"
        >
          {resetButtonText}
        </button>
      </div>
      <a
        href={addButtonHref}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {addButtonText}
      </a>
    </div>
  );
};

export default TableHeaderControls;

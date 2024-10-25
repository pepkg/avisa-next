import React from "react";

interface DeleteDialogProps {
  showDialog: boolean;
  itemId: string | null; // Aceptamos el ID del ítem a eliminar
  onDeleteSuccess: () => void;
  onCancelDelete: () => void;
  translationLiterals: Record<string, string>;
  deleteUrl: string; // La URL de la API para eliminar
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  showDialog,
  itemId,
  onDeleteSuccess,
  onCancelDelete,
  translationLiterals,
  deleteUrl,
}) => {
  if (!showDialog || !itemId) return null;

  const handleConfirmDelete = async () => {
    const res = await fetch(`${deleteUrl}/${itemId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      onDeleteSuccess();
    } else {
      console.error(
        translationLiterals["delete_error_message"] ||
          "Error al eliminar el registro.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <p>
          {translationLiterals["delete_confirmation"] ||
            "¿Estás seguro de que quieres eliminar este registro?"}
        </p>
        <div className="mt-4">
          <button className="btn btn-danger mr-4" onClick={handleConfirmDelete}>
            {translationLiterals["confirm_delete"] || "Confirmar"}
          </button>
          <button className="btn btn-secondary" onClick={onCancelDelete}>
            {translationLiterals["cancel_button"] || "Cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;

import React from "react";

interface BatchDeleteDialogProps {
  selectedCount: number; // Cantidad de elementos seleccionados
  onConfirmBatchDelete: () => void; // Función que se llama al confirmar la eliminación
  onCancelBatchDelete: () => void; // Función que se llama al cancelar el diálogo
  showDialog: boolean; // Si el diálogo debe mostrarse
  onShowDialog: () => void; // Función que abre el diálogo
  translationLiterals: Record<string, string>; // Literales para traducción
}

const BatchDeleteDialog: React.FC<BatchDeleteDialogProps> = ({
  selectedCount,
  onConfirmBatchDelete,
  onCancelBatchDelete,
  showDialog,
  onShowDialog,
  translationLiterals,
}) => {
  return (
    <>
      {/* Mostrar botón de batch delete si hay elementos seleccionados */}
      {selectedCount > 0 && (
        <button className="btn btn-danger mt-4" onClick={onShowDialog}>
          {translationLiterals["batch_delete_button"] ||
            "Eliminar seleccionados"}
        </button>
      )}

      {/* Diálogo de confirmación */}
      {showDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>
              {translationLiterals["batch_delete_confirmation"] ||
                "¿Estás seguro de que quieres eliminar las traducciones seleccionadas?"}
            </p>
            <div className="mt-4">
              <button
                className="btn btn-danger mr-4"
                onClick={onConfirmBatchDelete}
              >
                {translationLiterals["confirm_button"] || "Confirmar"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={onCancelBatchDelete}
              >
                {translationLiterals["cancel_button"] || "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchDeleteDialog;

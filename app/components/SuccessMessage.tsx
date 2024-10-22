import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface SuccessMessageProps {
  onClose?: () => void; // Ahora opcional, con comportamiento predeterminado
  closeButtonText?: string; // También opcional con valor predeterminado
  modelKey?: string; // Intentaremos deducir el prefijo a partir del nombre de la colección
  translationLiterals?: Record<string, string>; // Ahora opcional
}

type LiteralKeys =
  | "edit_success_message"
  | "add_success_message"
  | "del_success_message"
  | "close_button";

const defaultLiterals: Record<LiteralKeys, string> = {
  edit_success_message: "Registro editado con éxito.",
  add_success_message: "Registro agregado con éxito.",
  del_success_message: "Registro eliminado con éxito.",
  close_button: "Cerrar",
};

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  onClose,
  closeButtonText,
  modelKey,
  translationLiterals = {}, // Si no se pasa, se usan los literales por defecto
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>("");
  const searchParams = useSearchParams();

  // Inferir modelKey basado en la URL o usar "translations" como valor predeterminado
  const inferredModelKey = useMemo(() => {
    if (modelKey) return modelKey;

    // Intentamos obtener el prefijo de la URL o ruta
    const pathName = window.location.pathname.split("/");
    const collectionName = pathName[pathName.length - 2]; // Extraer el nombre de la colección
    return collectionName || "default"; // Valor predeterminado si no se puede inferir
  }, [modelKey]);

  // Lógica para combinar literales predeterminados con los pasados como props
  const literals = useMemo(
    () => ({
      ...defaultLiterals,
      ...translationLiterals,
    }),
    [translationLiterals],
  );

  // Función para obtener el literal correcto basado en el prefijo y la clave
  const getLiteral = useCallback(
    (key: LiteralKeys) => {
      const dynamicKey = `${inferredModelKey}_${key}` as LiteralKeys;
      return literals[dynamicKey as keyof typeof literals] || literals[key];
    },
    [literals, inferredModelKey],
  );

  // Acción predeterminada para cerrar el mensaje
  const defaultOnClose = () => setShowSuccessMessage("");

  useEffect(() => {
    if (searchParams.get("edit_success") === "true") {
      setShowSuccessMessage(getLiteral("edit_success_message"));
    } else if (searchParams.get("add_success") === "true") {
      setShowSuccessMessage(getLiteral("add_success_message"));
    } else if (searchParams.get("success") === "true") {
      setShowSuccessMessage(getLiteral("del_success_message"));
    }
  }, [searchParams, getLiteral]);

  if (!showSuccessMessage) return null;

  return (
    <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
      <p>{showSuccessMessage}</p>
      <button className="text-red-500 ml-4" onClick={onClose || defaultOnClose}>
        {closeButtonText || getLiteral("close_button")}
      </button>
    </div>
  );
};

export default SuccessMessage;

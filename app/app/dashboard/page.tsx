"use client";

import DashboardLayout from "./DashboardLayout";
import { useTranslations } from "@/hooks/useTranslations";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { translations } = useTranslations();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessMessage(true);
    }
  }, [searchParams]);

  const handleDismissMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <DashboardLayout>
      {showSuccessMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <p>{translations["success_message"] || "Operación exitosa."}</p>
          <button className="text-red-500 ml-4" onClick={handleDismissMessage}>
            {translations["dismiss_button"] || "Cerrar"}
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">
        {translations["dashboard_main_title"] || "Secciones del Dashboard"}
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">
            {translations["translations_section"] || "Traducciones"}
          </h3>
          <a
            href="/app/dashboard/translations"
            className="text-blue-500 hover:underline"
          >
            {translations["translation_action_link"] ||
              "Ver lista de traducciones"}
          </a>
          <a
            href="/app/dashboard/translations/edit/new"
            className="btn btn-primary mt-4 block"
          >
            {translations["add_translation_button"] ||
              "Agregar nueva traducción"}
          </a>
        </div>

        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">
            {translations["languages_section"] || "Idiomas"}
          </h3>
          <a
            href="/app/dashboard/languages"
            className="text-blue-500 hover:underline"
          >
            {translations["language_action_link"] || "Ver lista de idiomas"}
          </a>
          <a
            href="/app/dashboard/languages/edit/new"
            className="btn btn-primary mt-4 block"
          >
            {translations["add_language_button"] || "Agregar nuevo idioma"}
          </a>
        </div>
        {/* Aquí puedes agregar más secciones del dashboard */}
      </div>
    </DashboardLayout>
  );
}

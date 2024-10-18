"use client";

import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

export default function AvisaWeb() {
  const { translations } = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          {translations["welcome_message"] || "Welcome to Avisa Web"}
        </h1>
        <LanguageSelector />
        <label
          htmlFor="country-select"
          className="block text-lg font-medium text-gray-700"
        >
          {translations["country_select_label"] || "A qué país vas"}
        </label>
        <select
          id="country-select"
          className="mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="eua">{translations["country_eua"] || "EUA"}</option>
          <option value="españa">
            {translations["country_spain"] || "España"}
          </option>
          <option value="francia">
            {translations["country_france"] || "Francia"}
          </option>
        </select>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

// Decodifica un token JWT manualmente
function decodeJWT(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

interface DecodedToken {
  name: string;
  role: string;
}

export default function Dashboard() {
  const { translations } = useTranslations();
  const [user, setUser] = useState({ name: "", role: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/app"); // Redirige a login si no hay token
    } else {
      const decodedToken: DecodedToken = decodeJWT(token); // Usar la función manual
      setUser({ name: decodedToken.name, role: decodedToken.role });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {translations["dashboard_title"] || "Dashboard"}
        </h1>
        <div className="flex items-center">
          <LanguageSelector />
          <span className="mr-4">
            {translations["user_placeholder"] || "Usuario"}: {user.name} (
            {user.role})
          </span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            {translations["logout_button"] || "Logout"}
          </button>
        </div>
      </header>

      <main className="flex items-center justify-center h-full">
        <h2 className="text-2xl font-bold">
          {translations["login_welcome"] || "Bienvenido"}, {user.name}!
        </h2>
        <ul className="mt-4">
          <li>
            <a
              href="/app/dashboard/translations"
              className="text-blue-500 hover:underline"
            >
              {translations["translation_action_link"] ||
                "Gestionar Traducciones"}
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}

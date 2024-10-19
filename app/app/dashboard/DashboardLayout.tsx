"use client";

import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { translations } = useTranslations();
  const [user, setUser] = useState({ name: "", role: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/app");
    } else {
      const decodedToken: DecodedToken = decodeJWT(token);
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
        <a href="/app/dashboard" className="text-2xl font-bold hover:underline">
          {translations["dashboard_title"] || "Avisa App"}
        </a>
        <div className="flex items-center">
          <LanguageSelector />
          <span className="ml-4">
            {translations["user_placeholder"] || "Usuario"}: {user.name} (
            {user.role})
          </span>
          <button className="btn btn-secondary ml-4" onClick={handleLogout}>
            {translations["logout_button"] || "Logout"}
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

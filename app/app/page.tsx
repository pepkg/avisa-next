"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

export default function AvisaApp() {
  const { translations } = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.setItem("token", data.token);
      router.push("/app/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          {translations["login_welcome"] || "Bienvenido a la app Avisa"}
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={translations["email_placeholder"] || "Correo"}
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={translations["password_placeholder"] || "Contraseña"}
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            {translations["login_button"] || "Iniciar sesión"}
          </button>
        </form>
        <p className="mt-4">
          <a
            href="/app/forgot-password"
            className="text-blue-500 hover:underline"
          >
            {translations["forgot_password"] || "¿Olvidaste tu contraseña?"}
          </a>
        </p>
        <p className="mt-4">
          {translations["no_account"] || "¿No tienes una cuenta?"}{" "}
          <a href="/app/register" className="text-blue-500 hover:underline">
            {translations["register_here"] || "Regístrate aquí"}
          </a>
        </p>
        <LanguageSelector />
      </div>
    </div>
  );
}

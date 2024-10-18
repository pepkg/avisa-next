"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

export default function ResetPassword() {
  const { translations } = useTranslations();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const res = await fetch(`/api/reset-password?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage(
        translations["reset_ok_password"] ||
          "Contraseña restablecida correctamente",
      );
      router.push("/app"); // Redirigir a login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          {translations["reset_password"] || "Restablecer Contraseña"}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder={
              translations["new_password"] || "Ingresa tu nueva contraseña"
            }
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            {translations["new_password"] || "Restablecer Contraseña"}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
        <LanguageSelector />
      </div>
    </div>
  );
}

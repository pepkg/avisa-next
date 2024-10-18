"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

export default function ForgotPassword() {
  const { translations } = useTranslations();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage("Revisa tu correo para restablecer la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          {translations["forgot_password"] || "¿Olvidaste tu contraseña?"}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={translations["email_placeholder"] || "Email"}
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            {translations["send_button"] || "Enviar"}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
        <LanguageSelector />
      </div>
    </div>
  );
}

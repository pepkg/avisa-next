"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageSelector from "@/components/LanguageSelector";

export default function Register() {
  const { translations } = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);
      // Redirigir al dashboard
      alert(data.message);
      router.push("/app/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          {translations["register_here"] || "Regístrate"}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={translations["name_placeholder"] || "Nombre"}
            className="input input-bordered w-full mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder={translations["email_placeholder"] || "Email"}
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={translations["passsword_placeholder"] || "Contraseña"}
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            {translations["register_here"] || "Regístrate aquí"}
          </button>
        </form>
        <p className="mt-4">
          {translations["forgot_password"] || "¿Olvidaste la contraseña?"}
          <a
            href="/app/forgot-password"
            className="text-blue-500 hover:underline"
          >
            {translations["reset_password"] || "Restablecer contraseña"}
          </a>
        </p>
        <p className="mt-4">
          {translations["existing_account"] || "¿Ya tienes una cuenta?"}{" "}
          <a href="/app" className="text-blue-500 hover:underline">
            {translations["login_button"] || "Iniciar sesión"}
          </a>
        </p>
        <LanguageSelector />
      </div>
    </div>
  );
}

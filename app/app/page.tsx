"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AvisaApp() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: login, password }),
    });

    const data = await res.json();

    if (data.token) {
      // Simula un almacenamiento del token y redirige al dashboard
      localStorage.setItem("token", data.token);
      router.push("/app/dashboard");
    } else {
      alert("Login incorrecto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a la app Avisa</h1>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="login"
            className="block text-lg font-medium text-gray-700"
          >
            Login:
          </label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="Escribe tu usuario"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Escribe tu contraseña"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary mt-4 w-full">Entrar</button>
        </form>
        <p className="mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/app/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}

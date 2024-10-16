"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
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
        <h1 className="text-2xl font-bold mb-4">Regístrate</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            className="input input-bordered w-full mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            Registrarse
          </button>
        </form>
        <p className="mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/app" className="text-blue-500 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

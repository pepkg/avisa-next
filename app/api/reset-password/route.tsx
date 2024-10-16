import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const { password } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Token no proporcionado" },
      { status: 400 },
    );
  }

  let decodedToken: string | JwtPayload;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 400 },
    );
  }

  // Verificar si decodedToken es un JwtPayload y contiene el id
  if (typeof decodedToken === "object" && "id" in decodedToken) {
    await dbConnect();
    const user = await User.findById((decodedToken as JwtPayload).id); // Forzar tipo JwtPayload

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: "Contraseña restablecida correctamente",
    });
  } else {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }
}

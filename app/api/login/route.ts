import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 400 },
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 400 },
    );
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" },
  );

  return NextResponse.json({
    message: "Login exitoso",
    token,
  });
}

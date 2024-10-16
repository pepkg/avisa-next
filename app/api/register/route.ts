import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "El usuario ya existe" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "agency", // Nivel por defecto "agency"
  });
  await newUser.save();

  // Generar token JWT
  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
      name: newUser.name,
      mail: newUser.mail,
    },
    process.env.JWT_SECRET || "secret",
  );

  return NextResponse.json({
    message: "Usuario registrado exitosamente",
    token, // Devolvemos el token
    user: { name: newUser.name, role: newUser.role },
  });
}

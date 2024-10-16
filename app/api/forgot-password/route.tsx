import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { email } = await req.json();
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  // Generar token de restablecimiento de contraseña
  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" },
  );

  const resetUrl = `http://localhost:3000/app/reset-password?token=${token}`; // Enlace de restablecimiento

  // Configurar el transportador de nodemailer para enviar el correo
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Configura tu correo
      pass: process.env.EMAIL_PASS, // Configura tu contraseña
    },
  });

  // Contenido del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Restablecer contraseña",
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  try {
    // Enviar correo
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Correo de restablecimiento enviado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando el correo" },
      { status: 500 },
    );
  }
}

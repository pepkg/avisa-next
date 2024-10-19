import { NextResponse } from "next/server";
import { Translation } from "@/models/Translation";
import dbConnect from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;
  const translation = await Translation.findById(id);
  if (!translation) {
    return NextResponse.json(
      { error: "Translation not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(translation);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedTranslation = await Translation.findByIdAndDelete(id);
    if (!deletedTranslation) {
      return NextResponse.json(
        { error: "Translation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Translation deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete translation" },
      { status: 500 },
    );
  }
}

// Agrega el método PUT aquí para manejar las actualizaciones
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;
  const { label, translations } = await req.json();

  try {
    const updatedTranslation = await Translation.findByIdAndUpdate(
      id,
      { label, translations },
      { new: true }, // Devuelve el documento actualizado
    );
    if (!updatedTranslation) {
      return NextResponse.json(
        { error: "Translation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedTranslation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update translation" },
      { status: 500 },
    );
  }
}

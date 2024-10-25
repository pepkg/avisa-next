import { NextResponse } from "next/server";
import { Language } from "@/models/Language";
import dbConnect from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;
  const language = await Language.findById(id);
  if (!language) {
    return NextResponse.json({ error: "Language not found" }, { status: 404 });
  }
  return NextResponse.json(language);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedLanguage = await Language.findByIdAndDelete(id);
    if (!deletedLanguage) {
      return NextResponse.json(
        { error: "Language not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Language deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete language" },
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
  console.log("id " + id);
  const { iso, names, published } = await req.json(); // Usar isPublic en lugar de public
  console.log("iso " + iso);
  console.log("names " + names);
  console.log("published " + published);
  try {
    const updatedLanguage = await Language.findByIdAndUpdate(
      id,
      { iso, names, published }, // Usar isPublic en lugar de public
      { new: true }, // Devuelve el documento actualizado
    );
    console.log(updatedLanguage);
    if (!updatedLanguage) {
      return NextResponse.json(
        { error: "Language not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedLanguage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update language" },
      { status: 500 },
    );
  }
}

// app/api/languages/route.ts
import { NextResponse } from "next/server";
import { Language } from "@/models/Language";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();
  const languages = await Language.find();
  return NextResponse.json(languages);
}

export async function POST(req: Request) {
  const { iso, names } = await req.json();
  await dbConnect();

  const newLanguage = new Language({ iso, names });
  await newLanguage.save();
  return NextResponse.json(newLanguage);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  try {
    await Language.findByIdAndDelete(id);
    return NextResponse.json({ message: "Language deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete language" },
      { status: 500 },
    );
  }
}

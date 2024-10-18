// app/api/translations/route.ts
import { NextResponse } from "next/server";
import { Translation } from "@/models/Translation";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();
  const translations = await Translation.find();
  return NextResponse.json(translations);
}

export async function POST(req: Request) {
  const { label, translations } = await req.json();
  await dbConnect();

  const newTranslation = new Translation({ label, translations });
  await newTranslation.save();
  return NextResponse.json(newTranslation);
}

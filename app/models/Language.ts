import mongoose, { Schema, model, Document } from "mongoose";

interface ILanguage extends Document {
  iso: string;
  names: Record<string, string>;
}

const LanguageSchema = new Schema({
  iso: { type: String, required: true, unique: true },
  names: { type: Map, of: String, required: true },
});

export const Language =
  mongoose.models.Language || model<ILanguage>("Language", LanguageSchema);

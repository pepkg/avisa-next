import mongoose, { Schema, model, Document } from "mongoose";

interface ILanguage extends Document {
  iso: string;
  published: boolean;
  names: Record<string, string>;
}

const LanguageSchema = new Schema({
  iso: { type: String, required: true, unique: true },
  published: { type: Boolean, required: true, default: false },
  names: { type: Map, of: String, required: true },
});

export const Language =
  mongoose.models.Language || model<ILanguage>("Language", LanguageSchema);

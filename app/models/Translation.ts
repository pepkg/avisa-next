import mongoose, { Schema, model, Document } from "mongoose";

interface ITranslation extends Document {
  label: string;
  translations: Record<string, string>;
}

const TranslationSchema = new Schema({
  label: { type: String, required: true, unique: true },
  translations: { type: Map, of: String, required: true },
});

export const Translation =
  mongoose.models.Translation ||
  model<ITranslation>("Translation", TranslationSchema);

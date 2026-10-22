import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type ContactDoc = InferSchemaType<typeof ContactSchema>;
export default (mongoose.models.Contact as Model<ContactDoc>) || mongoose.model<ContactDoc>("Contact", ContactSchema);

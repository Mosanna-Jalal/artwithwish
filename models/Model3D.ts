import mongoose, { Schema, Document, Model } from "mongoose";

export interface IModel3D extends Document {
  name: string;
  description?: string;
  fileUrl: string;
  publicId: string;
  thumbnailUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Model3DSchema = new Schema<IModel3D>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    thumbnailUrl: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Model3D: Model<IModel3D> =
  mongoose.models.Model3D || mongoose.model<IModel3D>("Model3D", Model3DSchema);

export default Model3D;

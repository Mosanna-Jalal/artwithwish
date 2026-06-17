import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtwork extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
  category: string;
  dimensions?: string;
  medium?: string;
  available: boolean;
  featured: boolean;
  // Instagram provenance — used for incremental sync (never overwrite edits)
  igShortcode?: string;
  igTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    videos: { type: [String], default: [] },
    category: { type: String, required: true, default: "Calligraphy" },
    dimensions: { type: String },
    medium: { type: String },
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    // Unique per Instagram post so re-sync skips posts that already exist
    igShortcode: { type: String, unique: true, sparse: true, index: true },
    igTimestamp: { type: Date },
  },
  { timestamps: true }
);

const Artwork: Model<IArtwork> =
  mongoose.models.Artwork || mongoose.model<IArtwork>("Artwork", ArtworkSchema);

export default Artwork;

import mongoose, { Schema, Document, Model } from "mongoose";

export type HeadingFont = "amiri" | "aref" | "reem" | "brush";

export interface ISettings extends Document {
  key: string; // singleton key, always "site"
  headingFont: HeadingFont;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, default: "site", unique: true },
    headingFont: {
      type: String,
      enum: ["amiri", "aref", "reem", "brush"],
      default: "brush",
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;

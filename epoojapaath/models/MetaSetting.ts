import mongoose, { Schema, Document } from "mongoose";

export interface IMetaSetting extends Document {
  pixelId: string;
  pageViewOffset: number;
  viewContentOffset: number;
  initiateCheckoutOffset: number;
  adSpendOverride?: number;
  leadsOverride?: number;
  updatedAt: Date;
}

const MetaSettingSchema = new Schema<IMetaSetting>(
  {
    pixelId: { type: String, required: true, default: "1347524480826624" },
    pageViewOffset: { type: Number, default: 2872 },
    viewContentOffset: { type: Number, default: 1699 },
    initiateCheckoutOffset: { type: Number, default: 69 },
    adSpendOverride: { type: Number, default: 0 },
    leadsOverride: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MetaSetting || mongoose.model<IMetaSetting>("MetaSetting", MetaSettingSchema);

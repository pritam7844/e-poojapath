import mongoose, { Schema, Document } from "mongoose";

export interface IPixelEvent extends Document {
  eventName: "PageView" | "ViewContent" | "InitiateCheckout" | "Lead" | "Purchase";
  path?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  fbclid?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const PixelEventSchema = new Schema<IPixelEvent>(
  {
    eventName: {
      type: String,
      required: true,
      enum: ["PageView", "ViewContent", "InitiateCheckout", "Lead", "Purchase"],
      index: true,
    },
    path: { type: String, default: "" },
    utmSource: { type: String, default: "" },
    utmCampaign: { type: String, default: "" },
    utmMedium: { type: String, default: "" },
    fbclid: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation model error in Next.js HMR
export default mongoose.models.PixelEvent || mongoose.model<IPixelEvent>("PixelEvent", PixelEventSchema);

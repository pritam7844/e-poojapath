import mongoose, { Schema, Document, models } from "mongoose";

export interface IPujaPackage {
  label: string;        // "Single" | "Two People" | "Family"
  persons: string;      // "For 1 person" | "Upto 2 people"
  price: number;
  maxPersons: number;
}

export interface IPujaFaq {
  question: string;
  answer: string;
}

export interface IPujaDoc extends Document {
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  duration: string;
  image: string;
  benefits: string[];
  benefitsHi: string[];
  includes: string[];
  packages: IPujaPackage[];
  scheduledAt?: Date;
  availableDates?: string[];
  rating: number;
  reviewCount: number;
  faqs: IPujaFaq[];
  temple: mongoose.Types.ObjectId;
  isActive: boolean;
  status: "pending" | "approved" | "rejected";
  totalBooked: number;
  slotsText?: string;
  isSubscription?: boolean;
  subscriptionType?: "weekly" | "monthly";
  discount3Months?: number;
  discount6Months?: number;
  videoUrl?: string;
  chadawas?: mongoose.Types.ObjectId[];
  createdAt: Date;
}


const PackageSchema = new Schema<IPujaPackage>({
  label:      { type: String, required: true },
  persons:    { type: String, required: true },
  price:      { type: Number, required: true },
  maxPersons: { type: Number, required: true },
}, { _id: false });

const FaqSchema = new Schema<IPujaFaq>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
}, { _id: false });

const PujaSchema = new Schema<IPujaDoc>(
  {
    name:          { type: String, required: true },
    nameHi:        { type: String, required: true },
    description:   { type: String, required: true },
    descriptionHi: { type: String, required: true },
    price:         { type: Number, required: true },
    duration:      { type: String, required: true },
    image:         { type: String, required: true },
    benefits:      [{ type: String }],
    benefitsHi:    [{ type: String }],
    includes:      [{ type: String }],
    packages:      [PackageSchema],
    scheduledAt:   { type: Date },
    availableDates: [{ type: String }],
    rating:        { type: Number, default: 0 },
    reviewCount:   { type: Number, default: 0 },
    faqs:          [FaqSchema],
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    isActive:      { type: Boolean, default: true },
    status:        { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    totalBooked:   { type: Number, default: 0 },
    slotsText:     { type: String },
    isSubscription: { type: Boolean, default: false },
    subscriptionType: { type: String, enum: ["weekly", "monthly"], default: "monthly" },
    discount3Months: { type: Number, default: 0 },
    discount6Months: { type: Number, default: 0 },
    videoUrl:      { type: String },
    chadawas:      [{ type: Schema.Types.ObjectId, ref: "Chadawa" }],
  },
  { timestamps: true }

);

if (process.env.NODE_ENV === "development") {
  delete models.Puja;
}

export default models.Puja || mongoose.model<IPujaDoc>("Puja", PujaSchema);

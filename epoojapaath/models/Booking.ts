import mongoose, { Schema, Document, models } from "mongoose";

export interface IBookingDoc extends Document {
  user: mongoose.Types.ObjectId;
  temple: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  serviceType: "puja" | "chadawa";
  serviceName: string;
  serviceNameHi: string;
  amount: number;
  dakshina?: number;
  devoteeName: string;
  gotra?: string;
  sankalp?: string;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentId?: string;
  orderId?: string;
  paymentStatus: "pending" | "paid" | "failed";
  prasadDelivery: boolean;
  prasadAddress?: string;
  videoUrl?: string;
  selectedPackage?: string;
  selectedPackagePrice?: number;
  selectedChadawa?: Array<{
    name: string;
    price: number;
    qty: number;
    total: number;
  }>;
    selectedItems?: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  subscriptionParentId?: string;
  subscriptionDuration?: number;
  subscriptionCycleIndex?: number;
  whatsappPhone?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  fbclid?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBookingDoc>(
  {
    user:          { type: Schema.Types.ObjectId, ref: "User", required: true },
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    service:       { type: Schema.Types.ObjectId, required: true },
    serviceType:   { type: String, enum: ["puja", "chadawa"], required: true },
    serviceName:   { type: String, required: true },
    serviceNameHi: { type: String, required: true },
    amount:        { type: Number, required: true },
    dakshina:      { type: Number, default: 0 },
    devoteeName:   { type: String, required: true },
    gotra:         { type: String },
    sankalp:       { type: String },
    date:          { type: Date, required: true },
    status:        { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    paymentId:     { type: String },
    orderId:       { type: String },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    prasadDelivery: { type: Boolean, default: false },
    prasadAddress:  { type: String },
    videoUrl:       { type: String },
    selectedPackage: { type: String },
    selectedPackagePrice: { type: Number },
    selectedChadawa: [
      {
        name: { type: String },
        price: { type: Number },
        qty: { type: Number },
        total: { type: Number },
      }
    ],
    selectedItems: [
      {
        name: { type: String },
        qty: { type: Number },
        price: { type: Number },
      }
    ],
    subscriptionParentId: { type: String },
    subscriptionDuration: { type: Number },
    subscriptionCycleIndex: { type: Number },
    whatsappPhone: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    fbclid: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ temple: 1, date: -1 });

export default models.Booking || mongoose.model<IBookingDoc>("Booking", BookingSchema);

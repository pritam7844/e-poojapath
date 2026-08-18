export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "temple_owner" | "admin";
  avatar?: string;
  gotra?: string;
  city?: string;
  language: "en" | "hi";
  isBlocked: boolean;
  createdAt: string;
}

export interface ITemple {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  deity: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
  };
  images: string[];
  coverImage: string;
  timings: string;
  established?: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  owner: string | IUser;
  totalBookings: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  availableChadawaDates?: string[];
  createdAt: string;
}

export interface IPujaPackage {
  label: string;
  persons: string;
  price: number;
  maxPersons: number;
}

export interface IPujaFaq {
  question: string;
  answer: string;
}

export interface IPuja {
  _id: string;
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
  scheduledAt?: string;
  availableDates?: string[];
  rating: number;
  reviewCount: number;
  faqs: IPujaFaq[];
  temple: string | ITemple;
  isActive: boolean;
  totalBooked: number;
  slotsText?: string;
  isSubscription?: boolean;
  subscriptionType?: "weekly" | "monthly";
  discount3Months?: number;
  discount6Months?: number;
  videoUrl?: string;
  chadawas?: string[];
  createdAt: string;
}

export interface IChadawaOfferingItem {
  name: string;
  nameHi: string;
  price: number;
  image: string;
  description?: string;
}

export interface IChadawa {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  items: string[];
  offeringItems: IChadawaOfferingItem[];
  deity: string;
  temple: string | ITemple;
  isActive: boolean;
  isSpecial: boolean;
  availableDates?: string[];
  createdAt: string;
}

export interface IBooking {
  _id: string;
  user: string | IUser;
  temple: string | ITemple;
  service: string;
  serviceType: "puja" | "chadawa";
  serviceName: string;
  serviceNameHi: string;
  amount: number;
  dakshina?: number;
  devoteeName: string;
  gotra?: string;
  sankalp?: string;
  date: string;
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
  createdAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  titleHi: string;
  slug: string;
  content: string;
  contentHi: string;
  excerpt: string;
  excerptHi: string;
  coverImage: string;
  author: string | IUser;
  temple?: string | ITemple;
  category: "devotional" | "temple-story" | "festival" | "astrology" | "announcement";
  tags: string[];
  status: "draft" | "published" | "archived";
  isAdminFeatured: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
}

export interface IAd {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: "hero" | "sidebar" | "footer" | "between-sections";
  isActive: boolean;
  startDate: string;
  endDate: string;
  clicks: number;
  impressions: number;
  createdBy: string | IUser;
  targetType?: "all" | "selected_pujas";
  targetPujas?: string[];
  createdAt: string;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  temple: string | ITemple;
  booking?: string | IBooking;
  rating: number;
  comment: string;
  reviewerName?: string;
  city?: string;
  createdAt: string;
}

export interface ITempleRequest {
  _id: string;
  templeName: string;
  deity?: string;
  city: string;
  state: string;
  contactName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: "pending" | "contacted" | "completed" | "rejected";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  fbclid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


import api from "./client";

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: Brand;
  category: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  price: number;
  clinicPrice: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  badges?: string[];
}

export interface Dealer {
  _id: string;
  name: string;
  slug: string;
  city: City;
  province?: string;
  phone: string;
  whatsapp?: string;
  logo?: string;
  profilePhoto?: string;
  storePhotos: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  description?: string;
  yearsInOperation?: number;
  services: string[];
  brandsCarried: Brand[];
}

export interface Resource {
  _id: string;
  title: string;
  slug: string;
  type: "article" | "guide" | "catalog" | "video" | "brochure" | "manual";
  summary: string;
  body?: string;
  fileUrl?: string;
  videoUrl?: string;
  coverImage?: string;
  category?: string;
  publishedAt?: string;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
}

export const getProducts = (params?: { category?: string; brand?: string; search?: string }) =>
  api.get<Product[]>("/products", { params }).then((r) => r.data);

export const getProductBySlug = (slug: string) =>
  api.get<Product>(`/products/${slug}`).then((r) => r.data);

export const getBrands = () => api.get<Brand[]>("/brands").then((r) => r.data);

export const getCities = () => api.get<City[]>("/cities").then((r) => r.data);

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  cityId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  items: OrderItemInput[];
  isClinicOrder?: boolean;
}

export const createOrder = (data: CreateOrderInput) =>
  api.post("/orders", data).then((r) => r.data);

export const getPublicDealers = (params?: { province?: string; city?: string }) =>
  api.get<Dealer[]>("/dealers/public", { params }).then((r) => r.data);

export const getPublicDealerBySlug = (slug: string) =>
  api.get<Dealer>(`/dealers/public/${slug}`).then((r) => r.data);

export const getResources = (params?: { type?: string; category?: string; search?: string }) =>
  api.get<Resource[]>("/resources", { params }).then((r) => r.data);

export const getResourceBySlug = (slug: string) =>
  api.get<Resource>(`/resources/${slug}`).then((r) => r.data);

export interface QuoteRequestInput {
  organizationName: string;
  contactName: string;
  phone: string;
  email?: string;
  items: string;
  message?: string;
}

export const submitQuoteRequest = (data: QuoteRequestInput) =>
  api.post("/quotes", data).then((r) => r.data);

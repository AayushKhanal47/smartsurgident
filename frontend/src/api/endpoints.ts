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

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const getCategories = () => api.get<Category[]>("/categories").then((r) => r.data);

export const createCategory = (data: { name: string; slug: string; description?: string }) =>
  api.post<Category>("/categories", data).then((r) => r.data);

export const createBrandAdmin = (data: { name: string; slug: string; logoUrl?: string; description?: string }) =>
  api.post<Brand>("/brands", data).then((r) => r.data);

export interface CreateProductInput {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  clinicPrice: number;
  stock: number;
  sku: string;
  images?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export const createProductAdmin = (data: CreateProductInput) =>
  api.post<Product>("/products", data).then((r) => r.data);

export interface CreateDealerInput {
  name: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  province?: string;
  whatsapp?: string;
  profilePhoto?: string;
}

export const createDealerAdmin = (data: CreateDealerInput) =>
  api.post("/dealers", data).then((r) => r.data);

export const getDealersAdmin = () => api.get("/dealers").then((r) => r.data);

export interface CreateCampaignInput {
  title: string;
  slug: string;
  description?: string;
  placement: "homepage" | "category" | "standalone";
  isActive: boolean;
}

export const createCampaignAdmin = (data: CreateCampaignInput) =>
  api.post("/campaigns", data).then((r) => r.data);

export const getCampaigns = (params?: { placement?: string }) =>
  api.get("/campaigns", { params }).then((r) => r.data);

export interface CreateResourceInput {
  title: string;
  slug: string;
  type: "article" | "guide" | "catalog" | "video" | "brochure" | "manual";
  summary: string;
  body?: string;
  isPublished: boolean;
}

export const createResourceAdmin = (data: CreateResourceInput) =>
  api.post<Resource>("/resources", data).then((r) => r.data);

export interface QuoteRequestRecord {
  _id: string;
  organizationName: string;
  contactName: string;
  phone: string;
  email?: string;
  items: string;
  message?: string;
  status: "new" | "in_progress" | "quoted" | "closed";
  createdAt: string;
}

export const getQuoteRequestsAdmin = () => api.get<QuoteRequestRecord[]>("/quotes").then((r) => r.data);

export const updateQuoteStatusAdmin = (id: string, status: string) =>
  api.patch(`/quotes/${id}/status`, { status }).then((r) => r.data);

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const loginAdmin = (email: string, password: string) =>
  api.post<AdminUser>("/auth/login", { email, password }).then((r) => r.data);

export const getMe = () => api.get<AdminUser>("/auth/me").then((r) => r.data);

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

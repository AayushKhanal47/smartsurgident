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

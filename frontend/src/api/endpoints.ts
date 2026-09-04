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
  website?: string;
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
  summary: string;
  fileUrl?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  showOnHomepage?: boolean;
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

export const getResources = (params?: { search?: string }) =>
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

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const createCategory = (data: CategoryInput) =>
  api.post<Category>("/categories", data).then((r) => r.data);

export const updateCategoryAdmin = (id: string, data: Partial<CategoryInput>) =>
  api.put<Category>(`/categories/${id}`, data).then((r) => r.data);

export interface BrandInput {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export const createBrandAdmin = (data: BrandInput) =>
  api.post<Brand>("/brands", data).then((r) => r.data);

export const updateBrandAdmin = (id: string, data: Partial<BrandInput>) =>
  api.put<Brand>(`/brands/${id}`, data).then((r) => r.data);

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

export const updateProductAdmin = (id: string, data: Partial<CreateProductInput>) =>
  api.put<Product>(`/products/${id}`, data).then((r) => r.data);

export interface CreateDealerInput {
  name: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  province?: string;
  whatsapp?: string;
  website?: string;
  profilePhoto?: string;
  logo?: string;
  storePhotos?: string[];
  address?: string;
  openingHours?: string;
  description?: string;
  yearsInOperation?: number;
  services?: string[];
  brandsCarried?: string[];
}

export const createDealerAdmin = (data: CreateDealerInput) =>
  api.post("/dealers", data).then((r) => r.data);

export const updateDealerAdmin = (id: string, data: Partial<Omit<CreateDealerInput, "password">> & { password?: string }) =>
  api.put(`/dealers/${id}`, data).then((r) => r.data);

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

export const updateCampaignAdmin = (id: string, data: Partial<CreateCampaignInput>) =>
  api.put(`/campaigns/${id}`, data).then((r) => r.data);

export const getCampaigns = (params?: { placement?: string }) =>
  api.get("/campaigns", { params }).then((r) => r.data);

export interface CreateResourceInput {
  title: string;
  summary: string;
  coverImage?: string;
  fileUrl: string;
  isPublished: boolean;
  showOnHomepage?: boolean;
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

export const logoutAdmin = () => api.post("/auth/logout");

export const getMe = () => api.get<AdminUser>("/auth/me").then((r) => r.data);

export interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const getAdminsAdmin = () => api.get<AdminAccount[]>("/auth/admins").then((r) => r.data);

export const createAdminAdmin = (data: { name: string; email: string; password: string }) =>
  api.post<AdminAccount>("/auth/admins", data).then((r) => r.data);

export const resetAdminPasswordAdmin = (id: string, password: string) =>
  api.patch(`/auth/admins/${id}/password`, { password }).then((r) => r.data);

export const deleteAdminAdmin = (id: string) => api.delete(`/auth/admins/${id}`).then((r) => r.data);

export const changeMyPasswordAdmin = (currentPassword: string, newPassword: string) =>
  api.patch("/auth/me/password", { currentPassword, newPassword }).then((r) => r.data);

export interface DealerSession {
  _id: string;
  name: string;
  city: string;
}

export interface DealerOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: "placed" | "accepted_by_dealer" | "dispatched" | "delivered" | "cancelled";
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export const loginDealer = (email: string, password: string) =>
  api.post<DealerSession>("/dealers/login", { email, password }).then((r) => r.data);
export const logoutDealer = () => api.post("/dealers/logout");
export const getDealerOrders = () => api.get<DealerOrder[]>("/orders/dealer").then((r) => r.data);
export const updateDealerOrderStatus = (id: string, status: DealerOrder["status"]) =>
  api.patch<DealerOrder>(`/orders/${id}/status`, { status }).then((r) => r.data);

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

export const deleteProductAdmin = (id: string) => api.delete(`/products/${id}`).then((r) => r.data);
export const deleteCategoryAdmin = (id: string) => api.delete(`/categories/${id}`).then((r) => r.data);
export const deleteBrandAdmin = (id: string) => api.delete(`/brands/${id}`).then((r) => r.data);
export const deleteDealerAdmin = (id: string) => api.delete(`/dealers/${id}`).then((r) => r.data);
export const deleteCampaignAdmin = (id: string) => api.delete(`/campaigns/${id}`).then((r) => r.data);
export const deleteResourceAdmin = (id: string) => api.delete(`/resources/${id}`).then((r) => r.data);

export const getAllCampaignsAdmin = () => api.get("/campaigns/admin/all").then((r) => r.data);
export const getAllResourcesAdmin = () => api.get<Resource[]>("/resources/admin/all").then((r) => r.data);

export const updateResourceAdmin = (id: string, data: Partial<CreateResourceInput>) =>
  api.put<Resource>(`/resources/${id}`, data).then((r) => r.data);

// Types mirror the Nest backend (Prisma models + controller responses).

export interface User {
  id: number;
  email: string;
}

export interface Seller {
  id: number;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  userId: number;
  sold: boolean;
  imageUrl: string | null;
  user: Seller;
}

/** GET /products/:id adds imageExists */
export interface ProductDetail extends Product {
  imageExists: boolean;
}

/** POST /products returns the row without the `user` relation */
export type CreatedProduct = Omit<Product, "user">;

export type ProductStatusFilter = "all" | "available";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
}

/** socket.io "productUpdated" payload */
export interface ProductEvent {
  productId: number;
  type: "created" | "sold" | "updated";
}

export interface CheckoutSession {
  id: string;
  url: string | null;
}

export interface LoginResponse {
  tokenPayload: { userId: number };
  user: User;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  available: number; // Количество доступное на складе
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderOption {
  id: string;
  name: string;
  selected: boolean;
}

export interface Order {
  items: CartItem[];
  options: OrderOption[];
  totalAmount: number;
}

export type AnalyticsEvent = {
  type: 'CART_UPDATED' | 'ORDER_SUBMITTED';
  items: CartItem[];
  options: OrderOption[];
  timestamp: number;
  status?: 'SENT' | 'FAILED';
}

export type ApiError = {
  code: string;
  message: string;
}

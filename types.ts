
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  color: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppSection {
  Home = 'home',
  Shop = 'shop',
  Stylist = 'stylist',
  Cart = 'cart',
  Admin = 'admin'
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

export interface GearProvider {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
  };
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string | null;
  providerId: string;
  provider: GearProvider;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface GearFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}
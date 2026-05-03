export interface CartPackageItem {
  packageId: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  startDate: string | Date;
  endDate: string | Date;
  seatsAvailable: number;
  category: string;
  startLocation: string;
  endLocation: string;
}

export interface AddToCartRequest {
  userId: string;
  item: CartPackageItem;
}

export interface RemoveFromCartRequest {
  userId: string;
  packageId: string;
}

export interface ClearCartRequest {
  userId: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data?: {
    cartId: string;
    userId: string;
    items: CartPackageItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CartItemResponse {
  success: boolean;
  message: string;
  data?: CartPackageItem;
}

export interface UserCartResponse {
  success: boolean;
  message: string;
  data?: {
    cartId: string;
    userId: string;
    items: CartPackageItem[];
    totalAmount: number;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
  };
}

export type PyszneLocaLJSONFile = { requested: number; restaurants: Pyszne_Restaurants | null | Record<string, never> };
export type PyszneLocaLJSON = { requested: number; restaurants: Pyszne_Restaurants };

export type Pyszne_Restaurants = Record<string, Pyszne_SimpleRestaurant>;

export interface Pyszne_SimpleRestaurant {
  id: string;
  primarySlug: string;
  indicators: Pyszne_Indicators;
  priceRange: number;
  popularity: number;
  brand: Pyszne_Brand;
  cuisineTypes: string[];
  rating: Pyszne_Rating;
  location: Pyszne_Location;
  supports: Pyszne_Supports;
  shippingInfo: Pyszne_ShippingInfo;
  paymentMethods: string[];
}

export interface Pyszne_ShippingInfo {
  delivery: Pyszne_Delivery;
  pickup: Pyszne_Pickup;
}

export interface Pyszne_Delivery {
  isOpenForOrder: boolean;
  isOpenForPreorder: boolean;
  openingTime?: any;
  duration: number;
  durationRange: Pyszne_DurationRange;
  deliveryFeeDefault: number;
  minOrderValue: number;
  lowestDeliveryFee: Pyszne_LowestDeliveryFee;
  dynamicDeliveryFeeInfo: Pyszne_DynamicDeliveryFeeInfo;
}

export interface Pyszne_DynamicDeliveryFeeInfo {
  expiryTime?: number;
  token?: string;
}

export interface Pyszne_Pickup {
  isOpenForOrder: boolean;
  isOpenForPreorder: boolean;
  openingTime?: any;
  distance: Pyszne_Distance;
}

export interface Pyszne_Distance {
  unit: string;
  quantity: number;
}

export interface Pyszne_LowestDeliveryFee {
  from: number;
  fee: number;
}

export interface Pyszne_DurationRange {
  min: number;
  max: number;
}

export interface Pyszne_Supports {
  delivery: boolean;
  pickup: boolean;
  vouchers: boolean;
  stampCards: boolean;
  discounts: boolean;
}

export interface Pyszne_Location {
  streetAddress: string;
  city: string;
  country: string;
  lat: string;
  lng: string;
  timeZone: string;
}

export interface Pyszne_Rating {
  votes: number;
  score: number;
}

export interface Pyszne_Brand {
  name: string;
  logoUrl: string;
  heroImageUrl: string;
  heroImageUrlType: string;
  branchName: string;
}

export interface Pyszne_Indicators {
  isDeliveryByScoober: boolean;
  isNew: boolean;
  isTestRestaurant: boolean;
  isGroceryStore: boolean;
  isSponsored: boolean;
}

export interface PyszneLocaLJSON_Restaurant {
  requested: number;
  products: Products | null | Record<string, never>;
}

export type Products = Record<string, Product>;

export interface Product {
  name: string;
  description: any[];
  imageUrl: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  name?: string;
  optionGroupIds?: string[];
  shippingTypes: string[];
  prices: Prices;
  metric: Metric;
  priceUnit?: any;
  pricePerUnitPickup?: any;
  pricePerUnitDelivery?: any;
  alcoholVolume?: any;
  caffeineAmount?: string;
  isSoldOut: boolean;
  isExcludedFromMov: boolean;
}

export interface Metric {
  unit?: any;
  quantity?: any;
}

export interface Prices {
  delivery: number;
  pickup: number;
  deposit?: any;
}

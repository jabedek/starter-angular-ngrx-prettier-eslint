export type SimpleProductsData = {
  slug: string;
  products: Record<string, SimpleProduct>;
};

export type SimpleProduct = {
  name: string;
  variants: SimpleVariant[];
};

type SimpleVariant = {
  id: string;
  name?: string;
  prices: Prices;
  metric: Metric;
  priceUnit?: any;
};

export interface Metric {
  unit?: any;
  quantity?: any;
}

export interface Prices {
  delivery: number;
  pickup: number;
  deposit?: any;
}

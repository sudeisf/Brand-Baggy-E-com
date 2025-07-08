// types/analytics.ts

export type GrowthType = "up" | "down" | "no change"

export interface ChartDataPoint {
  day: string
  value: number
}

export interface AnalyticsMetric {
  header: string
  amount: number
  discription: string 
  percentile: string
  growthType: GrowthType
  chartData: ChartDataPoint[]
}

export interface YearlyRevenue {
  month: string;
  revenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DailyRevenue {
  day: string;
  revenue: number;
}

export interface AnalyticsRevenueResponse {
  yearly: YearlyRevenue[];
  monthly: MonthlyRevenue[];
  daily: DailyRevenue[];
}

export interface SellerOrderActivity {
  order_id: string;
  customer: string;
  status: string;
  timestamp: string;
  exact_time: string;
}

export type SellerOrderActivityResponse = SellerOrderActivity[];

export interface SellerRecentOrder {
  id: number;
  product_image: string;
  product_name: string;
  payment_status: string;
  order_date: string;
  customer: {
    username: string;
    image: string;
  };
  price: string;
  sold: number;
  status: string;
}

export type SellerRecentOrderResponse = SellerRecentOrder[];

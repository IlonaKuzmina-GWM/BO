export interface StatisticsData {
  volume: Volume;
  rate: Rate;
  provider: ProviderStats[];
  geo: Geo;
  merchantStats: MerchantStat[];
}

export interface Volume {
  dailyStats: VolumeDailyStat[];
  totalVol: number;
  totalTransactionCount: number;
}

export interface VolumeDailyStat {
  date: string; 
  vol: number;
  transaction: number;
}

export interface Rate {
  dailyStats: RateDailyStat[];
  totalSuccess: number;
  totalDeclined: number;
  successPercentage: number;
}

export interface RateDailyStat {
  date: string; 
  success: number;
  declined: number;
}

export interface ProviderStats {
  provider: string;
  success: number;
  declined: number;
  successPercentage: number;
}

export interface Geo {
  countryStats: GeoCountryStat[];
}


export interface GeoCountryStat {
  countryCode: string;
  percentage: number;
}

export interface MerchantStat {
  merchantName: string;
  totalAmount: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  iconUrl?: string;
}

export interface PortfolioItem {
  id: string;
  token: Token;
  amount: number;
  value: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface FearAndGreedIndex {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

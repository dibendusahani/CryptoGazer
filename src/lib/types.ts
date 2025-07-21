export interface Token {
  id: string; // e.g., "bitcoin"
  rank: string; // e.g., "1"
  symbol: string; // e.g., "BTC"
  name: string; // e.g., "Bitcoin"
  supply: string; // e.g., "19..."
  maxSupply: string | null; // e.g., "21000000.0000000000000000" or null
  marketCapUsd: string; // e.g., "120..."
  volumeUsd24Hr: string; // e.g., "20..."
  priceUsd: string; // e.g., "60000.123..."
  changePercent24Hr: string; // e.g., "2.50..."
  vwap24Hr: string | null; // e.g., "60100.456..."
  explorer: string | null;
  iconUrl?: string; // To be constructed: `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`
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

// FearAndGreedIndex from alternative.me/fng/
export interface FearAndGreedIndexData {
  value: string; 
  value_classification: string; 
  timestamp: string; 
  time_until_update?: string; 
}

export interface FearAndGreedIndexResponse {
  name: string;
  data: FearAndGreedIndexData[];
  metadata: {
    error: string | null;
  };
}

// Global market data from alternative.me/v2/global/
export interface GlobalMarketData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: Record<string, number>; 
  total_volume_24h: Record<string, number>; 
  market_cap_percentage: Record<string, number>; 
  market_cap_change_percentage_24h_usd: number;
  updated_at: number; 
}

export interface GlobalMarketResponse {
    data: GlobalMarketData;
}

// Raw API response from alternative.me/v2/global/ (new structure)
export interface AlternativeMeGlobalResponse {
  data: {
    active_cryptocurrencies: number;
    active_markets: number;
    bitcoin_percentage_of_market_cap: number;
    quotes: {
      USD: {
        total_market_cap: number;
        total_volume_24h: number;
      }
    };
    last_updated: number;
  };
  metadata: {
    timestamp: number;
    error: string | null;
  };
}

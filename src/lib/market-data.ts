export type CoinCategory = "all" | "gain" | "loss";

export interface Coin {
  sym: string;
  name: string;
  price: number;
  ch: number;
  vol: number;
  categories: CoinCategory[];
}

export const INITIAL_COINS: Coin[] = [
  { sym: "BTC", name: "Bitcoin", price: 7382440, ch: 1.72, vol: 487, categories: ["all", "gain"] },
  { sym: "ETH", name: "Ethereum", price: 248560, ch: 1.25, vol: 312, categories: ["all", "gain"] },
  { sym: "SOL", name: "Solana", price: 10398, ch: -0.4, vol: 198, categories: ["all", "loss"] },
  { sym: "BNB", name: "BNB", price: 71930, ch: 0.63, vol: 142, categories: ["all", "gain"] },
  { sym: "XRP", name: "XRP", price: 156.4, ch: 0.74, vol: 89, categories: ["all", "gain"] },
  { sym: "AVAX", name: "Avalanche", price: 1049, ch: -0.56, vol: 56, categories: ["all", "loss"] },
  { sym: "DOGE", name: "Dogecoin", price: 10.04, ch: -0.02, vol: 67, categories: ["all", "loss"] },
  { sym: "UNI", name: "Uniswap", price: 498, ch: -0.92, vol: 34, categories: ["all", "loss"] },
  { sym: "AAVE", name: "Aave", price: 12576, ch: -0.2, vol: 28, categories: ["all", "loss"] },
  { sym: "LINK", name: "Chainlink", price: 1039, ch: 0.35, vol: 41, categories: ["all", "gain"] },
  { sym: "ADA", name: "Cardano", price: 29.3, ch: -1.65, vol: 38, categories: ["all", "loss"] },
  { sym: "MATIC", name: "Polygon", price: 8.4, ch: -2.37, vol: 21, categories: ["all", "loss"] }
];

export const BTC_INR = 7382440;

export const TICKER_COINS = [
  { sym: "BTC", price: 7382440, ch: 1.72 },
  { sym: "ETH", price: 248560, ch: 1.25 },
  { sym: "SOL", price: 10398, ch: -0.4 },
  { sym: "BNB", price: 71930, ch: 0.63 },
  { sym: "XRP", price: 156.4, ch: 0.74 },
  { sym: "DOGE", price: 10.04, ch: -0.02 },
  { sym: "AVAX", price: 1049, ch: -0.56 },
  { sym: "LINK", price: 1039, ch: 0.35 }
];

export const PACKS = {
  defi: { name: "DeFi Blue Chips", coins: ["UNI", "AAVE", "MKR", "COMP", "CRV", "LDO"], ret: 34.2, cagr: 28 },
  l1: { name: "Top L1s", coins: ["BTC", "ETH", "SOL", "AVAX", "BNB", "ADA", "DOT"], ret: 58.1, cagr: 42 },
  ai: { name: "AI & DePIN", coins: ["FET", "RNDR", "TAO", "AKT", "HNT"], ret: 89.4, cagr: 55 },
  meme: { name: "Meme Movers", coins: ["DOGE", "SHIB", "PEPE", "FLOKI", "BONK"], ret: 112, cagr: 65 }
} as const;

export type PackId = keyof typeof PACKS;

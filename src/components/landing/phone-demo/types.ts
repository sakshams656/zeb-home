export type DemoMode = "qt" | "cp" | "ft" | "sip" | "exchange" | "ai";

export type QtCoin = {
  sym: string;
  name: string;
  icon: string;
  grad: string;
  price: string;
  chg: string;
  dir: "up" | "down" | "flat";
};

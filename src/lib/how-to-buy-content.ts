import type { QtCoin } from "@/lib/zebpay-qtcoins-server";

export type BuyStep = {
  title: string;
  body: string;
  screenshotSrc: string;
  screenshotLabel: string;
};

export function getBuySteps(coin: QtCoin): BuyStep[] {
  const { symbol, name } = coin;
  return [
    {
      title: "Download the ZebPay app",
      body: "Install ZebPay from the App Store or Google Play on your phone. You can also sign up on the web.",
      screenshotSrc: "/how-to-buy/placeholders/step-1.svg",
      screenshotLabel: "Screenshot: Step 1 — Download app"
    },
    {
      title: "Sign up & complete KYC",
      body: "Create your account and finish identity verification so you can add INR and start trading securely.",
      screenshotSrc: "/how-to-buy/placeholders/step-2.svg",
      screenshotLabel: "Screenshot: Step 2 — KYC"
    },
    {
      title: "Add INR to your wallet",
      body: "Deposit Indian Rupees via UPI, bank transfer, or other supported methods available in the app.",
      screenshotSrc: "/how-to-buy/placeholders/step-3.svg",
      screenshotLabel: "Screenshot: Step 3 — Add funds"
    },
    {
      title: `Open Quick Trade and search ${symbol}`,
      body: `Go to Quick Trade, search for ${name} (${symbol}), and choose market or limit order based on how you want to buy.`,
      screenshotSrc: "/how-to-buy/placeholders/step-4.svg",
      screenshotLabel: `Screenshot: Step 4 — Search ${symbol}`
    },
    {
      title: "Confirm your buy order",
      body: `Review the order summary, fees, and amount. Confirm to execute your ${name} purchase in seconds.`,
      screenshotSrc: "/how-to-buy/placeholders/step-5.svg",
      screenshotLabel: "Screenshot: Step 5 — Confirm order"
    }
  ];
}

export type FaqItem = { q: string; a: string };

export function getCoinFaqs(coin: QtCoin): FaqItem[] {
  const { symbol, name, minimumTradeAmount, isSipEnabled } = coin;
  const minLabel =
    minimumTradeAmount >= 100
      ? `₹${minimumTradeAmount.toLocaleString("en-IN")}`
      : `₹${minimumTradeAmount}`;

  const faqs: FaqItem[] = [
    {
      q: `How to buy ${name} in India?`,
      a: `Download ZebPay, complete KYC, add INR to your wallet, open Quick Trade, search for ${symbol}, and confirm your buy order. ${name} will credit to your ZebPay wallet once the trade executes.`
    },
    {
      q: `How to buy ${name} on ZebPay?`,
      a: `On ZebPay, go to Quick Trade, select ${symbol}-INR, enter the amount you want to spend or the quantity of ${name} you want, choose market or limit order, and confirm.`
    },
    {
      q: `What is the minimum amount to buy ${name}?`,
      a: `The minimum trade amount for ${symbol}-INR on ZebPay is ${minLabel}. You can start small and add more over time.`
    },
    {
      q: `Is buying ${name} on ZebPay safe?`,
      a: `ZebPay has operated since 2014 with multi-stage security, cold storage for the majority of funds, and FIU-IND registration under India's PMLA framework.`
    },
    {
      q: `Can I invest ₹100 in ${name}?`,
      a:
        minimumTradeAmount <= 100
          ? `Yes. The minimum for ${symbol} is ${minLabel}, so you can start with as little as ₹100 if that meets the pair minimum.`
          : `The minimum trade amount for ${symbol} is ${minLabel}. Check the order screen in Quick Trade for the exact minimum before you confirm.`
    }
  ];

  if (isSipEnabled) {
    faqs.push({
      q: `Can I set up a SIP for ${name}?`,
      a: `Yes. ${name} supports Crypto SIP on ZebPay — invest daily, weekly, or monthly on autopilot without timing the market.`
    });
  } else {
    faqs.push({
      q: `Can I set up a SIP for ${name}?`,
      a: `SIP may not be available for ${symbol} at this time. You can still buy ${name} instantly via Quick Trade on ZebPay.`
    });
  }

  return faqs;
}

export const HUB_INTRO =
  "Getting started with crypto is simple when you follow the right steps. From creating an account to completing verification and adding funds, the process is designed to be user-friendly. With access to a wide range of digital assets, you can quickly buy and manage your crypto investments on ZebPay.";

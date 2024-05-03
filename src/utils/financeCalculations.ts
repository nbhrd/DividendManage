import { Asset, Dividend } from "../types";

export function financeCalculations(dividends: Dividend[]): Asset {
  return dividends.reduce(
    (acc, dividend) => {
      if (dividend.type === "japan") {
        acc.japan += dividend.amount;
      } else {
        acc.usa += dividend.amount;
      }
      acc.balance = acc.japan + acc.usa;
      return acc;
    },
    { japan: 0, usa: 0, balance: 0 }
  );
}

export function calculateDailyDividends(
  dividends: Dividend[]
): Record<string, Asset> {
  return dividends.reduce<Record<string, Asset>>((acc, dividend) => {
    const day = dividend.date;
    if (!acc[day]) {
      acc[day] = { japan: 0, usa: 0, balance: 0 };
    }

    if (dividend.type === "japan") {
      acc[day].japan += dividend.amount;
    } else if ("usa") {
      acc[day].usa += dividend.amount;
    }

    acc[day].balance = acc[day].japan + acc[day].usa;
    return acc;
  }, {});
}

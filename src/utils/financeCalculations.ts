import { Asset, Balance, Dividend, Transaction } from "../types";

// 削除確認
export function financeCalculations(transactions: Transaction[]): Balance {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

export function financeCalculationsDivi(dividends: Dividend[]): Asset {
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

// 日付毎の収支を計算
// 削除確認
export function calculateDailyBalances(
  transactions: Transaction[]
): Record<string, Balance> {
  return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
    const day = transaction.date;
    if (!acc[day]) {
      acc[day] = { income: 0, expense: 0, balance: 0 };
    }

    if (transaction.type === "income") {
      acc[day].income += transaction.amount;
    } else {
      acc[day].expense += transaction.amount;
    }

    acc[day].balance = acc[day].income - acc[day].expense;
    return acc;
  }, {});
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

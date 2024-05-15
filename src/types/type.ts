export type StockType = "japan" | "usa";

export type IncomeCategory = "給与" | "副収入" | "お小遣い";
export type ExpenseCategory =
  | "食費"
  | "日用品"
  | "住居費"
  | "交際費"
  | "娯楽"
  | "交通費";

export interface Dividend {
  id: string;
  stock_name: string;
  type: StockType;
  amount: number;
  date: string;
}

export interface Stock {
  id: string;
  type: StockType;
  code: string;
  name: string;
}

// 削除確認
export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export interface Asset {
  japan: number;
  usa: number;
  balance: number;
}

export interface CalendarContent {
  start: string;
  japan: string;
  usa: string;
  balance: string;
}

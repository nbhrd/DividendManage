export type TransactionType = "income" | "expense";
export type DividendType = "japan" | "usa";
export type JapanStock = "8901 - 積水ハウス" | "1605 - INPEX";
export type UsaStock = "VZ - ベライゾン" | "MMM - 3M";
export type IncomeCategory = "給与" | "副収入" | "お小遣い";
export type ExpenseCategory =
  | "食費"
  | "日用品"
  | "住居費"
  | "交際費"
  | "娯楽"
  | "交通費";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  content: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
}

export interface Dividend {
  id: string;
  stock_name: string;
  type: DividendType;
  amount: number;
  memo: string;
  date: string;
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

import React, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { formatMonth } from "../utils/formatting";
import { Transaction } from "../types";

const useMonthlyTransactions = (): Transaction[] => {
  const { transactions, currentMonth } = useAppContext();

  // ひと月分のデータのみ取得
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date.startsWith(formatMonth(currentMonth));
    });
  }, [transactions, currentMonth]);

  return monthlyTransactions;
};

export default useMonthlyTransactions;

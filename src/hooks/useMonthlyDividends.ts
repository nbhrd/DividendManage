import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { formatMonth } from "../utils/formatting";
import { Dividend } from "../types";

const useMonthlyDividends = (): Dividend[] => {
  const { dividends, currentMonth } = useAppContext();

  const monthlyDividends = useMemo(() => {
    return dividends.filter((dividend) => {
      return dividend.date.startsWith(formatMonth(currentMonth));
    });
  }, [dividends, currentMonth]);

  return monthlyDividends;
};

export default useMonthlyDividends;

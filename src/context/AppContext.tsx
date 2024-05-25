import { ReactNode, createContext, useContext, useState } from "react";
import { Dividend, Stock, StockType } from "../types/type";
import { useMediaQuery, useTheme } from "@mui/material";
import { DividendSchema } from "../validations/dividendSchema";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { isFireStoreError } from "../utils/errorHandling";

interface AppContextType {
  dividends: Dividend[];
  setDividends: React.Dispatch<React.SetStateAction<Dividend[]>>;
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  usdJpyRate: string;
  setUsdJpyRate: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveDividend: (dividend: DividendSchema) => Promise<void>;
  onDeleteDividend: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateDividend: (
    dividend: DividendSchema,
    dividendId: string
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [usdJpyRate, setUsdJpyRate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // 取引を保存する処理
  const onSaveDividend = async (dividend: DividendSchema) => {
    try {
      const docRef = await addDoc(collection(db, "Dividends"), {
        ...dividend,
      });

      const newDividend = {
        id: docRef.id,
        ...dividend,
      } as Dividend;

      setDividends((prevDividend) => [...prevDividend, newDividend]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラー:", err);
      } else {
        console.error("一般的なエラー:", err);
      }
    }
  };

  // 削除処理
  const onDeleteDividend = async (dividendIds: string | readonly string[]) => {
    try {
      const idsToDelete = Array.isArray(dividendIds)
        ? dividendIds
        : [dividendIds];
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "Dividends", id));
      }

      const filteredDividends = dividends.filter(
        (dividend) => !idsToDelete.includes(dividend.id)
      );
      setDividends(filteredDividends);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラー:", err);
      } else {
        console.error("一般的なエラー:", err);
      }
    }
  };

  // 更新処理
  const onUpdateDividend = async (
    dividend: DividendSchema,
    dividendId: string
  ) => {
    try {
      const docRef = doc(db, "Dividends", dividendId);
      await updateDoc(docRef, dividend);

      // フロント更新
      const updatedDividends = dividends.map((t) =>
        t.id === dividendId ? { ...t, ...dividend } : t
      ) as Dividend[];

      setDividends(updatedDividends);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラー:", err);
      } else {
        console.error("一般的なエラー:", err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        dividends,
        setDividends,
        stocks,
        setStocks,
        currentMonth,
        setCurrentMonth,
        usdJpyRate,
        setUsdJpyRate,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveDividend,
        onDeleteDividend,
        onUpdateDividend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("グローバルなデータはプロバイダーの中で取得してください");
  }
  return context;
};

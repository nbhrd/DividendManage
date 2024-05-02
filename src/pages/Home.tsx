import React, { useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import DividendMenu from "../components/DividendMenu";
import DividendForm from "../components/DividendForm";
import { Dividend } from "../types";
import { format } from "date-fns";
import { DateClickArg } from "@fullcalendar/interaction";
import { useAppContext } from "../context/AppContext";
// 削除確認
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";
import useMonthlyDividends from "../hooks/useMonthlyDividends";

interface HomeProps {
  // monthlyTransactions: Transaction[];
  // setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  // onSaveTransaction: (transaction: Schema) => Promise<void>;
  // onDeleteTransaction: (
  //   transactionId: string | readonly string[]
  // ) => Promise<void>;
  // onUpdateTransaction: (
  //   transaction: Schema,
  //   transactionId: string
  // ) => Promise<void>;
}

const Home = ({}: // monthlyTransactions,
// setCurrentMonth,
// onSaveTransaction,
// onDeleteTransaction,
// onUpdateTransaction,
HomeProps) => {
  const { isMobile } = useAppContext();
  // const monthlyTransactions = useMonthlyTransactions();
  const monthlyDividends = useMonthlyDividends();
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedDividend, setSelectedDividend] = useState<Dividend | null>(
    null
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dailyDividends = useMemo(() => {
    return monthlyDividends.filter((dividend) => {
      return dividend.date === currentDay;
    });
  }, [monthlyDividends, currentDay]);

  const closeForm = () => {
    setSelectedDividend(null);

    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  // フォームの開閉処理(内訳追加ボタン押下)
  const handleAddDividendForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedDividend) {
        setSelectedDividend(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  };

  // 取引が選択された時の処理
  const handleSelectDividend = (dividend: Dividend) => {
    setSelectedDividend(dividend);
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  };

  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calendar
          today={today}
          currentDay={currentDay}
          setCurrentDay={setCurrentDay}
          onDateClick={handleDateClick}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <DividendMenu
          dailyDividends={dailyDividends}
          currentDay={currentDay}
          onAddDividendForm={handleAddDividendForm}
          onSelectDividend={handleSelectDividend}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <DividendForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          selectedDividend={selectedDividend}
          setSelectedDividend={setSelectedDividend}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { Asset, Balance, CalendarContent, Transaction } from "../types";
import {
  calculateDailyBalances,
  calculateDailyDividends,
} from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import { useAppContext } from "../context/AppContext";
import useMonthlyDividends from "../hooks/useMonthlyDividends";

interface CalendarProps {
  today: string;
  currentDay: string;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  onDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  today,
  currentDay,
  setCurrentDay,
  onDateClick,
}: CalendarProps) => {
  const theme = useTheme();

  const monthlyDivedends = useMonthlyDividends();
  const { setCurrentMonth } = useAppContext();

  const dailyBalances = calculateDailyDividends(monthlyDivedends);
  const createCalendarEvents = (
    dailyBalances: Record<string, Asset>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { japan, usa, balance } = dailyBalances[date];
      return {
        start: date,
        japan: formatCurrency(japan),
        usa: formatCurrency(usa),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-japan">
          {eventInfo.event.extendedProps.japan}
        </div>
        <div className="money" id="event-usa">
          {eventInfo.event.extendedProps.usa}
        </div>
        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  );
};

export default Calendar;

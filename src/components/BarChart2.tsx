import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { calculateDailyDividends } from "../utils/financeCalculations";
import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppContext } from "../context/AppContext";
import { Dividend } from "../types/type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart2 = () => {
  const { isLoading, dividends, usdJpyRate } = useAppContext();

  const aggregateDataByMonthAndType = (data: Dividend[]) => {
    const result: { [key: string]: { [key: string]: number } } = {};

    data.forEach((item) => {
      const date = new Date(item.date);
      const yearMonth = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}`;

      if (!result[yearMonth]) {
        result[yearMonth] = { usa: 0, japan: 0 };
      }
      result[yearMonth][item.type] += parseFloat(item.amount);
    });

    const months = Object.keys(result).sort();
    let usaAmounts: number[] = [];
    if (usdJpyRate) {
      usaAmounts = months.map((month) => {
        let amount = result[month].usa;
        amount *= parseInt(usdJpyRate);
        return amount;
      });
    }

    const japanAmounts = months.map((month) => result[month].japan);

    return { months, usaAmounts, japanAmounts };
  };

  const { months, usaAmounts, japanAmounts } =
    aggregateDataByMonthAndType(dividends);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "USA",
        data: usaAmounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Japan",
        data: japanAmounts,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "月別配当収益",
      },
    },
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : dividends.length > 0 ? (
        <Bar options={chartOptions} data={chartData} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart2;

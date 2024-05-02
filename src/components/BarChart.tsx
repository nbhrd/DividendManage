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
import useMonthlyDividends from "../hooks/useMonthlyDividends";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const { isLoading } = useAppContext();

  const monthlyDividends = useMonthlyDividends();
  const theme = useTheme();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top" as const,
      // },
      title: {
        display: true,
        text: "日別配当",
      },
    },
  };

  const dailyDividends = calculateDailyDividends(monthlyDividends);

  const dateLabels = Object.keys(dailyDividends).sort();
  const japanData = dateLabels.map((day) => dailyDividends[day].japan);
  const usaData = dateLabels.map((day) => dailyDividends[day].usa);

  const data: ChartData<"bar"> = {
    labels: dateLabels,
    datasets: [
      {
        label: "日本株",
        data: japanData,
        backgroundColor: theme.palette.incomeColor.light,
      },
      {
        label: "米国株",
        data: usaData,
        backgroundColor: theme.palette.expenseColor.light,
      },
    ],
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
      ) : monthlyDividends.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;

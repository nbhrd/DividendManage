import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { DividendType } from "../types";
import { useAppContext } from "../context/AppContext";

import useMonthlyDividends from "../hooks/useMonthlyDividends";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const { isLoading } = useAppContext();
  const monthlyDividends = useMonthlyDividends();
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<DividendType>("japan");

  const handleChange = (e: SelectChangeEvent<DividendType>) => {
    setSelectedType(e.target.value as DividendType);
  };

  const categorySums = monthlyDividends
    .filter((dividend) => dividend.type === selectedType)
    .reduce<Record<string, number>>((acc, dividend) => {
      if (!acc[dividend.stock_name]) {
        acc[dividend.stock_name] = 0;
      }
      acc[dividend.stock_name] += dividend.amount;
      return acc;
    }, {} as Record<string, number>);

  const dividendLabels = Object.keys(categorySums) as string[];
  const categoryValues = Object.values(categorySums);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const japanStockColor: Record<string, string> = {
    "8901 - 積水ハウス": theme.palette.incomeCategoryColor.給与,
    "1605 - INPEX": theme.palette.incomeCategoryColor.副収入,
  };

  const usaStockColor: Record<string, string> = {
    "VZ - ベライゾン": theme.palette.expenseCategoryColor.食費,
    "MMM - 3M": theme.palette.expenseCategoryColor.日用品,
  };

  const getDividendColor = (dividend: string): string => {
    if (selectedType === "japan") {
      return japanStockColor[dividend];
    } else {
      return usaStockColor[dividend];
    }
  };

  const data: ChartData<"pie"> = {
    labels: dividendLabels,
    datasets: [
      {
        data: categoryValues,
        // backgroundColor: [
        //   "rgba(255, 99, 132, 0.2)",
        //   "rgba(54, 162, 235, 0.2)",
        //   "rgba(255, 206, 86, 0.2)",
        //   "rgba(75, 192, 192, 0.2)",
        //   "rgba(153, 102, 255, 0.2)",
        //   "rgba(255, 159, 64, 0.2)",
        // ],
        backgroundColor: dividendLabels.map((dividend) => {
          return getDividendColor(dividend);
        }),
        borderColor: dividendLabels.map((dividend) => {
          return getDividendColor(dividend);
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          label="収支の種類"
          value={selectedType}
          onChange={handleChange}
        >
          <MenuItem value={"japan"}>日本株</MenuItem>
          <MenuItem value={"usa"}>米国株</MenuItem>
        </Select>
      </FormControl>

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
          <Pie data={data} options={options} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;

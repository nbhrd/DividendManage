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
import { StockType } from "../types/type";
import { useAppContext } from "../context/AppContext";
import useMonthlyDividends from "../hooks/useMonthlyDividends";
import { getChartColors } from "../utils/getChartColors";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { isLoading } = useAppContext();
  const monthlyDividends = useMonthlyDividends();
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<StockType>("japan");

  const handleChange = (e: SelectChangeEvent<StockType>) => {
    setSelectedType(e.target.value as StockType);
  };

  const categorySums = monthlyDividends
    .filter((dividend) => dividend.type === selectedType)
    .reduce<Record<string, number>>((acc, dividend) => {
      if (!acc[dividend.stock_name]) {
        acc[dividend.stock_name] = 0;
      }
      acc[dividend.stock_name] += parseFloat(dividend.amount);
      return acc;
    }, {} as Record<string, number>);

  const dividendLabels = Object.keys(categorySums) as string[];
  const categoryValues = Object.values(categorySums);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const { backgroundColorData, borderColorData } = getChartColors(
    dividendLabels.length,
    selectedType
  );

  const data: ChartData<"pie"> = {
    labels: dividendLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: backgroundColorData,
        borderColor: borderColorData,
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

export default PieChart;

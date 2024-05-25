import { Grid, Paper } from "@mui/material";
import MonthSelector from "../components/MonthSelector";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import DividendTable from "../components/DividendTable";

const Report = () => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MonthSelector />
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={commonPaperStyle}>
          <PieChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={commonPaperStyle}>
          <BarChart />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <DividendTable />
      </Grid>
    </Grid>
  );
};

export default Report;

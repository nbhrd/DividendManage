import { Grid, Paper } from "@mui/material";
import MonthSelector from "../components/MonthSelector";
import PieChart from "../components/PieChart";
import BarChart2 from "../components/BarChart2";
import DividendTable2 from "../components/DividendTable2";

const Report2 = () => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Paper>
          <BarChart2 />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <DividendTable2 />
      </Grid>
    </Grid>
  );
};

export default Report2;

import { Grid } from "@mui/material";

import StocksTable from "../components/StocksTable";
import StockForm from "../components/StockForm";
import { useState } from "react";

const Stocks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StocksTable
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
        <StockForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Grid>
    </Grid>
  );
};

export default Stocks;

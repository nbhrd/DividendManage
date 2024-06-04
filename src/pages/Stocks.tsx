import { Grid } from "@mui/material";

import StocksTable from "../components/StocksTable";
import StockForm from "../components/StockForm";
import { useState } from "react";
import { Stock } from "../types/type";

const Stocks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StocksTable
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          setSelectedStock={setSelectedStock}
        />
        <StockForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedStock={selectedStock}
        />
      </Grid>
    </Grid>
  );
};

export default Stocks;

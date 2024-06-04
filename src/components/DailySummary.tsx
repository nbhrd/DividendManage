import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { Dividend } from "../types/type";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface DailySummaryProps {
  dailyDividends: Dividend[];
  columns: number;
}

const DailySummary = ({ dailyDividends, columns }: DailySummaryProps) => {
  const { japan, usa, balance } = financeCalculations(dailyDividends);
  const isThreeColumnsLayout = columns === 3;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={isThreeColumnsLayout ? 4 : 6} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                日本株
              </Typography>
              <Typography
                color={(theme) => theme.palette.incomeColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(japan)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 支出 */}
        <Grid item xs={isThreeColumnsLayout ? 4 : 6} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                米国株
              </Typography>
              <Typography
                color={(theme) => theme.palette.expenseColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(usa)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 合計 */}
        <Grid item xs={isThreeColumnsLayout ? 4 : 12} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                合計
              </Typography>
              <Typography
                color={(theme) => theme.palette.balanceColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DailySummary;

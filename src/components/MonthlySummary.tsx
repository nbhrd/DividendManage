import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  financeCalculations,
  financeCalculationsDivi,
} from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";
import useMonthlyDividends from "../hooks/useMonthlyDividends";

const MonthlySummary = () => {
  const monthlyDividends = useMonthlyDividends();
  const { japan, usa, balance } = financeCalculationsDivi(monthlyDividends);

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 収入 */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <TripOriginIcon sx={{ fontSize: "2rem" }} />
              <Typography>日本株</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(japan)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 支出 */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <PublicIcon sx={{ fontSize: "2rem" }} />
              <Typography>米国株</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(usa)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 残高 */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
              <Typography>合計</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MonthlySummary;

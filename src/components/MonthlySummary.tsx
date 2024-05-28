import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency, formatMonth } from "../utils/formatting";

import useMonthlyDividends from "../hooks/useMonthlyDividends";
import { useAppContext } from "../context/AppContext";
import { format } from "date-fns";

const MonthlySummary = () => {
  const monthlyDividends = useMonthlyDividends();
  const { currentMonth, usdJpyRate } = useAppContext();
  const { japan, usa, balance } = financeCalculations(monthlyDividends);

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {`${format(currentMonth, "M")}月合計`}
      </Typography>
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
                ${usa}
                {usdJpyRate ? (
                  <div>¥{(usa * parseInt(usdJpyRate)).toFixed(2)}</div>
                ) : (
                  ""
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 合計 */}
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
                {usdJpyRate ? (
                  <div>¥{usa * parseInt(usdJpyRate) + japan}</div>
                ) : (
                  ""
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default MonthlySummary;

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySummary";
import { Dividend } from "../types/type";
import { formatCurrency } from "../utils/formatting";
import { useAppContext } from "../context/AppContext";

interface DividendMenuProps {
  dailyDividends: Dividend[];
  currentDay: string;
  onAddDividendForm: () => void;
  onSelectDividend: (dividend: Dividend) => void;
  open: boolean;
  onClose: () => void;
}

const DividendMenu = ({
  dailyDividends,
  currentDay,
  onAddDividendForm,
  onSelectDividend,
  open,
  onClose,
}: DividendMenuProps) => {
  const menuDrawerWidth = 320;
  const { isMobile } = useAppContext();

  return (
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,

          ...(isMobile && {
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        <Typography fontWeight={"fontWeightBold"}>
          日時： {currentDay}
        </Typography>
        <DailySummary
          dailyDividends={dailyDividends}
          columns={isMobile ? 3 : 2}
        />
        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          <Button
            onClick={onAddDividendForm}
            startIcon={<AddCircleIcon />}
            color="primary"
          >
            内訳を追加
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {dailyDividends.map((dividend, index) => (
                <ListItem key={index} disablePadding>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor:
                        dividend.type === "japan"
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectDividend(dividend)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          wrap="wrap"
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {dividend.stock_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              gutterBottom
                              textAlign={"right"}
                              color="text.secondary"
                              sx={{
                                wordBreak: "break-all",
                              }}
                            >
                              {dividend.type === "japan" ? "¥" : "$"}
                              {formatCurrency(parseFloat(dividend.amount))}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default DividendMenu;

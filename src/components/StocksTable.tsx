import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, ButtonGroup, Grid } from "@mui/material";
import { compareAsc, parseISO } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../context/AuthContext";
import { Stock, StockType } from "../types/type";
import { isFireStoreError } from "../utils/errorHandling";
import { useAppContext } from "../context/AppContext";

function DividendTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell align={"left"}>コード</TableCell>
        <TableCell align={"left"}>銘柄名</TableCell>
        <TableCell align={"left"}></TableCell>
      </TableRow>
    </TableHead>
  );
}

interface StocksTableProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedStock: React.Dispatch<React.SetStateAction<Stock | null>>;
}

export default function StocksTable({
  isDialogOpen,
  setIsDialogOpen,
  setSelectedStock,
}: StocksTableProps) {
  const [stockType, setStockType] = React.useState<StockType | "all">("all");

  const { user } = useAuthContext();
  const { stocks, setStocks } = useAppContext();

  const [visibleRows, setVisibleRows] = React.useState<Stock[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const onAddStock = () => {
    setIsDialogOpen(true);
  };

  const onUpdateStock = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  const onDeleteStock = async (id: string) => {
    const confirmDelete = window.confirm("この銘柄を削除しますか？");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "Stocks", id));
        const filteredStocks = stocks.filter((stock) => id !== stock.id);
        setStocks(filteredStocks);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラー:", err);
        } else {
          console.error("一般的なエラー:", err);
        }
      }
    }
  };

  const changeStockType = (selectedStockType: StockType | "all") => {
    if (selectedStockType === "japan") {
      setStockType("japan");
    } else if (selectedStockType === "usa") {
      setStockType("usa");
    } else {
      setStockType("all");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    let selectedStocks = stocks;
    if (stockType !== "all") {
      selectedStocks = stocks.filter((stock) => {
        return stock.type === stockType;
      });
    }

    const sortedStocks = [...selectedStocks].sort((a, b) =>
      compareAsc(parseISO(a.code), parseISO(b.code))
    );

    const slicedStocks = sortedStocks.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    if (!arraysEqual(visibleRows, slicedStocks)) {
      setVisibleRows(slicedStocks);
    }
  }, [page, rowsPerPage, stocks, stockType, visibleRows]);

  const arraysEqual = (a: Stock[], b: Stock[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stocks.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pl: 0,
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography variant="h6" component="div">
            銘柄一覧
          </Typography>
          <ButtonGroup size="medium" sx={{ marginLeft: "10px" }}>
            <Button
              variant={stockType === "all" ? "contained" : "outlined"}
              color="success"
              onClick={() => changeStockType("all")}
              sx={{
                writingMode: "horizontal-tb",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              全て
            </Button>
            <Button
              variant={stockType === "japan" ? "contained" : "outlined"}
              color="primary"
              onClick={() => changeStockType("japan")}
              sx={{
                writingMode: "horizontal-tb",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              日本株
            </Button>
            <Button
              variant={stockType === "usa" ? "contained" : "outlined"}
              color="error"
              onClick={() => changeStockType("usa")}
              sx={{
                writingMode: "horizontal-tb",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              米国株
            </Button>
          </ButtonGroup>
          <Button
            onClick={onAddStock}
            startIcon={<AddCircleIcon />}
            color="primary"
            sx={{
              marginLeft: "auto",
            }}
          >
            追加
          </Button>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <DividendTableHead />
            <TableBody>
              {visibleRows.map((stock, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={stock.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" id={labelId} scope="row">
                      {stock.code}
                    </TableCell>
                    <TableCell align="left">{stock.name}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => onUpdateStock(stock)}>編集</Button>
                      <Button onClick={() => onDeleteStock(stock.id)}>
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={stocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

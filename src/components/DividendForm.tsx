import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dividend, JapanStock, UsaStock } from "../types";
import { DividendSchema, dividendSchema } from "../validations/schema";
import { useAppContext } from "../context/AppContext";
import { useAuthContext } from "../context/AuthContext";

interface DividendFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  selectedDividend: Dividend | null;
  setSelectedDividend: React.Dispatch<React.SetStateAction<Dividend | null>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type JapanUsa = "japan" | "usa";

interface StockItem {
  label: JapanStock | UsaStock;
}

const DividendForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedDividend,
  setSelectedDividend,
  isDialogOpen,
  setIsDialogOpen,
}: DividendFormProps) => {
  const { user } = useAuthContext();

  const formWidth = 320;
  const { onSaveDividend, onDeleteDividend, onUpdateDividend, isMobile } =
    useAppContext();

  const japanStocks: StockItem[] = [
    { label: "8901 - 積水ハウス" },
    { label: "1605 - INPEX" },
  ];

  const usaStocks: StockItem[] = [
    { label: "VZ - ベライゾン" },
    { label: "MMM - 3M" },
  ];

  const [stocks, setStocks] = useState(japanStocks);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm<DividendSchema>({
    defaultValues: {
      uid: user?.uid,
      type: "japan",
      stock_name: "",
      date: currentDay,
      amount: 0,
      memo: "",
    },
    resolver: zodResolver(dividendSchema),
  });

  const japanUsaToggle = (type: JapanUsa) => {
    setValue("type", type);
    setValue("stock_name", "");
  };

  // 収支タイプを監視
  const currentType = watch("type");

  useEffect(() => {
    const newStocks = currentType === "japan" ? japanStocks : usaStocks;
    setStocks(newStocks);
  }, [currentType]);

  // 収支タイプに応じたカテゴリを取得
  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay]);

  // 送信処理
  const onSubmit: SubmitHandler<DividendSchema> = (data) => {
    if (selectedDividend) {
      onUpdateDividend(data, selectedDividend.id)
        .then(() => {
          setSelectedDividend(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      onSaveDividend(data)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }

    reset({
      type: "japan",
      date: currentDay,
      amount: 0,
      stock_name: "",
      memo: "",
    });
  };

  useEffect(() => {
    // 選択肢が更新されたか確認
    if (selectedDividend) {
      const stockExists = stocks.some(
        (stock) => stock.label === selectedDividend.stock_name
      );
      setValue("stock_name", stockExists ? selectedDividend.stock_name : "");
    }
  }, [selectedDividend, stocks]);

  // フォーム内容を更新
  useEffect(() => {
    if (selectedDividend) {
      setValue("type", selectedDividend.type);
      setValue("date", selectedDividend.date);
      setValue("amount", selectedDividend.amount);
      setValue("stock_name", selectedDividend.stock_name);
      setValue("memo", selectedDividend.memo);
    } else {
      reset({
        type: "japan",
        date: currentDay,
        amount: 0,
        stock_name: "",
        memo: "",
      });
    }
  }, [selectedDividend]);

  const handleDelete = () => {
    if (selectedDividend) {
      onDeleteDividend(selectedDividend.id);
      setSelectedDividend(null);
      if (isMobile) {
        setIsDialogOpen(false);
      }
    }
  };

  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {/* UID */}
        <input type="hidden" {...register("uid", { value: user?.uid })} />

        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={field.value === "japan" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => japanUsaToggle("japan")}
                  >
                    日本株
                  </Button>
                  <Button
                    variant={field.value === "usa" ? "contained" : "outlined"}
                    color="error"
                    onClick={() => japanUsaToggle("usa")}
                  >
                    米国株
                  </Button>
                </ButtonGroup>
              );
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />

          {/* カテゴリ */}
          <Controller
            name="stock_name"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.stock_name}>
                <InputLabel id="category-select-label">銘柄名</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="category-select"
                  label="銘柄名"
                >
                  {stocks.map((stock, index) => (
                    <MenuItem key={index} value={stock.label}>
                      {stock.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.stock_name?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10) || 0;
                    field.onChange(newValue);
                  }}
                  label="金額"
                  type="number"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              );
            }}
          />

          {/* 内容 */}
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="メモ"
                type="text"
                error={!!errors.memo}
                helperText={errors.memo?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color={currentType === "japan" ? "primary" : "error"}
            fullWidth
          >
            {selectedDividend ? "更新" : "保存"}
          </Button>
          {selectedDividend && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color={"secondary"}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        // mobile
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth={"sm"}
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        // PC
        <Box
          sx={{
            position: "fixed",
            top: 64,
            right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
            width: formWidth,
            height: "100%",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create("right", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 15px -5px #777777",
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
};
export default DividendForm;

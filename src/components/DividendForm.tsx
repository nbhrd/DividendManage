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
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dividend, Stock, StockType } from "../types/type";
import { DividendSchema, dividendSchema } from "../validations/dividendSchema";
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
  const {
    stocks,
    onSaveDividend,
    onDeleteDividend,
    onUpdateDividend,
    isMobile,
  } = useAppContext();

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
      user_id: user?.uid,
      type: "japan",
      stock_name: "",
      date: currentDay,
      amount: "",
    },
    resolver: zodResolver(dividendSchema),
  });

  const japanUsaToggle = (type: StockType) => {
    setValue("type", type);
    setValue("stock_name", "");
  };

  const currentType = watch("type");

  let currentStocks: Stock[] = stocks
    .filter((stock) => stock.type === currentType)
    .sort((a, b) => a.code.localeCompare(b.code));

  useEffect(() => {
    currentStocks = stocks
      .filter((stock) => stock.type === currentType)
      .sort((a, b) => a.code.localeCompare(b.code));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType]);

  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay, setValue]);

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
      amount: "",
      stock_name: "",
    });
  };

  useEffect(() => {
    // 選択肢が更新されたか確認
    if (selectedDividend) {
      const stockExists = stocks.some(
        (stock) => stock.name === selectedDividend.stock_name
      );
      setValue("stock_name", stockExists ? selectedDividend.stock_name : "");
    }
  }, [selectedDividend, stocks, setValue]);

  // フォーム内容を更新
  useEffect(() => {
    if (selectedDividend) {
      setValue("type", selectedDividend.type);
      setValue("date", selectedDividend.date);
      setValue("amount", selectedDividend.amount);
      setValue("stock_name", selectedDividend.stock_name);
    } else {
      reset({
        type: "japan",
        date: currentDay,
        amount: "",
        stock_name: "",
      });
    }
  }, [selectedDividend, currentDay, setValue, reset]);

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
        {/* USERID */}
        <input type="hidden" {...register("user_id", { value: user?.uid })} />

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
                  {currentStocks.map((stock, index) => (
                    <MenuItem key={index} value={stock.name}>
                      {stock.code} {stock.name}
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
                  value={field.value === "" ? "" : field.value}
                  label="金額"
                  type="text"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              );
            }}
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

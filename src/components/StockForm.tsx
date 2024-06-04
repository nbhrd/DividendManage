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
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StockSchema, stockSchema } from "../validations/stockSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../context/AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Stock, StockType } from "../types/type";
import { isFireStoreError } from "../utils/errorHandling";
import { useAppContext } from "../context/AppContext";

interface StockFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStock: Stock | null;
}

const StockForm = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedStock,
}: StockFormProps) => {
  const { user } = useAuthContext();
  const { stocks, setStocks } = useAppContext();

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm<StockSchema>({
    defaultValues: {
      user_id: user?.uid,
      code: "",
      name: "",
      type: "japan",
    },
    resolver: zodResolver(stockSchema),
  });

  const japanUsaToggle = (type: StockType) => {
    setValue("type", type);
    setValue("name", "");
  };

  const onCloseForm = () => {
    setIsDialogOpen(false);
  };

  const onSubmit: SubmitHandler<StockSchema> = async (data) => {
    setIsDialogOpen(false);
    if (selectedStock) {
      try {
        const docRef = doc(db, "Stocks", selectedStock.id);
        await updateDoc(docRef, data);
        // フロント更新
        const updatedStocks = stocks.map((t) =>
          t.id === selectedStock.id ? { ...t, ...data } : t
        ) as Stock[];
        setStocks(updatedStocks);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラー:", err);
        } else {
          console.error("一般的なエラー:", err);
        }
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "Stocks"), {
          ...data,
        });

        const newStock = {
          id: docRef.id,
          ...data,
        };

        setStocks((preStocks) => [...preStocks, newStock]);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラー:", err);
        } else {
          console.error("一般的なエラー:", err);
        }
      }
    }

    reset({
      code: "",
      name: "",
      type: "japan",
    });
  };

  // フォーム内容を更新
  useEffect(() => {
    if (selectedStock) {
      setValue("type", selectedStock.type);
      setValue("code", selectedStock.code);
      setValue("name", selectedStock.name);
    } else {
      reset({
        type: "japan",
        code: "",
        name: "",
      });
    }
  }, [selectedStock, setValue, reset]);

  return (
    <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"}>
      <DialogContent>
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

          {/* 銘柄タイプ */}
          <Stack spacing={2}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => {
                return (
                  <ButtonGroup fullWidth>
                    <Button
                      variant={
                        field.value === "japan" ? "contained" : "outlined"
                      }
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

            {/* 銘柄コード */}
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="コード"
                  type="text"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                />
              )}
            />

            {/* 銘柄名 */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="名前"
                  type="text"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color={
                selectedStock && selectedStock.type === "japan"
                  ? "primary"
                  : "error"
              }
            >
              {selectedStock ? "更新" : "登録"}
            </Button>
            <Button onClick={onCloseForm} variant="outlined" fullWidth>
              キャンセル
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StockForm;

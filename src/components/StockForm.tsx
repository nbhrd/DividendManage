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
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StockSchema, stockSchema } from "../validations/stockSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Stock } from "../types/type";
import { isFireStoreError } from "../utils/errorHandling";
import { useAppContext } from "../context/AppContext";

interface StockFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StockForm = ({ isDialogOpen, setIsDialogOpen }: StockFormProps) => {
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

  const onCloseForm = () => {
    setIsDialogOpen(false);
  };

  const onSubmit: SubmitHandler<StockSchema> = async (data) => {
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

    setIsDialogOpen(false);

    reset({
      code: "",
      name: "",
      type: "japan",
    });
  };

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

          <Stack spacing={2}>
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

            {/* 銘柄タイプ */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel id="category-select-label">タイプ</InputLabel>
                  <Select
                    {...field}
                    labelId="category-select-label"
                    id="category-select"
                    label="銘柄名"
                  >
                    <MenuItem key="japan" value="japan">
                      日本株
                    </MenuItem>
                    <MenuItem key="usa" value="usa">
                      米国株
                    </MenuItem>
                  </Select>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Button type="submit" variant="contained" fullWidth>
              登録
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

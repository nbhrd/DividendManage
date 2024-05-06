import { z } from "zod";

export const dividendSchema = z.object({
  user_id: z.string(),
  type: z.enum(["japan", "usa"]),
  stock_name: z
    .union([z.string(), z.literal("")])
    .refine((val) => val !== "", { message: "銘柄名を入力してください" }),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  memo: z
    .string()
    .min(1, { message: "メモを入力してください" })
    .max(50, { message: "メモは50文字以内にしてください" }),
});

export type DividendSchema = z.infer<typeof dividendSchema>;

import { z } from "zod";

export const dividendSchema = z.object({
  user_id: z.string(),
  type: z.enum(["japan", "usa"]),
  stock_name: z
    .union([z.string(), z.literal("")])
    .refine((val) => val !== "", { message: "銘柄を選択してください" }),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.string().min(1, { message: "金額は必須です" }),
});

export type DividendSchema = z.infer<typeof dividendSchema>;

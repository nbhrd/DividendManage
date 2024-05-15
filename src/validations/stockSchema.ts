import { z } from "zod";

export const stockSchema = z.object({
  user_id: z.string(),
  code: z.string().min(1, { message: "銘柄コードは必須です" }),
  name: z.string().min(1, { message: "銘柄名は必須です" }),
  type: z.enum(["japan", "usa"]),
});

export type StockSchema = z.infer<typeof stockSchema>;

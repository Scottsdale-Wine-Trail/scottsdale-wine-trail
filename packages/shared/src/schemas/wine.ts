import { z } from "zod";

export const WineSchema = z.object({
  id: z.string().uuid(),
  winery_id: z.string().uuid(),
  name: z.string().min(1),
  varietal: z.string(),
  price: z.number().nonnegative().nullable(),
  available: z.boolean(),
});

export type Wine = z.infer<typeof WineSchema>;

export const WineInsertSchema = WineSchema.omit({ id: true });
export type WineInsert = z.infer<typeof WineInsertSchema>;

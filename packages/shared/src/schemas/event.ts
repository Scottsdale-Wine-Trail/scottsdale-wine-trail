import { z } from "zod";

export const EventSchema = z.object({
  id: z.string().uuid(),
  winery_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().nullable(),
  type: z.enum(["educational", "festival", "tasting", "tour", "other"]),
});

export type WineryEvent = z.infer<typeof EventSchema>;

export const EventInsertSchema = EventSchema.omit({ id: true });
export type EventInsert = z.infer<typeof EventInsertSchema>;

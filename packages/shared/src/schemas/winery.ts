import { z } from "zod";

export const WinerySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  description: z.string(),
  hero_image_url: z.string().url().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  website: z.string().url().nullable(),
  hours_json: z.record(z.string(), z.string()).nullable(),
  tags: z.array(z.string()),
  created_at: z.string().datetime(),
});

export type Winery = z.infer<typeof WinerySchema>;

export const WineryInsertSchema = WinerySchema.omit({
  id: true,
  created_at: true,
});

export type WineryInsert = z.infer<typeof WineryInsertSchema>;

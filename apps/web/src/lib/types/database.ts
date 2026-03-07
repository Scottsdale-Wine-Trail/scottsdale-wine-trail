export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      wineries: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          lat: number | null;
          lng: number | null;
          description: string;
          hero_image_url: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          hours_json: Json | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          lat?: number | null;
          lng?: number | null;
          description?: string;
          hero_image_url?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          hours_json?: Json | null;
          tags?: string[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wineries"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          winery_id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string | null;
          type: "educational" | "festival" | "tasting" | "tour" | "other";
        };
        Insert: {
          id?: string;
          winery_id: string;
          title: string;
          description?: string;
          start_date: string;
          end_date?: string | null;
          type?: "educational" | "festival" | "tasting" | "tour" | "other";
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      wines: {
        Row: {
          id: string;
          winery_id: string;
          name: string;
          varietal: string;
          price: number | null;
          available: boolean;
        };
        Insert: {
          id?: string;
          winery_id: string;
          name: string;
          varietal?: string;
          price?: number | null;
          available?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["wines"]["Insert"]>;
      };
    };
  };
};

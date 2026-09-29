export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["listing_kind"]
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["listing_kind"]
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["listing_kind"]
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          listing_id: string | null
          message: string | null
          name: string
          phone: string
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          listing_id?: string | null
          message?: string | null
          name: string
          phone: string
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          listing_id?: string | null
          message?: string | null
          name?: string
          phone?: string
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_photos: {
        Row: {
          created_at: string
          id: string
          is_cover: boolean
          listing_id: string
          sort_order: number
          storage_path: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_cover?: boolean
          listing_id: string
          sort_order?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_cover?: boolean
          listing_id?: string
          sort_order?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address_note: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          featured: boolean
          id: string
          kind: Database["public"]["Enums"]["listing_kind"]
          location_id: string | null
          price: number | null
          price_on_request: boolean
          published: boolean
          purpose: Database["public"]["Enums"]["listing_purpose"]
          reference: string
          slug: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          address_note?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          kind: Database["public"]["Enums"]["listing_kind"]
          location_id?: string | null
          price?: number | null
          price_on_request?: boolean
          published?: boolean
          purpose?: Database["public"]["Enums"]["listing_purpose"]
          reference: string
          slug: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          address_note?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          kind?: Database["public"]["Enums"]["listing_kind"]
          location_id?: string | null
          price?: number | null
          price_on_request?: boolean
          published?: boolean
          purpose?: Database["public"]["Enums"]["listing_purpose"]
          reference?: string
          slug?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          id: string
          municipality: string | null
          province: string
        }
        Insert: {
          created_at?: string
          id?: string
          municipality?: string | null
          province: string
        }
        Update: {
          created_at?: string
          id?: string
          municipality?: string | null
          province?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_details: {
        Row: {
          area_sqm: number | null
          bathrooms: number | null
          bedrooms: number | null
          condition: string | null
          condominium: boolean
          floor: string | null
          has_garage: boolean
          listing_id: string
        }
        Insert: {
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          condominium?: boolean
          floor?: string | null
          has_garage?: boolean
          listing_id: string
        }
        Update: {
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          condominium?: boolean
          floor?: string | null
          has_garage?: boolean
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_details_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_details: {
        Row: {
          brand: string | null
          color: string | null
          fuel: string | null
          listing_id: string
          mileage_km: number | null
          model: string | null
          seats: number | null
          transmission: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          color?: string | null
          fuel?: string | null
          listing_id: string
          mileage_km?: number | null
          model?: string | null
          seats?: number | null
          transmission?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          color?: string | null
          fuel?: string | null
          listing_id?: string
          mileage_km?: number | null
          model?: string | null
          seats?: number | null
          transmission?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_details_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
      lead_source: "anuncio" | "formulario" | "whatsapp" | "consultor"
      lead_status: "novo" | "em_contacto" | "fechado" | "perdido"
      listing_kind: "imovel" | "viatura"
      listing_purpose: "venda" | "arrendamento"
      listing_status: "disponivel" | "reservado" | "vendido" | "arrendado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      lead_source: ["anuncio", "formulario", "whatsapp", "consultor"],
      lead_status: ["novo", "em_contacto", "fechado", "perdido"],
      listing_kind: ["imovel", "viatura"],
      listing_purpose: ["venda", "arrendamento"],
      listing_status: ["disponivel", "reservado", "vendido", "arrendado"],
    },
  },
} as const

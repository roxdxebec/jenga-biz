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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_summaries: {
        Row: {
          additional_data: Json | null
          created_at: string
          id: string
          metric_date: string
          metric_type: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          metric_date: string
          metric_type: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_type?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      business_milestones: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          id: string
          milestone_type: Database["public"]["Enums"]["milestone_type"]
          notes: string | null
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_type: Database["public"]["Enums"]["milestone_type"]
          notes?: string | null
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_type?: Database["public"]["Enums"]["milestone_type"]
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_milestones_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_progress_stages: {
        Row: {
          completed_at: string | null
          created_at: string
          form_fields_completed: number | null
          id: string
          stage_name: string
          started_at: string
          strategy_id: string | null
          time_spent_seconds: number | null
          total_form_fields: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          form_fields_completed?: number | null
          id?: string
          stage_name: string
          started_at?: string
          strategy_id?: string | null
          time_spent_seconds?: number | null
          total_form_fields?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          form_fields_completed?: number | null
          id?: string
          stage_name?: string
          started_at?: string
          strategy_id?: string | null
          time_spent_seconds?: number | null
          total_form_fields?: number | null
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          business_type: string | null
          created_at: string
          description: string | null
          hub_id: string | null
          id: string
          is_active: boolean | null
          name: string
          registration_number: string | null
          stage: Database["public"]["Enums"]["business_stage"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          description?: string | null
          hub_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          registration_number?: string | null
          stage?: Database["public"]["Enums"]["business_stage"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          description?: string | null
          hub_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          registration_number?: string | null
          stage?: Database["public"]["Enums"]["business_stage"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          business_id: string
          created_at: string
          currency: string | null
          expenses: number | null
          id: string
          notes: string | null
          record_date: string
          revenue: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          currency?: string | null
          expenses?: number | null
          id?: string
          notes?: string | null
          record_date: string
          revenue?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          currency?: string | null
          expenses?: number | null
          id?: string
          notes?: string | null
          record_date?: string
          revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      geographic_analytics: {
        Row: {
          active_businesses: number
          country_code: string
          country_name: string
          id: string
          last_updated: string
          region: string | null
          total_revenue: number | null
          user_count: number
        }
        Insert: {
          active_businesses?: number
          country_code: string
          country_name: string
          id?: string
          last_updated?: string
          region?: string | null
          total_revenue?: number | null
          user_count?: number
        }
        Update: {
          active_businesses?: number
          country_code?: string
          country_name?: string
          id?: string
          last_updated?: string
          region?: string | null
          total_revenue?: number | null
          user_count?: number
        }
        Relationships: []
      }
      hubs: {
        Row: {
          contact_email: string | null
          country: string
          created_at: string
          id: string
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          country: string
          created_at?: string
          id?: string
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          country?: string
          created_at?: string
          id?: string
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_creation_records: {
        Row: {
          business_id: string
          created_at: string
          id: string
          job_type: string | null
          jobs_created: number
          recorded_date: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          job_type?: string | null
          jobs_created?: number
          recorded_date?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          job_type?: string | null
          jobs_created?: number
          recorded_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_creation_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_completion_analytics: {
        Row: {
          business_id: string | null
          business_stage: string | null
          completed_at: string | null
          created_at: string
          days_to_complete: number | null
          id: string
          milestone_category: string | null
          milestone_title: string
          status: string
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          business_stage?: string | null
          completed_at?: string | null
          created_at?: string
          days_to_complete?: number | null
          id?: string
          milestone_category?: string | null
          milestone_title: string
          status?: string
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          business_stage?: string | null
          completed_at?: string | null
          created_at?: string
          days_to_complete?: number | null
          id?: string
          milestone_category?: string | null
          milestone_title?: string
          status?: string
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_type: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      template_usage_analytics: {
        Row: {
          abandoned_at_stage: string | null
          completed_at: string | null
          completion_percentage: number | null
          conversion_type: string | null
          created_at: string
          id: string
          selected_at: string
          template_id: string
          template_name: string
          time_to_complete_minutes: number | null
          user_id: string
        }
        Insert: {
          abandoned_at_stage?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          conversion_type?: string | null
          created_at?: string
          id?: string
          selected_at?: string
          template_id: string
          template_name: string
          time_to_complete_minutes?: number | null
          user_id: string
        }
        Update: {
          abandoned_at_stage?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          conversion_type?: string | null
          created_at?: string
          id?: string
          selected_at?: string
          template_id?: string
          template_name?: string
          time_to_complete_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          city: string | null
          country_code: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          region: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          city?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          region?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          city?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          region?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_journey_analytics: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          hub_id: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          hub_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          hub_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_drop_off_points: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_time_on_page: number
          drop_off_rate: number
          page_path: string
          total_entries: number
          total_exits: number
        }[]
      }
      calculate_stage_completion_rates: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_time_to_complete: number
          completion_rate: number
          stage_name: string
          total_completions: number
          total_starts: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_hub_manager: {
        Args: { _user_id: string }
        Returns: boolean
      }
      update_geographic_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      business_stage: "idea" | "launch" | "growth" | "scale"
      milestone_type:
        | "business_registration"
        | "first_customer"
        | "first_hire"
        | "break_even"
        | "loan_application"
        | "investment_ready"
      user_role: "entrepreneur" | "hub_manager" | "admin" | "super_admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      business_stage: ["idea", "launch", "growth", "scale"],
      milestone_type: [
        "business_registration",
        "first_customer",
        "first_hire",
        "break_even",
        "loan_application",
        "investment_ready",
      ],
      user_role: ["entrepreneur", "hub_manager", "admin", "super_admin"],
    },
  },
} as const

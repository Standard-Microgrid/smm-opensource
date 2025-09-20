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
  core: {
    Tables: {
      branches: {
        Row: {
          country_code: string | null
          created_at: string
          currency: string | null
          id: string
          name: string
          organization_id: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          name: string
          organization_id: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          name?: string
          organization_id?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          branch_id: string
          connection_date: string | null
          connection_status: string
          created_at: string
          current_balance: number | null
          customer_code: string
          customer_type: string
          deleted_at: string | null
          email: string | null
          full_name: string
          grid_id: string
          id: string
          is_active: boolean
          location: unknown | null
          meter_provider_id: string
          notes: string | null
          organization_id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          branch_id: string
          connection_date?: string | null
          connection_status?: string
          created_at?: string
          current_balance?: number | null
          customer_code: string
          customer_type: string
          deleted_at?: string | null
          email?: string | null
          full_name: string
          grid_id: string
          id?: string
          is_active?: boolean
          location?: unknown | null
          meter_provider_id: string
          notes?: string | null
          organization_id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string
          connection_date?: string | null
          connection_status?: string
          created_at?: string
          current_balance?: number | null
          customer_code?: string
          customer_type?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          grid_id?: string
          id?: string
          is_active?: boolean
          location?: unknown | null
          meter_provider_id?: string
          notes?: string | null
          organization_id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customers_grid_id_grids_id"
            columns: ["grid_id"]
            isOneToOne: false
            referencedRelation: "grids"
            referencedColumns: ["id"]
          },
        ]
      }
      grids: {
        Row: {
          branch_id: string
          created_at: string
          grid_code: string
          id: string
          location: unknown | null
          name: string
          notes: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          grid_code: string
          id?: string
          location?: unknown | null
          name: string
          notes?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          grid_code?: string
          id?: string
          location?: unknown | null
          name?: string
          notes?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string
          organization_id: string
          role_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id: string
          role_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id?: string
          role_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          hq_country: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hq_country?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hq_country?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          display_name: string
          id: string
          name: string
          resource_type: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          name: string
          resource_type: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          resource_type?: string
        }
        Relationships: []
      }
      role_changes: {
        Row: {
          changed_by: string
          created_at: string
          from_role_id: string | null
          id: string
          organization_id: string
          reason: string | null
          to_role_id: string
          user_id: string
        }
        Insert: {
          changed_by: string
          created_at?: string
          from_role_id?: string | null
          id?: string
          organization_id: string
          reason?: string | null
          to_role_id: string
          user_id: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          from_role_id?: string | null
          id?: string
          organization_id?: string
          reason?: string | null
          to_role_id?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          level: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          level: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          level?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          access_scope: Json | null
          branch_id: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          phone_number: string | null
          role_id: string | null
          updated_at: string
        }
        Insert: {
          access_scope?: Json | null
          branch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          phone_number?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          access_scope?: Json | null
          branch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          phone_number?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          branch_id: string | null
          created_at: string
          expires_at: string
          id: string
          organization_id: string
          role_id: string
          session_token: string
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          organization_id: string
          role_id: string
          session_token: string
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          organization_id?: string
          role_id?: string
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_user: {
        Args: { manager_id: string; target_user_id: string }
        Returns: boolean
      }
      get_organization_members: {
        Args: { p_organization_id: string }
        Returns: {
          branch_id: string
          email: string
          full_name: string
          joined_at: string
          role_display_name: string
          role_level: number
          role_name: string
          status: string
          user_id: string
        }[]
      }
      get_user_organization: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_organization_id: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_role_level: {
        Args: { p_user_id: string }
        Returns: number
      }
      is_executive: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_last_executive: {
        Args: { p_organization_id: string; p_user_id: string }
        Returns: boolean
      }
      is_user_executive: {
        Args: { p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  core: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

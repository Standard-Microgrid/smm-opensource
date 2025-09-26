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
          city: string
          country: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          phone_number: string
          timezone: string
          updated_at: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          currency: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          phone_number: string
          timezone: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          phone_number?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_branches_organization_id_organizations_id"
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
          contacts: Json[] | null
          created_at: string
          documents: Json[] | null
          generation_capacity_kw: number | null
          grid_code: number
          id: string
          image_url: string
          location: unknown | null
          meter_provider_id: string
          momo_provider_id: string
          name: string
          notes: string | null
          organization_id: string
          ps_provider_id: string
          slug: string
          storage_capacity_kwh: number | null
          updated_at: string
          wifi: Json[] | null
        }
        Insert: {
          branch_id: string
          contacts?: Json[] | null
          created_at?: string
          documents?: Json[] | null
          generation_capacity_kw?: number | null
          grid_code: number
          id?: string
          image_url?: string
          location?: unknown | null
          meter_provider_id: string
          momo_provider_id: string
          name: string
          notes?: string | null
          organization_id: string
          ps_provider_id: string
          slug: string
          storage_capacity_kwh?: number | null
          updated_at?: string
          wifi?: Json[] | null
        }
        Update: {
          branch_id?: string
          contacts?: Json[] | null
          created_at?: string
          documents?: Json[] | null
          generation_capacity_kw?: number | null
          grid_code?: number
          id?: string
          image_url?: string
          location?: unknown | null
          meter_provider_id?: string
          momo_provider_id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          ps_provider_id?: string
          slug?: string
          storage_capacity_kwh?: number | null
          updated_at?: string
          wifi?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_grids_branches"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grids_organizations"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "fk_organization_members_branches"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization_members_organizations"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization_members_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization_members_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization_members_user_profiles_0"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
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
        Relationships: [
          {
            foreignKeyName: "fk_role_changes_organizations"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_role_changes_roles"
            columns: ["from_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_role_changes_roles_0"
            columns: ["to_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_role_changes_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_role_changes_user_profiles_0"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_role_permissions_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "fk_user_profiles_branch_id_branches_id"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_profiles_organization_id_organizations_id_0"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_profiles_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
        Relationships: [
          {
            foreignKeyName: "fk_user_sessions_branches"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_sessions_organizations"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_sessions_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_sessions_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
  ops_data: {
    Tables: {
      daily_ps_summary: {
        Row: {
          avg_battery_soc: number | null
          created_at: string
          critical_events_count: number | null
          data_points_count: number | null
          date: string | null
          id: string
          max_inverter_output: number | null
          min_battery_soc: number | null
          power_system_id: string | null
          total_load_kwh: number | null
          total_solar_kwh: number | null
          uptime_hours: number | null
          warning_events_count: number | null
        }
        Insert: {
          avg_battery_soc?: number | null
          created_at?: string
          critical_events_count?: number | null
          data_points_count?: number | null
          date?: string | null
          id: string
          max_inverter_output?: number | null
          min_battery_soc?: number | null
          power_system_id?: string | null
          total_load_kwh?: number | null
          total_solar_kwh?: number | null
          uptime_hours?: number | null
          warning_events_count?: number | null
        }
        Update: {
          avg_battery_soc?: number | null
          created_at?: string
          critical_events_count?: number | null
          data_points_count?: number | null
          date?: string | null
          id?: string
          max_inverter_output?: number | null
          min_battery_soc?: number | null
          power_system_id?: string | null
          total_load_kwh?: number | null
          total_solar_kwh?: number | null
          uptime_hours?: number | null
          warning_events_count?: number | null
        }
        Relationships: []
      }
      hourly_ps_summary: {
        Row: {
          avg_battery_soc: number | null
          avg_inverter_output: number | null
          created_at: string
          data_points: number | null
          events_count: number | null
          hour: string | null
          id: string
          load_kwh: number | null
          power_system_id: string | null
          solar_kwh: number | null
        }
        Insert: {
          avg_battery_soc?: number | null
          avg_inverter_output?: number | null
          created_at?: string
          data_points?: number | null
          events_count?: number | null
          hour?: string | null
          id: string
          load_kwh?: number | null
          power_system_id?: string | null
          solar_kwh?: number | null
        }
        Update: {
          avg_battery_soc?: number | null
          avg_inverter_output?: number | null
          created_at?: string
          data_points?: number | null
          events_count?: number | null
          hour?: string | null
          id?: string
          load_kwh?: number | null
          power_system_id?: string | null
          solar_kwh?: number | null
        }
        Relationships: []
      }
      meter_events_normalized: {
        Row: {
          branch_id: string
          created_at: string
          customer_id: string
          description: string
          event_category: string
          event_timestamp: string
          event_type: string
          grid_id: string
          id: string
          meter_provider_id: string
          organization_id: string
          provider_event_id: string
          provider_meter_id: string
          severity: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          customer_id: string
          description: string
          event_category: string
          event_timestamp: string
          event_type: string
          grid_id: string
          id?: string
          meter_provider_id: string
          organization_id: string
          provider_event_id: string
          provider_meter_id: string
          severity: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          customer_id?: string
          description?: string
          event_category?: string
          event_timestamp?: string
          event_type?: string
          grid_id?: string
          id?: string
          meter_provider_id?: string
          organization_id?: string
          provider_event_id?: string
          provider_meter_id?: string
          severity?: string
        }
        Relationships: []
      }
      meter_logs_normalized: {
        Row: {
          branch_id: string
          created_at: string
          customer_id: string
          data_quality: string
          grid_id: string
          id: string
          log_timestamp: string
          meter_provider_id: string
          organization_id: string
          provider_log_id: string
          provider_meter_id: string
          reading_period: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          customer_id: string
          data_quality: string
          grid_id: string
          id?: string
          log_timestamp: string
          meter_provider_id: string
          organization_id: string
          provider_log_id: string
          provider_meter_id: string
          reading_period: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          customer_id?: string
          data_quality?: string
          grid_id?: string
          id?: string
          log_timestamp?: string
          meter_provider_id?: string
          organization_id?: string
          provider_log_id?: string
          provider_meter_id?: string
          reading_period?: string
        }
        Relationships: []
      }
      onepower_meter_events: {
        Row: {
          created_at: string
          description: string
          event_code: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Insert: {
          created_at?: string
          description: string
          event_code?: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id?: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Update: {
          created_at?: string
          description?: string
          event_code?: number | null
          event_data?: Json
          event_timestamp?: string
          event_type?: string
          id?: string
          meter_id?: string
          raw_data?: Json
          severity?: string
        }
        Relationships: []
      }
      onepower_meter_logs: {
        Row: {
          created_at: string
          id: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Update: {
          created_at?: string
          id?: string
          log_timestamp?: string
          meter_id?: string
          sequence_number?: number
        }
        Relationships: []
      }
      ps_events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string | null
          id: string
          power_system_id: string | null
          severity: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type?: string | null
          id?: string
          power_system_id?: string | null
          severity?: string | null
          timestamp: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string | null
          id?: string
          power_system_id?: string | null
          severity?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      ps_logs: {
        Row: {
          battery_soc_percent: number | null
          battery_voltage_v: number | null
          created_at: string
          data_quality: number | null
          id: string
          inverter_output_kw: number | null
          load_consumption_kw: number | null
          power_system_id: string | null
          solar_generation_kw: number | null
          system_status: string | null
          timestamp: string
        }
        Insert: {
          battery_soc_percent?: number | null
          battery_voltage_v?: number | null
          created_at?: string
          data_quality?: number | null
          id?: string
          inverter_output_kw?: number | null
          load_consumption_kw?: number | null
          power_system_id?: string | null
          solar_generation_kw?: number | null
          system_status?: string | null
          timestamp: string
        }
        Update: {
          battery_soc_percent?: number | null
          battery_voltage_v?: number | null
          created_at?: string
          data_quality?: number | null
          id?: string
          inverter_output_kw?: number | null
          load_consumption_kw?: number | null
          power_system_id?: string | null
          solar_generation_kw?: number | null
          system_status?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      sm_meter_events: {
        Row: {
          created_at: string
          description: string
          event_code: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Insert: {
          created_at?: string
          description: string
          event_code?: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id?: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Update: {
          created_at?: string
          description?: string
          event_code?: number | null
          event_data?: Json
          event_timestamp?: string
          event_type?: string
          id?: string
          meter_id?: string
          raw_data?: Json
          severity?: string
        }
        Relationships: []
      }
      sm_meter_logs: {
        Row: {
          created_at: string
          id: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Update: {
          created_at?: string
          id?: string
          log_timestamp?: string
          meter_id?: string
          sequence_number?: number
        }
        Relationships: []
      }
      sparkmeter_meter_events: {
        Row: {
          created_at: string
          description: string
          event_code: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Insert: {
          created_at?: string
          description: string
          event_code?: number | null
          event_data: Json
          event_timestamp: string
          event_type: string
          id?: string
          meter_id: string
          raw_data: Json
          severity: string
        }
        Update: {
          created_at?: string
          description?: string
          event_code?: number | null
          event_data?: Json
          event_timestamp?: string
          event_type?: string
          id?: string
          meter_id?: string
          raw_data?: Json
          severity?: string
        }
        Relationships: []
      }
      sparkmeter_meter_logs: {
        Row: {
          created_at: string
          id: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_timestamp: string
          meter_id: string
          sequence_number: number
        }
        Update: {
          created_at?: string
          id?: string
          log_timestamp?: string
          meter_id?: string
          sequence_number?: number
        }
        Relationships: []
      }
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
  payment_data: {
    Tables: {
      onepower_transactions: {
        Row: {
          created_at: string
          credit_purchased: number | null
          id: string
          meter_number: string
          onepower_raw_data: Json | null
          onepower_transaction_id: string
          payment_channel: string | null
          receipt_number: string | null
          sync_status: string | null
          tariff_plan_id: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number: string
          onepower_raw_data?: Json | null
          onepower_transaction_id: string
          payment_channel?: string | null
          receipt_number?: string | null
          sync_status?: string | null
          tariff_plan_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number?: string
          onepower_raw_data?: Json | null
          onepower_transaction_id?: string
          payment_channel?: string | null
          receipt_number?: string | null
          sync_status?: string | null
          tariff_plan_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sparkmeter_transactions_transactions_1"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      sm_transactions: {
        Row: {
          created_at: string
          credit_purchased: number | null
          id: string
          meter_number: string
          payment_channel: string | null
          sm_transaction_id: string
          sync_status: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number: string
          payment_channel?: string | null
          sm_transaction_id: string
          sync_status?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number?: string
          payment_channel?: string | null
          sm_transaction_id?: string
          sync_status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sparkmeter_transactions_transactions_0"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      sparkmeter_transactions: {
        Row: {
          created_at: string
          credit_purchased: number | null
          id: string
          meter_number: string
          payment_channel: string | null
          receipt_number: string | null
          sparkmeter_raw_data: Json | null
          sparkmeter_transaction_id: string
          sync_status: string | null
          tariff_plan_id: string | null
          transaction_id: string | null
          vendor_reference: string | null
        }
        Insert: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number: string
          payment_channel?: string | null
          receipt_number?: string | null
          sparkmeter_raw_data?: Json | null
          sparkmeter_transaction_id: string
          sync_status?: string | null
          tariff_plan_id?: string | null
          transaction_id?: string | null
          vendor_reference?: string | null
        }
        Update: {
          created_at?: string
          credit_purchased?: number | null
          id?: string
          meter_number?: string
          payment_channel?: string | null
          receipt_number?: string | null
          sparkmeter_raw_data?: Json | null
          sparkmeter_transaction_id?: string
          sync_status?: string | null
          tariff_plan_id?: string | null
          transaction_id?: string | null
          vendor_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sparkmeter_transactions_transactions"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_audit_log: {
        Row: {
          action: string
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          transaction_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          transaction_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          transaction_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transaction_audit_log_transactions"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_fees: {
        Row: {
          charged_to: string
          created_at: string
          description: string | null
          fee_amount: number
          fee_percentage: number | null
          fee_type: string | null
          id: string
          transaction_id: string | null
        }
        Insert: {
          charged_to: string
          created_at?: string
          description?: string | null
          fee_amount?: number
          fee_percentage?: number | null
          fee_type?: string | null
          id?: string
          transaction_id?: string | null
        }
        Update: {
          charged_to?: string
          created_at?: string
          description?: string | null
          fee_amount?: number
          fee_percentage?: number | null
          fee_type?: string | null
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transaction_fees_transactions"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number | null
          balance_before: number | null
          created_at: string
          currency_code: string
          customer_id: string
          description: string | null
          energy_purchased_kwh: number | null
          external_transaction_id: string | null
          grid_id: string | null
          id: string
          meter_id: string | null
          meter_provider: string | null
          notes: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_reference: string | null
          platform_transaction_id: string | null
          processed_at: string | null
          raw_transaction_data: Json | null
          status: string
          tariff_rate: number | null
          transaction_reference: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          currency_code: string
          customer_id: string
          description?: string | null
          energy_purchased_kwh?: number | null
          external_transaction_id?: string | null
          grid_id?: string | null
          id?: string
          meter_id?: string | null
          meter_provider?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_reference?: string | null
          platform_transaction_id?: string | null
          processed_at?: string | null
          raw_transaction_data?: Json | null
          status: string
          tariff_rate?: number | null
          transaction_reference: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          currency_code?: string
          customer_id?: string
          description?: string | null
          energy_purchased_kwh?: number | null
          external_transaction_id?: string | null
          grid_id?: string | null
          id?: string
          meter_id?: string | null
          meter_provider?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_reference?: string | null
          platform_transaction_id?: string | null
          processed_at?: string | null
          raw_transaction_data?: Json | null
          status?: string
          tariff_rate?: number | null
          transaction_reference?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
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
  platforms: {
    Tables: {
      meter_providers: {
        Row: {
          api_endpoint: string | null
          auth_method: string | null
          created_at: string | null
          description: string | null
          documentation_url: string | null
          id: string
          is_active: boolean
          name: string
          schema_version: string | null
          slug: string
          support_email: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          auth_method?: string | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          schema_version?: string | null
          slug: string
          support_email?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          auth_method?: string | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          schema_version?: string | null
          slug?: string
          support_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      momo_grid_configs: {
        Row: {
          api_key: string
          api_secret: string
          callback_url: string
          created_at: string
          environment: string
          grid_id: string
          id: string
          is_active: boolean
          merchant_identifier: string | null
          operator_account_name: string | null
          operator_account_reference: string | null
          operator_phone_number: string
          pin_or_code: string | null
          provider_config: Json
          provider_id: string
          secondary_id: string | null
          timeout_url: string | null
          updated_at: string
        }
        Insert: {
          api_key: string
          api_secret: string
          callback_url: string
          created_at?: string
          environment?: string
          grid_id: string
          id?: string
          is_active?: boolean
          merchant_identifier?: string | null
          operator_account_name?: string | null
          operator_account_reference?: string | null
          operator_phone_number: string
          pin_or_code?: string | null
          provider_config: Json
          provider_id: string
          secondary_id?: string | null
          timeout_url?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string
          api_secret?: string
          callback_url?: string
          created_at?: string
          environment?: string
          grid_id?: string
          id?: string
          is_active?: boolean
          merchant_identifier?: string | null
          operator_account_name?: string | null
          operator_account_reference?: string | null
          operator_phone_number?: string
          pin_or_code?: string | null
          provider_config?: Json
          provider_id?: string
          secondary_id?: string | null
          timeout_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_momo_grid_configs_momo_providers_0"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "momo_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      momo_providers: {
        Row: {
          api_endpoint: string | null
          auth_method: string | null
          country_codes: string[] | null
          created_at: string
          description: string | null
          documentation_url: string | null
          id: string
          is_active: boolean
          name: string
          region: string | null
          schema_version: string | null
          slug: string
          support_email: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          auth_method?: string | null
          country_codes?: string[] | null
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          region?: string | null
          schema_version?: string | null
          slug: string
          support_email?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          auth_method?: string | null
          country_codes?: string[] | null
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          region?: string | null
          schema_version?: string | null
          slug?: string
          support_email?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      onepower_grid_configs: {
        Row: {
          created_at: string
          grid_id: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          grid_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          grid_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      onepower_meters: {
        Row: {
          branch_id: string
          commissioning_date: string | null
          created_at: string
          customer_id: string
          grid_id: string
          id: string
          last_reading_date: string | null
          location: unknown | null
          notes: string | null
          organization_id: string
          serial_number: string
          status: string | null
          updated_at: string
        }
        Insert: {
          branch_id: string
          commissioning_date?: string | null
          created_at?: string
          customer_id: string
          grid_id: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id: string
          serial_number: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string
          commissioning_date?: string | null
          created_at?: string
          customer_id?: string
          grid_id?: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id?: string
          serial_number?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ps_providers: {
        Row: {
          created_at: string
          id: string
          provider_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider_name: string
        }
        Update: {
          created_at?: string
          id?: string
          provider_name?: string
        }
        Relationships: []
      }
      sm_grid_configs: {
        Row: {
          created_at: string
          grid_id: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          grid_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          grid_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sm_meters: {
        Row: {
          branch_id: string
          commissioning_date: string | null
          created_at: string
          customer_id: string
          grid_id: string
          id: string
          last_reading_date: string | null
          location: unknown | null
          notes: string | null
          organization_id: string
          serial_number: string
          sockets: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          branch_id: string
          commissioning_date?: string | null
          created_at?: string
          customer_id: string
          grid_id: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id: string
          serial_number: string
          sockets?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string
          commissioning_date?: string | null
          created_at?: string
          customer_id?: string
          grid_id?: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id?: string
          serial_number?: string
          sockets?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sm_socket_templates: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sm_sockets: {
        Row: {
          created_at: string
          id: string
          last_reading_date: string | null
          meter_id: string
          notes: string | null
          socket_config: Json
          socket_number: number
          socket_template_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reading_date?: string | null
          meter_id: string
          notes?: string | null
          socket_config: Json
          socket_number: number
          socket_template_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reading_date?: string | null
          meter_id?: string
          notes?: string | null
          socket_config?: Json
          socket_number?: number
          socket_template_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sm_sockets_sm_meters_0"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "sm_meters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sm_sockets_sm_socket_templates_0"
            columns: ["socket_template_id"]
            isOneToOne: false
            referencedRelation: "sm_socket_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sparkmeter_grid_configs: {
        Row: {
          created_at: string
          grid_id: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          grid_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          grid_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sparkmeter_meters: {
        Row: {
          branch_id: string
          commissioning_date: string | null
          created_at: string
          customer_id: string
          grid_id: string
          id: string
          last_reading_date: string | null
          location: unknown | null
          notes: string | null
          organization_id: string
          serial_number: string
          status: string | null
          updated_at: string
        }
        Insert: {
          branch_id: string
          commissioning_date?: string | null
          created_at?: string
          customer_id: string
          grid_id: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id: string
          serial_number: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string
          commissioning_date?: string | null
          created_at?: string
          customer_id?: string
          grid_id?: string
          id?: string
          last_reading_date?: string | null
          location?: unknown | null
          notes?: string | null
          organization_id?: string
          serial_number?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
  ops_data: {
    Enums: {},
  },
  payment_data: {
    Enums: {},
  },
  platforms: {
    Enums: {},
  },
} as const

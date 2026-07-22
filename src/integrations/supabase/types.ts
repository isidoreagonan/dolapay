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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          ip: string | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          hashed_key: string
          id: string
          label: string
          last_used_at: string | null
          prefix: string
          profile_id: string
          revoked_at: string | null
        }
        Insert: {
          created_at?: string
          hashed_key: string
          id?: string
          label: string
          last_used_at?: string | null
          prefix: string
          profile_id: string
          revoked_at?: string | null
        }
        Update: {
          created_at?: string
          hashed_key?: string
          id?: string
          label?: string
          last_used_at?: string | null
          prefix?: string
          profile_id?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_representatives: {
        Row: {
          ai_verification_log: Json | null
          created_at: string
          didit_session_id: string | null
          didit_status: string | null
          email: string
          full_name: string
          id: string
          profile_id: string
          title: string
          updated_at: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          ai_verification_log?: Json | null
          created_at?: string
          didit_session_id?: string | null
          didit_status?: string | null
          email: string
          full_name: string
          id?: string
          profile_id: string
          title: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          ai_verification_log?: Json | null
          created_at?: string
          didit_session_id?: string | null
          didit_status?: string | null
          email?: string
          full_name?: string
          id?: string
          profile_id?: string
          title?: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_representatives_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          company_name: string
          created_at: string
          director_address: string | null
          director_city: string | null
          director_country: string | null
          director_dob: string | null
          director_first_name: string | null
          director_last_name: string | null
          director_role: string | null
          headquarters_address: string | null
          hq_city: string | null
          hq_country: string | null
          id: string
          merchant_mm_number: string | null
          merchant_mm_provider: string | null
          profile_id: string
          registration_number: string | null
          tax_id: string | null
          ubos: Json
        }
        Insert: {
          company_name: string
          created_at?: string
          director_address?: string | null
          director_city?: string | null
          director_country?: string | null
          director_dob?: string | null
          director_first_name?: string | null
          director_last_name?: string | null
          director_role?: string | null
          headquarters_address?: string | null
          hq_city?: string | null
          hq_country?: string | null
          id?: string
          merchant_mm_number?: string | null
          merchant_mm_provider?: string | null
          profile_id: string
          registration_number?: string | null
          tax_id?: string | null
          ubos?: Json
        }
        Update: {
          company_name?: string
          created_at?: string
          director_address?: string | null
          director_city?: string | null
          director_country?: string | null
          director_dob?: string | null
          director_first_name?: string | null
          director_last_name?: string | null
          director_role?: string | null
          headquarters_address?: string | null
          hq_city?: string | null
          hq_country?: string | null
          id?: string
          merchant_mm_number?: string | null
          merchant_mm_provider?: string | null
          profile_id?: string
          registration_number?: string | null
          tax_id?: string | null
          ubos?: Json
        }
        Relationships: [
          {
            foreignKeyName: "businesses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["kyc_doc_type"]
          file_path: string
          id: string
          profile_id: string
          status: Database["public"]["Enums"]["kyc_doc_status"]
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["kyc_doc_type"]
          file_path: string
          id?: string
          profile_id: string
          status?: Database["public"]["Enums"]["kyc_doc_status"]
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["kyc_doc_type"]
          file_path?: string
          id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["kyc_doc_status"]
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pay_attempts: {
        Row: {
          created_at: string
          id: string
          ip: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string
          slug?: string
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          active: boolean
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["tx_currency"]
          description: string | null
          failure_url: string | null
          fees_paid_by: string
          id: string
          image_url: string | null
          invoice_number: string | null
          profile_id: string
          slug: string
          success_url: string | null
          thank_you_message: string | null
          theme_config: Json | null
          title: string
        }
        Insert: {
          active?: boolean
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          description?: string | null
          failure_url?: string | null
          fees_paid_by?: string
          id?: string
          image_url?: string | null
          invoice_number?: string | null
          profile_id: string
          slug: string
          success_url?: string | null
          thank_you_message?: string | null
          theme_config?: Json | null
          title: string
        }
        Update: {
          active?: boolean
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          description?: string | null
          failure_url?: string | null
          fees_paid_by?: string
          id?: string
          image_url?: string | null
          invoice_number?: string | null
          profile_id?: string
          slug?: string
          success_url?: string | null
          thank_you_message?: string | null
          theme_config?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_batch_items: {
        Row: {
          amount: number
          batch_id: string
          created_at: string
          currency: string
          error: string | null
          id: string
          provider: string
          recipient_name: string
          recipient_phone: string
          status: Database["public"]["Enums"]["batch_item_status"]
        }
        Insert: {
          amount: number
          batch_id: string
          created_at?: string
          currency?: string
          error?: string | null
          id?: string
          provider: string
          recipient_name: string
          recipient_phone: string
          status?: Database["public"]["Enums"]["batch_item_status"]
        }
        Update: {
          amount?: number
          batch_id?: string
          created_at?: string
          currency?: string
          error?: string | null
          id?: string
          provider?: string
          recipient_name?: string
          recipient_phone?: string
          status?: Database["public"]["Enums"]["batch_item_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payout_batch_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payout_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_batches: {
        Row: {
          created_at: string
          currency: string
          id: string
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["batch_status"]
          total_amount: number
          total_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["batch_status"]
          total_amount?: number
          total_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["batch_status"]
          total_amount?: number
          total_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          address: string | null
          ai_verification_log: Json | null
          ai_verification_score: number | null
          ai_verified_at: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          kyc_rejection_reason: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_name: string | null
          mobile_money_number: string | null
          mobile_money_provider: string | null
          onboarding_completed: boolean
          phone: string | null
          role: string | null
          updated_at: string
          verification_mode: Database["public"]["Enums"]["verification_mode"]
          volume_limit_xof: number
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          address?: string | null
          ai_verification_log?: Json | null
          ai_verification_score?: number | null
          ai_verified_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          mobile_money_number?: string | null
          mobile_money_provider?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
          verification_mode?: Database["public"]["Enums"]["verification_mode"]
          volume_limit_xof?: number
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          address?: string | null
          ai_verification_log?: Json | null
          ai_verification_score?: number | null
          ai_verified_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          mobile_money_number?: string | null
          mobile_money_provider?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
          verification_mode?: Database["public"]["Enums"]["verification_mode"]
          volume_limit_xof?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          id: string
          owner_id: string
          role: Database["public"]["Enums"]["team_role"]
          status: Database["public"]["Enums"]["team_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          owner_id: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          owner_id?: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["tx_currency"]
          description: string | null
          id: string
          idempotency_key: string | null
          ligdicash_token: string | null
          profile_id: string
          status: Database["public"]["Enums"]["tx_status"]
          type: Database["public"]["Enums"]["tx_type"]
          provider: string | null
          payment_method: string | null
          net_amount: number | null
          customer_phone: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          description?: string | null
          id?: string
          idempotency_key?: string | null
          ligdicash_token?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["tx_status"]
          type: Database["public"]["Enums"]["tx_type"]
          provider?: string | null
          payment_method?: string | null
          net_amount?: number | null
          customer_phone?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          description?: string | null
          id?: string
          idempotency_key?: string | null
          ligdicash_token?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["tx_status"]
          type?: Database["public"]["Enums"]["tx_type"]
          provider?: string | null
          payment_method?: string | null
          net_amount?: number | null
          customer_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: Database["public"]["Enums"]["tx_currency"]
          hashed_pin: string | null
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          hashed_pin?: string | null
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          hashed_pin?: string | null
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["tx_currency"]
          id: string
          method: string
          profile_id: string
          recipient_phone: string
          status: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          id?: string
          method: string
          profile_id: string
          recipient_phone: string
          status?: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["tx_currency"]
          id?: string
          method?: string
          profile_id?: string
          recipient_phone?: string
          status?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawal_requests_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
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
    }
    Enums: {
      account_type: "standard" | "enterprise"
      app_role: "merchant" | "admin"
      batch_item_status: "pending" | "processing" | "success" | "failed"
      batch_status: "draft" | "processing" | "completed" | "failed"
      kyc_doc_status: "pending" | "approved" | "rejected"
      kyc_doc_type:
        | "id"
        | "selfie"
        | "proof_of_address"
        | "rccm"
        | "director_id"
        | "bank_details"
        | "tax_doc"
      kyc_status:
        | "pending"
        | "approved"
        | "rejected"
        | "frozen"
        | "in_compliance_review"
      team_role: "admin" | "operator" | "viewer"
      team_status: "pending" | "active" | "revoked"
      tx_currency: "XOF" | "XAF" | "USD"
      tx_status: "success" | "failed" | "pending"
      tx_type: "pay-in" | "pay-out" | "payment_link"
      verification_mode: "manual" | "didit_ai"
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
      account_type: ["standard", "enterprise"],
      app_role: ["merchant", "admin"],
      batch_item_status: ["pending", "processing", "success", "failed"],
      batch_status: ["draft", "processing", "completed", "failed"],
      kyc_doc_status: ["pending", "approved", "rejected"],
      kyc_doc_type: [
        "id",
        "selfie",
        "proof_of_address",
        "rccm",
        "director_id",
        "bank_details",
        "tax_doc",
      ],
      kyc_status: [
        "pending",
        "approved",
        "rejected",
        "frozen",
        "in_compliance_review",
      ],
      team_role: ["admin", "operator", "viewer"],
      team_status: ["pending", "active", "revoked"],
      tx_currency: ["XOF", "XAF", "USD"],
      tx_status: ["success", "failed", "pending"],
      tx_type: ["pay-in", "pay-out", "payment_link"],
      verification_mode: ["manual", "didit_ai"],
    },
  },
} as const

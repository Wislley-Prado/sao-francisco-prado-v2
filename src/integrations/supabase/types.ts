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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string
          created_at: string
          email: string
          id: string
          nome_usuario: string
          nota: number
          rancho_id: string
          resposta_admin: string | null
          updated_at: string
          verificado: boolean
        }
        Insert: {
          comentario: string
          created_at?: string
          email: string
          id?: string
          nome_usuario: string
          nota: number
          rancho_id: string
          resposta_admin?: string | null
          updated_at?: string
          verificado?: boolean
        }
        Update: {
          comentario?: string
          created_at?: string
          email?: string
          id?: string
          nome_usuario?: string
          nota?: number
          rancho_id?: string
          resposta_admin?: string | null
          updated_at?: string
          verificado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "rancho_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "ranchos"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_analytics: {
        Row: {
          created_at: string
          evento: string
          id: string
          ip_address: string | null
          post_id: string
          tipo: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          evento: string
          id?: string
          ip_address?: string | null
          post_id: string
          tipo?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          evento?: string
          id?: string
          ip_address?: string | null
          post_id?: string
          tipo?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          autor_id: string | null
          banner_midia_paga: Json | null
          categoria: string | null
          conteudo: string
          created_at: string
          data_publicacao: string | null
          id: string
          imagem_destaque: string | null
          publicado: boolean
          redes_sociais: Json | null
          resumo: string | null
          slug: string
          tags: string[] | null
          titulo: string
          updated_at: string
          visualizacoes: number
        }
        Insert: {
          autor_id?: string | null
          banner_midia_paga?: Json | null
          categoria?: string | null
          conteudo: string
          created_at?: string
          data_publicacao?: string | null
          id?: string
          imagem_destaque?: string | null
          publicado?: boolean
          redes_sociais?: Json | null
          resumo?: string | null
          slug: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
          visualizacoes?: number
        }
        Update: {
          autor_id?: string | null
          banner_midia_paga?: Json | null
          categoria?: string | null
          conteudo?: string
          created_at?: string
          data_publicacao?: string | null
          id?: string
          imagem_destaque?: string | null
          publicado?: boolean
          redes_sociais?: Json | null
          resumo?: string | null
          slug?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
          visualizacoes?: number
        }
        Relationships: []
      }
      categorias: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number
          slug: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          descricao: string | null
          id: string
          tipo: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: []
      }
      pacote_imagens: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          ordem: number
          pacote_id: string
          principal: boolean
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          pacote_id: string
          principal?: boolean
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          pacote_id?: string
          principal?: boolean
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacote_imagens_pacote_id_fkey"
            columns: ["pacote_id"]
            isOneToOne: false
            referencedRelation: "pacotes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacotes: {
        Row: {
          ativo: boolean
          caracteristicas: string[] | null
          created_at: string
          descricao: string | null
          destaque: boolean
          duracao: string
          id: string
          inclusos: string[] | null
          nome: string
          pessoas: number
          popular: boolean
          preco: number
          rating: number
          slug: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          caracteristicas?: string[] | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          duracao: string
          id?: string
          inclusos?: string[] | null
          nome: string
          pessoas?: number
          popular?: boolean
          preco: number
          rating?: number
          slug: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          caracteristicas?: string[] | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          duracao?: string
          id?: string
          inclusos?: string[] | null
          nome?: string
          pessoas?: number
          popular?: boolean
          preco?: number
          rating?: number
          slug?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      produto_imagens: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          ordem: number
          principal: boolean
          produto_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          produto_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          produto_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          created_at: string
          descricao: string | null
          destaque: boolean
          especificacoes: Json | null
          estoque: number
          id: string
          nome: string
          preco: number
          preco_promocional: number | null
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          especificacoes?: Json | null
          estoque?: number
          id?: string
          nome: string
          preco: number
          preco_promocional?: number | null
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          especificacoes?: Json | null
          estoque?: number
          id?: string
          nome?: string
          preco?: number
          preco_promocional?: number | null
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      rancho_analytics: {
        Row: {
          created_at: string
          evento: string
          id: string
          ip_address: string | null
          rancho_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          evento: string
          id?: string
          ip_address?: string | null
          rancho_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          evento?: string
          id?: string
          ip_address?: string | null
          rancho_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rancho_analytics_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "rancho_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rancho_analytics_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "ranchos"
            referencedColumns: ["id"]
          },
        ]
      }
      rancho_imagens: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          ordem: number
          principal: boolean
          rancho_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          rancho_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          rancho_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "rancho_imagens_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "rancho_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rancho_imagens_rancho_id_fkey"
            columns: ["rancho_id"]
            isOneToOne: false
            referencedRelation: "ranchos"
            referencedColumns: ["id"]
          },
        ]
      }
      ranchos: {
        Row: {
          area: number | null
          banheiros: number
          capacidade: number
          caracteristicas: Json | null
          comodidades: string[] | null
          created_at: string
          descricao: string | null
          destaque: boolean
          disponivel: boolean
          endereco_completo: string | null
          google_calendar_url: string | null
          id: string
          latitude: number | null
          localizacao: string
          longitude: number | null
          nome: string
          preco: number
          quartos: number
          rating: number
          slug: string
          telefone_whatsapp: string | null
          tracking_code: string | null
          updated_at: string
          video_youtube: string | null
        }
        Insert: {
          area?: number | null
          banheiros?: number
          capacidade: number
          caracteristicas?: Json | null
          comodidades?: string[] | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          disponivel?: boolean
          endereco_completo?: string | null
          google_calendar_url?: string | null
          id?: string
          latitude?: number | null
          localizacao: string
          longitude?: number | null
          nome: string
          preco: number
          quartos?: number
          rating?: number
          slug: string
          telefone_whatsapp?: string | null
          tracking_code?: string | null
          updated_at?: string
          video_youtube?: string | null
        }
        Update: {
          area?: number | null
          banheiros?: number
          capacidade?: number
          caracteristicas?: Json | null
          comodidades?: string[] | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          disponivel?: boolean
          endereco_completo?: string | null
          google_calendar_url?: string | null
          id?: string
          latitude?: number | null
          localizacao?: string
          longitude?: number | null
          nome?: string
          preco?: number
          quartos?: number
          rating?: number
          slug?: string
          telefone_whatsapp?: string | null
          tracking_code?: string | null
          updated_at?: string
          video_youtube?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          custom_head_scripts: string | null
          facebook_pixel: string | null
          google_analytics: string | null
          google_tag_manager: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_head_scripts?: string | null
          facebook_pixel?: string | null
          google_analytics?: string | null
          google_tag_manager?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_head_scripts?: string | null
          facebook_pixel?: string | null
          google_analytics?: string | null
          google_tag_manager?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      rancho_estatisticas: {
        Row: {
          id: string | null
          nome: string | null
          slug: string | null
          taxa_conversao: number | null
          total_cliques_reserva: number | null
          total_cliques_whatsapp: number | null
          total_visualizacoes: number | null
          visualizacoes_30_dias: number | null
          visualizacoes_7_dias: number | null
        }
        Relationships: []
      }
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

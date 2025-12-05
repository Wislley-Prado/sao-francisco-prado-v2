import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get the JWT token from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is a super_admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is super_admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "super_admin")
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas Super Admins podem gerenciar administradores." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action } = body;

    console.log(`Action: ${action} by user: ${user.email}`);

    switch (action) {
      case "list_admins": {
        // Get all admin user IDs
        const { data: roles, error: rolesError } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .in("role", ["admin", "super_admin"]);

        if (rolesError) {
          throw rolesError;
        }

        const userIds = roles?.map((r) => r.user_id) || [];

        // Get user details from auth.users
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
          perPage: 1000,
        });

        if (authError) {
          throw authError;
        }

        const users = authData.users
          .filter((u) => userIds.includes(u.id))
          .map((u) => ({
            id: u.id,
            email: u.email,
          }));

        return new Response(
          JSON.stringify({ users }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "add_admin": {
        const { email, role } = body;

        if (!email || !role) {
          return new Response(
            JSON.stringify({ error: "Email e role são obrigatórios" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Validate role
        if (!["admin", "super_admin"].includes(role)) {
          return new Response(
            JSON.stringify({ error: "Role inválida" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Find user by email
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
          perPage: 1000,
        });

        if (authError) {
          throw authError;
        }

        const targetUser = authData.users.find((u) => u.email === email);

        if (!targetUser) {
          return new Response(
            JSON.stringify({ error: "Usuário não encontrado. O usuário precisa ter uma conta cadastrada." }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if user already has this role
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", targetUser.id)
          .in("role", ["admin", "super_admin"])
          .maybeSingle();

        if (existingRole) {
          return new Response(
            JSON.stringify({ error: "Usuário já é um administrador" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Add the role
        const { error: insertError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: targetUser.id, role });

        if (insertError) {
          throw insertError;
        }

        console.log(`Admin added: ${email} as ${role} by ${user.email}`);

        return new Response(
          JSON.stringify({ success: true, message: `${email} adicionado como ${role}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "remove_admin": {
        const { user_id: targetUserId } = body;

        if (!targetUserId) {
          return new Response(
            JSON.stringify({ error: "user_id é obrigatório" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prevent self-removal
        if (targetUserId === user.id) {
          return new Response(
            JSON.stringify({ error: "Você não pode remover a si mesmo" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Count super_admins
        const { data: superAdmins, error: countError } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("role", "super_admin");

        if (countError) {
          throw countError;
        }

        // Check if we're removing the last super_admin
        const { data: targetRole } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", targetUserId)
          .in("role", ["admin", "super_admin"])
          .maybeSingle();

        if (targetRole?.role === "super_admin" && superAdmins && superAdmins.length <= 1) {
          return new Response(
            JSON.stringify({ error: "Deve existir pelo menos um Super Admin" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Remove the role
        const { error: deleteError } = await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", targetUserId)
          .in("role", ["admin", "super_admin"]);

        if (deleteError) {
          throw deleteError;
        }

        console.log(`Admin removed: ${targetUserId} by ${user.email}`);

        return new Response(
          JSON.stringify({ success: true, message: "Administrador removido" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Ação inválida" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rolesChecked, setRolesChecked] = useState(false);
  const navigate = useNavigate();

  const checkRoles = async (userId: string) => {
    try {
      console.log('Checking roles for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error checking roles:', error);
        return { isAdmin: false, isSuperAdmin: false };
      }

      const roles = data?.map(r => r.role) || [];
      console.log('User roles found:', roles);
      return {
        isAdmin: roles.includes('admin') || roles.includes('super_admin'),
        isSuperAdmin: roles.includes('super_admin')
      };
    } catch (error) {
      console.error('Error in checkRoles:', error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Check roles when session changes - SEM setTimeout para evitar race condition
        if (currentSession?.user) {
          const roles = await checkRoles(currentSession.user.id);
          if (isMounted) {
            console.log('Setting roles after auth change:', roles);
            setIsAdmin(roles.isAdmin);
            setIsSuperAdmin(roles.isSuperAdmin);
            setRolesChecked(true);
          }
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setRolesChecked(true);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!isMounted) return;

      console.log('Initial session check:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const roles = await checkRoles(currentSession.user.id);
        if (isMounted) {
          console.log('Setting initial roles:', roles);
          setIsAdmin(roles.isAdmin);
          setIsSuperAdmin(roles.isSuperAdmin);
        }
      }

      setRolesChecked(true);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Considera loading enquanto não verificar as roles
  const isReady = !loading && rolesChecked;

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao fazer login');
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Cadastro realizado! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao criar conta');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setIsSuperAdmin(false);
      toast.success('Logout realizado com sucesso!');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isSuperAdmin,
        loading: !isReady,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

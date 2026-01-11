import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    loading: true,
  });

  const checkAdminStatus = useCallback(async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data === true;
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        let isAdmin = false;
        if (user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            isAdmin = await checkAdminStatus(user.id);
            setState((prev) => ({ ...prev, isAdmin }));
          }, 0);
        }

        setState({
          user,
          session,
          isAdmin,
          loading: false,
        });
      }
    );

    // THEN check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      let isAdmin = false;
      if (user) {
        isAdmin = await checkAdminStatus(user.id);
      }

      setState({
        user,
        session,
        isAdmin,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  };
};

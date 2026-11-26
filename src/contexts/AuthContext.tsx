import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from "../services/supabase";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    callsign: string,
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    callsign: string,
  ) => {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { callsign } },
    });
    if (error) {
      throw error;
    }
    return data.session !== null;
  };

  const signOut = async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  }
  return context;
}

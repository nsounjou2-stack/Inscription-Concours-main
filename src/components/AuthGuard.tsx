import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  // Simple pass-through component since we're removing Supabase authentication
  return <>{children}</>;
};

export default AuthGuard;
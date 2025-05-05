"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null; // ローディング中または未ログインの場合は何も表示しない
  }

  return <>{children}</>; // 認証済みの場合は子コンポーネントを表示
};

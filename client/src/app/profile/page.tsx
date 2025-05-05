"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1>プロフィール</h1>

      <p>ユーザーID: {user?.sub}</p>

      <p>ニックネーム: {user?.nickname}</p>

      <p>メールアドレス: {user?.email}</p>

      <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    </div>
  );
}

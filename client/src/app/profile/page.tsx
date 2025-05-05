"use client";

import { AuthGuard } from "@/components/Auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <AuthGuard>
      <div>
        <h1>プロフィール</h1>

        <p>ユーザーID: {user?.sub}</p>

        <p>ニックネーム: {user?.nickname}</p>

        <p>メールアドレス: {user?.email}</p>

        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </div>
    </AuthGuard>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    if (confirm("本当にログアウトしますか？")) {
      await logout();
    }
  };

  const handleConsultationPage = () => {
    router.push("/consultation");
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

      <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
        <button onClick={handleConsultationPage}>相談ページへ</button>
      </div>
    </div>
  );
}

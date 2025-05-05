"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileData {
  sub: string;
  nickname: string;
  email: string;
}

export default function Profile() {
  const [profileDate, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setError("");

      try {
        const response = await fetch("http://localhost:8000/auth/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();
        console.log("プロフィールデータ:", data);
        if (response.ok) {
          setProfileData(data);
        } else {
          setError(data.message || "プロフィールの取得に失敗しました。");
          console.error("プロフィールの取得失敗:", data);
        }
      } catch (error) {
        setError("Failed to communicate with the server.");
        console.error("Error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("ログアウト成功:", data);
      if (response.ok) {
        setProfileData(null);
        router.push("/login");
      } else {
        setError(data.message || "ログアウトに失敗しました。");
        console.error("ログアウト失敗:", data);
      }
    } catch (error) {
      setError("Failed to communicate with the server.");
      console.error("Error:", error);
    }
  };

  if (error) {
    return <div>エラー: {error}</div>;
  }
  if (!profileDate) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>プロフィール</h1>
      <p>ユーザーID: {profileDate.sub}</p>
      <p>ニックネーム: {profileDate.nickname}</p>
      <p>メールアドレス: {profileDate.email}</p>
      <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    </div>
  );
}

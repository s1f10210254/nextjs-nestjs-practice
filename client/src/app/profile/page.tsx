"use client";

import { useEffect, useState } from "react";

interface ProfileData {
  sub: string;
  nickname: string;
  email: string;
}

export default function Profile() {
  const [profileDate, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setError("");

      try {
        const response = await fetch("http://localhost:8000/auth/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();
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
    </div>
  );
}

"use client";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileData {
  sub: string;
  nickname: string;
  email: string;
}
export const useAuth = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await apiClient.get("/auth/profile");
      setUser(res.data);
    } catch {
      setUser(null); // 未ログイン状態
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiClient.post("auth/logout");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, logout };
};

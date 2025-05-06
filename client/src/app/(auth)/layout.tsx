"use client";

import { AuthGuard } from "@/components/Auth/AuthGuard";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

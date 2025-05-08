"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        {/* アプリ名とキャッチ */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            悩みノート
          </h1>
        </div>

        {/* フォーム */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            新規登録
          </button>
        </form>

        {/* ログインへの導線 */}
        <div className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/login" className="text-orange-500 hover:underline">
            ログイン
          </Link>
        </div>
      </div>
    </main>
  );
}

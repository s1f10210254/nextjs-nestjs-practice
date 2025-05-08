"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* くの字のコーナー */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-orange-500" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-orange-500" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-orange-500" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-orange-500" />

      {/* 中央コンテンツ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-4"
      >
        {/* ロゴ */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-orange-600 tracking-tight mb-2">
          Unmute
        </h1>

        {/* サブタイトル */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-base md:text-xl text-gray-600 mb-10"
        >
          声にならなかった悩みに、そっと寄り添う場所
        </motion.p>

        {/* ボタン群 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="flex justify-center gap-4"
        >
          <Link
            href="/login"
            className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-100 transition"
          >
            新規登録
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

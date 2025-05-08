"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const catchLines = [
    [
      "Unmute（アンミュート）は、あなたの悩みに耳を傾け、",
      "「書く・話す・わかち合う」ことを支える場所です。",
    ],
    ["AIが心に寄り添い、日々の記録はあなた自身を理解する手がかりに。"],
    ["そして同じように悩む誰かと、匿名で想いを交わすこともできます。"],
    ["声に出せなかった気持ちを、Unmuteでそっと解き放ちませんか？"],
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-white px-6 text-center overflow-hidden py-16">
      {/* 背景レイヤー */}
      <div
        className="absolute w-[1000px] h-[1000px] rounded-full bg-orange-100 blur-[120px] opacity-40 animate-pulseLight"
        style={{ top: "-20%", left: "-30%" }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-orange-200 blur-[100px] opacity-20 animate-pulseLightSlow"
        style={{ bottom: "-10%", right: "-20%" }}
      />

      {/* アプリ名 */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-4xl font-kurenaido text-orange-400 tracking-wide z-10"
        style={{ textShadow: "0 0 10px rgba(255, 165, 0, 0.3)" }}
      >
        Unmute
      </motion.h1>

      {/* キャッチコピー */}
      <div className="max-w-3xl space-y-6 mt-16 z-10">
        {catchLines.map((lines, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.5, duration: 0.8 }}
            className="text-gray-500 text-xl md:text-2xl leading-loose font-shippori"
          >
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.p>
        ))}
      </div>

      {/* ログイン・新規登録ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8, duration: 0.8 }}
        className="mt-12 flex flex-col sm:flex-row gap-4 z-10"
      >
        <Link
          href="/login"
          className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition font-kurenaido"
        >
          ログイン
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-100 transition font-kurenaido"
        >
          新規登録
        </Link>
      </motion.div>

      {/* 背景アニメーション keyframes */}
      <style jsx global>{`
        @keyframes pulseLight {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(20px, 10px) scale(1.2);
            opacity: 0.4;
          }
        }
        @keyframes pulseLightSlow {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-15px, -10px) scale(1.15);
            opacity: 0.3;
          }
        }
        .animate-pulseLight {
          animation: pulseLight 10s ease-in-out infinite;
        }
        .animate-pulseLightSlow {
          animation: pulseLightSlow 14s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

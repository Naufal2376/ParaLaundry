"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { login } from "./actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      login(formData);
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-(--color-light-primary) to-white p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-active) rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-(--color-text-primary)">
            Para Laundry OS
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full py-3 pl-10 pr-4 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark-primary)/50" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full py-3 pl-10 pr-4 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>

          {message && (
            <p className="text-sm text-center text-red-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 font-semibold text-white bg-(--color-brand-primary) rounded-lg shadow-lg hover:bg-(--color-brand-primary-hover) active:bg-(--color-brand-primary-active) transition-all duration-300 transform hover:scale-105"
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

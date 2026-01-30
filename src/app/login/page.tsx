"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ClipboardCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user profile and role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, roles(name)")
          .eq("id", authData.user.id)
          .single();

        if (profileError) throw profileError;

        const role = profile.roles.name;
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "guru") {
          router.push("/dashboard/guru");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200 border border-zinc-100">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-blue-600 mb-4">
            <ClipboardCheck className="h-8 w-8" />
            <span>SAS School</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Selamat Datang Kembali</h1>
          <p className="text-zinc-500">Masuk untuk mengelola absensi sekolah</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500 transition-all outline-none"
                placeholder="nama@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700" htmlFor="password">
                  Kata Sandi
                </label>
                <Link href="#" className="text-xs text-blue-600 hover:underline">Lupa kata sandi?</Link>
              </div>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all shadow-lg shadow-blue-200"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-zinc-500">
            Belum punya akun? <Link href="#" className="font-medium text-blue-600 hover:underline">Hubungi Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

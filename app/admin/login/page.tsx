"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
  const { user, isAdmin, loading, loginWithGoogle, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, router]);

  // Clear errors when mounting
  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center relative z-10">
          <Image
            src="/images/logo-ratih.svg"
            alt="Ratih Logo"
            width={80}
            height={80}
            className="mb-6 animate-pulse"
          />
          <h1 className="text-2xl font-bold italic uppercase tracking-wider text-white">
            Ratih Creative
          </h1>
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] mt-1.5 mb-8">
            Admin Dashboard Portal
          </p>

          {error && (
            <div className="w-full mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/35 text-red-400 text-xs text-left leading-relaxed">
              <div className="font-bold uppercase tracking-wider mb-1">Akses Ditolak</div>
              {error}
            </div>
          )}

          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/95 text-black font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.76 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                    <path d="M12,20.8c2.38,0 4.38,-0.78 5.84,-2.14l-3.3,-2.56c-0.91,0.61 -2.08,0.97 -3.54,0.97 -2.28,0 -4.22,-1.54 -4.91,-3.61H2.67v2.64C4.12,18.98 7.82,20.8 12,20.8z" fill="#34A853" />
                    <path d="M7.09,13.46c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.42H2.67c-0.62,1.24 -0.97,2.64 -0.97,4.12s0.35,2.88 0.97,4.12L7.09,13.46z" fill="#FBBC05" />
                    <path d="M12,5.9c1.3,0 2.46,0.45 3.38,1.33l2.54,-2.54C16.38,3.22 14.38,2.3 12,2.3c-4.18,0 -7.88,1.82 -9.33,4.6L7.09,9.54C7.78,7.47 9.72,5.9 12,5.9z" fill="#EA4335" />
                  </g>
                </svg>
                <span>Masuk dengan Google</span>
              </>
            )}
          </button>
          
          <Link href="/" className="mt-8 text-xs text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}



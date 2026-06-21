"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { verifyAdminEmail } from "@/lib/actions/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cancelledSignInCodes = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);

const popupRecoveryDelayMs = 600;
const popupFallbackTimeoutMs = 30000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!!auth);
  const [error, setError] = useState<string | null>(null);
  const signInInProgress = useRef(false);
  const popupFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPopupFallbackTimer = useCallback(() => {
    if (popupFallbackTimer.current) {
      clearTimeout(popupFallbackTimer.current);
      popupFallbackTimer.current = null;
    }
  }, []);

  const recoverCancelledPopup = useCallback(() => {
    window.setTimeout(() => {
      if (!signInInProgress.current || auth?.currentUser) {
        return;
      }

      signInInProgress.current = false;
      clearPopupFallbackTimer();
      setLoading(false);
      console.info("Google Sign-In dibatalkan: popup ditutup sebelum Firebase memberi respons.");
    }, popupRecoveryDelayMs);
  }, [clearPopupFallbackTimer]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          // Verify with server action if the email is whitelisted
          const isAllowed = await verifyAdminEmail(firebaseUser.email);
          
          if (isAllowed) {
            setUser(firebaseUser);
            setIsAdmin(true);
          } else {
            // Not in whitelist: sign out immediately and trigger error
            await signOut(auth!);
            setUser(null);
            setIsAdmin(false);
            setError("Akses ditolak: Email Anda tidak terdaftar sebagai administrator.");
          }
        } catch (err) {
          console.error("Error verifying admin whitelist:", err);
          await signOut(auth!);
          setUser(null);
          setIsAdmin(false);
          setError("Gagal memverifikasi hak akses administrator.");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      recoverCancelledPopup();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        recoverCancelledPopup();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearPopupFallbackTimer();
    };
  }, [clearPopupFallbackTimer, recoverCancelledPopup]);

  const loginWithGoogle = async () => {
    if (signInInProgress.current) {
      return;
    }

    setLoading(true);
    setError(null);
    if (!auth || !googleProvider) {
      setError("Firebase belum terkonfigurasi. Pastikan NEXT_PUBLIC_FIREBASE_API_KEY telah diatur di .env");
      setLoading(false);
      return;
    }

    const currentAuth = auth;
    signInInProgress.current = true;
    popupFallbackTimer.current = setTimeout(() => {
      if (!signInInProgress.current || currentAuth.currentUser) {
        return;
      }

      signInInProgress.current = false;
      popupFallbackTimer.current = null;
      setLoading(false);
      setError("Login Google tidak selesai. Silakan coba lagi.");
    }, popupFallbackTimeoutMs);

    let signInCompleted = false;

    try {
      await signInWithPopup(currentAuth, googleProvider!);
      signInCompleted = true;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError.code && cancelledSignInCodes.has(firebaseError.code)) {
        console.info("Google Sign-In dibatalkan:", firebaseError.code);
      } else if (firebaseError.code === "auth/blocked-by-popup-killer") {
        console.error("Google Sign-In Error:", err);
        setError("Popup login diblokir oleh browser. Harap izinkan popup.");
      } else {
        console.error("Google Sign-In Error:", err);
        setError(firebaseError.message || "Gagal masuk menggunakan Google.");
      }
    } finally {
      signInInProgress.current = false;
      clearPopupFallbackTimer();
      if (!signInCompleted) {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    if (!auth) {
      setError("Firebase belum terkonfigurasi.");
      setLoading(false);
      return;
    }
    try {
      await signOut(auth!);
    } catch (err: unknown) {
      console.error("Sign-Out Error:", err);
      setError("Gagal keluar dari sesi.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAdmin, 
        loginWithGoogle, 
        logout, 
        error, 
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

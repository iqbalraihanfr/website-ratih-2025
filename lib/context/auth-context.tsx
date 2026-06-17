"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!!auth);
  const [error, setError] = useState<string | null>(null);

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

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    if (!auth || !googleProvider) {
      setError("Firebase belum terkonfigurasi. Pastikan NEXT_PUBLIC_FIREBASE_API_KEY telah diatur di .env");
      setLoading(false);
      return;
    }
    try {
      await signInWithPopup(auth!, googleProvider!);
    } catch (err: unknown) {
      console.error("Google Sign-In Error:", err);
      const firebaseError = err as { code?: string; message?: string };
      // Friendly message for common errors
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Login dibatalkan oleh pengguna.");
      } else if (firebaseError.code === "auth/blocked-by-popup-killer") {
        setError("Popup login diblokir oleh browser. Harap izinkan popup.");
      } else {
        setError(firebaseError.message || "Gagal masuk menggunakan Google.");
      }
      setLoading(false);
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

  const clearError = () => setError(null);

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

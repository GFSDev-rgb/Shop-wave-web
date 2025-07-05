'use client';

import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseEnabled: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => user?.email === 'emammahadi822@gmail.com', [user]);

  const signIn = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please check your .env file.");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential;
    } catch(error) {
        console.error("Error signing in", error)
        throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please check your .env file.");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential;
    } catch(error) {
        console.error("Error signing up", error)
        throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
    // Clear guest data on sign out
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isFirebaseEnabled, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

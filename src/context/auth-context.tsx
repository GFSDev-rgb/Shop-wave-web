
'use client';

import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth, db, isFirebaseEnabled } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseEnabled: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && db) {
        const profileDocRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Profile doesn't exist for a signed-in user (e.g., first-time social login, or new user signup)
          const newProfile: UserProfile = {
            fullName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            phoneNumber: user.phoneNumber || '',
            address: '',
            bio: '',
            likes: {},
          };
          await setDoc(profileDocRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => user?.email === 'emammahadi822@gmail.com', [user]);

  const signIn = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please check your .env file.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch(error) {
        console.error("Error signing in", error);
        throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please check your .env file.");
    setLoading(true);
    try {
      // The onAuthStateChanged listener will handle creating the profile doc, this just creates the user.
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch(error) {
        console.error("Error signing up", error);
        throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user || !auth.currentUser || !db) {
      throw new Error("User not logged in or Firebase not configured.");
    }
    
    try {
      // Prepare data for Firebase Auth update (only displayName and photoURL are supported)
      const authUpdateData: { displayName?: string, photoURL?: string } = {};
      if (data.fullName !== undefined) authUpdateData.displayName = data.fullName;
      if (data.photoURL !== undefined) authUpdateData.photoURL = data.photoURL;

      // Update Firebase Auth profile
      if (Object.keys(authUpdateData).length > 0) {
        await updateFirebaseProfile(auth.currentUser, authUpdateData);
      }
      
      // Update Firestore profile document with all data
      const profileDocRef = doc(db, "profiles", user.uid);
      await setDoc(profileDocRef, data, { merge: true });

      // Optimistically update local state to reflect changes immediately
      setProfile(prev => ({...prev, ...data} as UserProfile));
      
      // Refresh user object from auth to sync local user state
      setUser(auth.currentUser);

      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
      });
      throw error;
    }
  }, [user, toast]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isFirebaseEnabled, signIn, signUp, signOut, updateProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

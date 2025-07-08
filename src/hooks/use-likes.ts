
"use client";

import { useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useProducts } from './use-products';
import { useToast } from './use-toast';
import { db, isFirebaseEnabled } from '@/lib/firebase';
import { doc, writeBatch, increment } from 'firebase/firestore';

export const useLikes = () => {
    const { user, profile, setProfile } = useAuth();
    const { products, setProducts } = useProducts();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const isLiked = useCallback((productId: string): boolean => {
        return !!profile?.likes?.[productId];
    }, [profile]);

    const toggleLike = useCallback(async (productId: string) => {
        if (!isFirebaseEnabled || !db || !user || !profile) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update like status. Please try again.',
            });
            console.error("Like toggled without user or with DB not configured.");
            return;
        }

        setLoading(true);

        const currentlyLiked = isLiked(productId);
        const likeIncrement = currentlyLiked ? -1 : 1;
        
        const originalProfileState = profile;
        const originalProductsState = products;

        // Optimistic UI updates
        const newLikesMap = { ...(profile.likes || {}) };
        if (currentlyLiked) {
            delete newLikesMap[productId];
        } else {
            newLikesMap[productId] = true;
        }

        setProfile({ ...profile, likes: newLikesMap });
        setProducts(currentProducts =>
            currentProducts.map(p =>
                p.id === productId ? { ...p, likeCount: (p.likeCount || 0) + likeIncrement } : p
            )
        );

        // Firestore update
        try {
            const batch = writeBatch(db);
            const productRef = doc(db, 'products', productId);
            const profileRef = doc(db, 'profiles', user.uid);

            batch.update(productRef, { likeCount: increment(likeIncrement) });
            batch.update(profileRef, { likes: newLikesMap });

            await batch.commit();

        } catch (error) {
            console.error("Error toggling like:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update like status. Please try again.',
            });

            // Revert optimistic updates on error
            setProfile(originalProfileState);
            setProducts(originalProductsState);
        } finally {
            setLoading(false);
        }

    }, [user, profile, products, setProducts, setProfile, isLiked, toast]);

    return { isLiked, toggleLike, loading };
};

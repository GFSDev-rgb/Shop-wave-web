
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, MapPin, Pencil, Camera, Trash2, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  photoURL: z.string().url("Invalid URL").or(z.literal("")).optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        photoURL: profile.photoURL || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
      setImagePreview(profile.photoURL || null);
    }
  }, [profile, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('photoURL', result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('photoURL', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md text-center p-6">
                <CardHeader>
                    <User className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="font-headline text-3xl">Profile Page</CardTitle>
                    <CardDescription>Please log in to view and manage your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild><Link href="/login">Go to Login</Link></Button>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
          <CardDescription>View and manage your personal information.</CardDescription>
        </CardHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={imagePreview ?? undefined} alt={profile.fullName} />
                    <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="mr-2 h-4 w-4" /> Change Photo
                    </Button>
                    {imagePreview && (
                      <Button type="button" variant="destructive" onClick={handleRemoveImage}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="Your email" {...field} readOnly disabled /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="Your phone number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="Your address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell us a little about yourself" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <>
            <CardContent className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={profile.photoURL} alt={profile.fullName} />
                  <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold">{profile.fullName || "User"}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="mt-2 text-sm max-w-prose">{profile.bio || "No bio provided."}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{profile.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                   <span>{profile.address || "Not provided"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

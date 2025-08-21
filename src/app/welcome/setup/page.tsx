
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Loader2, User, MapPin } from 'lucide-react';

const steps = [
  {
    id: 'name',
    title: 'What should we call you?',
    description: 'Please enter your full name.',
    fields: ['fullName'],
    schema: z.object({ fullName: z.string().min(2, 'Full name must be at least 2 characters.') }),
    icon: <User className="h-6 w-6" />,
  },
  {
    id: 'address',
    title: 'Where should we send your orders?',
    description: 'Please provide your primary shipping address.',
    fields: ['address', 'phoneNumber'],
    schema: z.object({
      address: z.string().min(10, 'Please enter a complete address.'),
      phoneNumber: z.string().min(5, 'Please enter a valid phone number.'),
    }),
    icon: <MapPin className="h-6 w-6" />,
  },
];

type FormValues = {
  fullName: string;
  address: string;
  phoneNumber: string;
};

export default function WelcomeSetupPage() {
  const router = useRouter();
  const { user, profile, updateProfile, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: {
      fullName: profile?.fullName || '',
      address: profile?.address || '',
      phoneNumber: profile?.phoneNumber || '',
    },
  });

  const { formState, trigger, getValues } = form;
  const { isSubmitting } = formState;

  const nextStep = async () => {
    const fields = steps[currentStep].fields as Array<keyof FormValues>;
    const output = await trigger(fields, { shouldFocus: true });
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
      await handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const handleSubmit = async () => {
    const values = getValues();
    try {
      await updateProfile(values);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  if (loading || !user) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
             {steps[currentStep].icon}
             <div>
                <CardTitle className="font-headline text-2xl">{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
             </div>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form>
              {currentStep === 0 && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Anytown, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
          <Button onClick={nextStep} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

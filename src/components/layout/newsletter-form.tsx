'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { subscribeNewsletter } from '@/app/actions/subscribe-newsletter';
import { Loader2 } from 'lucide-react';

const initialState = {
  status: '' as 'success' | 'error' | '',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[110px]">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Subscribe'}
    </Button>
  );
}

export function NewsletterForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(subscribeNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 flex gap-2">
      <Input
        type="email"
        name="email"
        placeholder="Your email"
        className="bg-black/20 border-white/20 placeholder:text-muted-foreground"
        required
      />
      <SubmitButton />
    </form>
  );
}

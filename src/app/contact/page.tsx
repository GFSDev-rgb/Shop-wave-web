
'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";

export default function ContactPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: "Login Required",
        description: "You must be logged in to send a message.",
        action: <ToastAction altText="Login" onClick={() => router.push('/login')}>Login</ToastAction>,
      });
      return;
    }
    
    // In a real app, form submission logic would go here.
    toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you shortly.",
    });
    // Optionally reset the form
    (e.target as HTMLFormElement).reset();
  };


  return (
    <div className="container mx-auto px-4 py-16 flex-1">
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Send us a Message</CardTitle>
            <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} required />
              </div>
              <Button type="submit" size="lg" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-accent" />
                <a href="mailto:support@shopwave.com" className="hover:underline">support@shopwave.com</a>
            </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-accent" />
                <span>+1 (555) 123-4567</span>
            </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-accent" />
                <span>123 Wave Street, Ocean View, 90210</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

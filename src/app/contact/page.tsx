
'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContactPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 flex-1">
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Send us a Message</CardTitle>
            <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {!user && (
                <Alert>
                  <LogIn className="h-4 w-4" />
                  <AlertTitle>Login Required</AlertTitle>
                  <AlertDescription>
                    You must be <Link href="/login" className="font-bold underline">logged in</Link> to send a message.
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" disabled={!user} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" disabled={!user} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" disabled={!user} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} disabled={!user} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={!user}>Send Message</Button>
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

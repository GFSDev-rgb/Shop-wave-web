'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

interface FormState {
    status: 'success' | 'error' | '';
    message: string;
}

export async function subscribeNewsletter(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.errors[0].message };
  }

  const email = parsed.data.email;
  const botApiKey = process.env.TELEGRAM_BOT_API_KEY;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botApiKey || !chatId || chatId === 'YOUR_TELEGRAM_CHAT_ID') {
    console.error("Telegram API Key or Chat ID is not configured.");
    // Silently succeed for the user, but log error for developer.
    // In a real app, you might want to handle this differently.
    return { status: 'success', message: "Thank you for subscribing!" };
  }

  const message = `🎉 New Newsletter Subscriber!\n\nEmail: ${email}`;

  const url = `https://api.telegram.org/bot${botApiKey}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API Error:", result.description);
      return { status: 'error', message: "Failed to subscribe. Please try again later." };
    }

    return { status: 'success', message: "Thank you for subscribing!" };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return { status: 'error', message: "An unexpected error occurred." };
  }
}

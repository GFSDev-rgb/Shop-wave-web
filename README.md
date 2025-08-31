# ShopWave: Modern E-commerce Platform

Welcome to ShopWave, a feature-rich, modern e-commerce platform built with Next.js, Firebase, and Genkit AI. This application provides a complete shopping experience, from browsing products to managing orders, and includes a full-featured admin dashboard and AI-powered recommendations.

![ShopWave Homepage](https://storage.googleapis.com/project-charm/project-charm/1723797672288.png)

## ✨ Features

### Customer Experience
- **Responsive Design:** Fully responsive layout for a seamless experience on desktop, tablet, and mobile devices.
- **Light & Dark Modes:** A beautiful and consistent theme that adapts to user preferences.
- **Product Discovery:** Browse a filterable and sortable shop page with infinite scrolling.
- **AI Recommendations:** A "Just For You" section on the homepage powered by Genkit AI.
- **Detailed Product Pages:** View product details, multiple images, sizing options, and related products.
- **User Authentication:** Secure sign-up and login with email/password or Google.
- **Personalized Profile:** Users can view and edit their profile, including contact information and a bio.
- **Shopping Cart:** A persistent cart that syncs between guest sessions and authenticated accounts.
- **Wishlist & Likes:** Save favorite products to a wishlist and "like" products to show appreciation.
- **Streamlined Checkout:** A simple, multi-step checkout process with order summary.
- **Order History:** Authenticated users can view their past orders and their status.

### Admin Dashboard
- **Admin Role:** A designated admin user with special privileges.
- **Order Management:** View all customer orders, their details, and update their status (e.g., "Pending" to "Delivered").
- **Product Management:** Admins can add, edit, and delete products directly from the UI.
- **Store Overview:** A statistics dashboard showing total revenue, order counts, and more.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) (for product recommendations and descriptions)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Deployment:** Ready for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/shopwave.git
   cd shopwave
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Firebase Setup

1. Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2. Enable the **Firestore Database** and **Firebase Authentication** (with Email/Password and Google providers).
3. Go to your Project Settings and copy the web app configuration.
4. Create a `.env` file in the root of your project and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:...
   ```
5. **(Optional) Set up an Admin User:**
   The admin user is currently hardcoded to be `emammahadi822@gmail.com`. You can change this in `src/context/auth-context.tsx` or create a user with this email to access the admin dashboard.

### Genkit AI Setup
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get a Gemini API key.
2. Add the API key to your `.env` file:
    ```env
    GEMINI_API_KEY=your-gemini-api-key
    ```

### Running the Application

1. **Run the development server:**
   ```sh
   npm run dev
   ```
2. Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The application will automatically seed the Firestore database with initial product data on its first run if the `products` collection is empty.

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="font-headline text-5xl md:text-6xl font-bold">About ShopWave</h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            We believe in the power of great design and quality craftsmanship. Our mission is to bring you a curated selection of products that inspire and elevate your everyday life.
          </p>
        </header>

        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-2xl mb-16 border border-white/10">
            <Image 
                src="https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/514417589_122134632728805080_1173047015335082163_n.jpg?stp=dst-jpg_p843x403_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CTLL4g4TTMEQ7kNvwHZrVXu&_nc_oc=AdmOXo7Q5x7H-RXcdoUhdSaE0xmoq-0E8z4ic2FomQzp43TwGUqmslLCjpUBN86V1rY&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=NbGz6uIhzU8JTJVV90E0Zg&oh=00_AfORFghBAWjanPcMzX5LcC7zXueEC92WAoFozbnhtJJwqA&oe=686DFAF5"
                alt="A modern, well-lit design workspace"
                data-ai-hint="design workspace"
                fill
                className="object-cover blur-sm"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-8 rounded-lg space-y-4">
            <h2 className="font-headline text-4xl font-bold text-primary">Our Story</h2>
            <p className="text-foreground/80">
              Founded in 2023, ShopWave started with a simple idea: to make exceptional products accessible to everyone. We were tired of the endless scroll on massive marketplaces and yearned for a shopping experience that felt personal, inspiring, and trustworthy.
            </p>
            <p className="text-foreground/80">
              We travel the globe and partner with independent artisans and ethical brands to build our collection. Each item in ShopWave is chosen for its quality, story, and style.
            </p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-8 rounded-lg space-y-4">
            <h2 className="font-headline text-4xl font-bold text-primary">Our Mission</h2>
            <p className="text-foreground/80">
              Our mission is to create a wave of conscious consumerism. We champion sustainable practices, support small businesses, and prioritize quality over quantity. We aim to be more than just a store; we want to be a community for those who appreciate the art of living well.
            </p>
            <p className="text-foreground/80">
              Thank you for joining us on this journey. We're excited to share our passion with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

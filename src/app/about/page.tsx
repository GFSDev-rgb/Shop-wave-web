import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="font-headline text-5xl md:text-6xl font-bold">About ShopWave</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We believe in the power of great design and quality craftsmanship. Our mission is to bring you a curated selection of products that inspire and elevate your everyday life.
          </p>
        </header>

        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl mb-16">
            <Image 
                src="https://i.pinimg.com/736x/a8/79/fa/a879fad4fc0fc8467602730a0b58f07a.jpg"
                alt="Our Workspace"
                data-ai-hint="creative workspace"
                layout="fill"
                objectFit="cover"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-4xl font-bold text-primary">Our Story</h2>
            <p className="mt-4 text-muted-foreground">
              Founded in 2023, ShopWave started with a simple idea: to make exceptional products accessible to everyone. We were tired of the endless scroll on massive marketplaces and yearned for a shopping experience that felt personal, inspiring, and trustworthy.
            </p>
            <p className="mt-4 text-muted-foreground">
              We travel the globe and partner with independent artisans and ethical brands to build our collection. Each item in ShopWave is chosen for its quality, story, and style.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-4xl font-bold text-primary">Our Mission</h2>
            <p className="mt-4 text-muted-foreground">
              Our mission is to create a wave of conscious consumerism. We champion sustainable practices, support small businesses, and prioritize quality over quantity. We aim to be more than just a store; we want to be a community for those who appreciate the art of living well.
            </p>
            <p className="mt-4 text-muted-foreground">
              Thank you for joining us on this journey. We're excited to share our passion with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

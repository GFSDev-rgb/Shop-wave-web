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
                src="https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/514349647_122134628744805080_5530986704383849379_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1VZz36hMxkEQ7kNvwFk9q8Y&_nc_oc=AdmNQD88QlNJbsdW1T1TmVufnkjY6N1__VQMnIKYkQSoN6VXV9a3pPDegNGD3M3c-Hw&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=X42o6_BkYhwN7G8el28l8A&oh=00_AfN3z4PnY3YZxB-6aBed0FNRW-8cgjd90Db9abN9CuyF3g&oe=686DF26E"
                alt="Fashion models"
                data-ai-hint="fashion models"
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

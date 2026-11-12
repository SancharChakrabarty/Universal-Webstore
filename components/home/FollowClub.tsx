import Image from "next/image";

const INSTAGRAM_URL = "https://www.instagram.com/mystore/";

const images = [
  "/images/homepage/banner-2.jpg",
  "/images/homepage/banner-3.jpg",
  "/images/homepage/banner-4.jpg",
  "/images/homepage/hero-banner.jpg",
  "/images/promo/promo-1.jpg",
  "/images/promo/promo-2.jpg",
];

export default function FollowClub() {
  return (
    <section className="bg-[#f0f4f9] py-16">
      <div className="shell text-center">
        <h2 className="section-heading">Follow Us</h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-primary font-semibold hover:underline"
        >
          @mystore
        </a>
      </div>

      <div className="shell mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {images.map((src) => (
          <a
            key={src}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden rounded-card"
          >
            <Image src={src} alt="My Store on Instagram" fill className="object-cover transition-transform hover:scale-105" />
          </a>
        ))}
      </div>
    </section>
  );
}

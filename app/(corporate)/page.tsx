import { Hero } from "@/components/home/Hero";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { Philosophy } from "@/components/home/Philosophy";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProduct />
      <Philosophy />
      <CTASection />
    </>
  );
}

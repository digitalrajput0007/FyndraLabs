import { Metadata } from "next";
import { products } from "@/data/products";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the ecosystem of digital products and mobile applications built by Fyndra Labs.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        badge="Product Catalog"
        title="Software & Mobile Applications"
        description="Every product we craft is engineered for utility, intuitive design, and seamless performance."
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={products} />
        </div>
      </section>

      <CTASection />
    </>
  );
}

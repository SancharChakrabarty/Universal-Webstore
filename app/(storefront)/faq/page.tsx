import PageHeader from "@/components/shop/PageHeader";
import FAQ from "@/components/home/FAQ";

export const metadata = { title: "FAQ — My Store" };

export default function FAQPage() {
  return (
    <>
      <PageHeader title="Frequently Asked Questions" crumb="FAQ" />
      <FAQ />
    </>
  );
}

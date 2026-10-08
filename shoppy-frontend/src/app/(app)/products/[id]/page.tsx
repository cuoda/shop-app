import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/features/products/product-detail";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId < 1) notFound();
  return <ProductDetailView id={productId} />;
}

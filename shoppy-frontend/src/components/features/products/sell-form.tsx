"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/hooks/use-create-product";
import { getErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/config";
import { productSchema, type ProductFormValues } from "@/lib/validators";
import { useAuth } from "@/providers/auth-provider";
import { ImageDropzone } from "./image-dropzone";
import { ProductCardBody } from "./product-card";

export function SellForm() {
  const router = useRouter();
  const { user } = useAuth();
  const create = useCreateProduct();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema), defaultValues: { name: "", description: "", price: "" } });

  const [name = "", description = "", price = ""] = useWatch({ control, name: ["name", "description", "price"] });

  function handleImage(file: File | null) {
    setImage(file);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await create.mutateAsync({ input: { name: values.name, description: values.description, price: Number(values.price) }, image });
      if (result.imageFailed) {
        toast.warning("Listed, but the photo didn't upload", { description: `${result.imageFailed}. You can add it from My listings.` });
      } else {
        toast.success("Your product is live");
      }
      router.push(routes.product(result.id));
    } catch (error) {
      toast.error("Couldn't create the listing", { description: getErrorMessage(error) });
    }
  });

  const numericPrice = Number(price);
  const previewPrice = Number.isFinite(numericPrice) ? numericPrice : 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Sell something" description="Add the details, a photo if you have one, and it goes live for everyone right away." />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <form onSubmit={onSubmit} noValidate className="glass-strong space-y-6 rounded-3xl p-6 sm:p-8">
          <FormField id="name" label="Name" error={errors.name?.message}>
            <Input id="name" placeholder="What are you selling?" maxLength={140} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          </FormField>
          <FormField id="description" label="Description" hint={`${description.length}/2000`} error={errors.description?.message}>
            <Textarea id="description" placeholder="Condition, what's included, anything a buyer should know" aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} {...register("description")} />
          </FormField>
          <FormField id="price" label="Price (USD)" error={errors.price?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input id="price" inputMode="decimal" placeholder="49.99" className="pl-8" aria-invalid={!!errors.price} aria-describedby={errors.price ? "price-error" : undefined} {...register("price")} />
            </div>
          </FormField>
          <div className="space-y-2">
            <span className="text-sm font-medium">Photo</span>
            <ImageDropzone file={image} onChange={handleImage} />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={create.isPending}>
            {create.isPending && <Loader2 className="animate-spin" />}
            {create.isPending ? (image ? "Publishing and uploading photo" : "Publishing") : "Publish listing"}
          </Button>
        </form>

        <aside className="space-y-3 lg:sticky lg:top-28" aria-label="Listing preview">
          <p className="text-sm font-medium text-muted-foreground">How buyers will see it</p>
          {user && <ProductCardBody product={{ id: 0, name: name.trim() || "Your product name", price: previewPrice, sold: false, imageUrl: previewUrl, user }} />}
        </aside>
      </div>
    </div>
  );
}

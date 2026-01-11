import { ReactNode } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return {
        title: "Category",
        description: "Browse event vendors by category",
      };
    }

    const title = category.metaTitle || `${category.name} | EVA Marketplace`;
    const description =
      category.metaDescription ||
      category.description ||
      `Explore ${category.name.toLowerCase()} vendors`;

    const image =
      category.coverImage ||
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=600&fit=crop";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://evalocal.com/categories/${slug}`,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `/categories/${slug}`,
      },
    };
  } catch {
    return {
      title: "Category",
      description: "Browse event vendors by category",
    };
  }
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}

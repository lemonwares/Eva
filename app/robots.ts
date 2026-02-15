import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://evalocal.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/vendor/",
          "/settings/",
          "/auth/",
          "/profile/",
          "/payment/",
          "/favorites/",
          "/offline/",
          "/generated/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

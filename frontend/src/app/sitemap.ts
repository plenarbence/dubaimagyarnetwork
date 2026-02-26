import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dubaimagyarnetwork.com"

  // ======================================================
  // 1️⃣ STATIKUS OLDALAK
  // ======================================================
  const staticPages = [
    "",
    "/services",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ]

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  // ======================================================
  // 2️⃣ KATEGÓRIA OLDALAK (slug alapján)
  // ======================================================
  let categoryUrls: MetadataRoute.Sitemap = []

  try {
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/sitemap/category-slugs`,
      { cache: "no-store" }
    )

    if (categoryRes.ok) {
      const slugs: string[] = await categoryRes.json()

      categoryUrls = slugs.map((slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    }
  } catch {
    categoryUrls = []
  }

  // ======================================================
  // 3️⃣ LISTING OLDALAK (id alapján)
  // ======================================================
  let listingUrls: MetadataRoute.Sitemap = []

  try {
    const listingRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/sitemap/listing-ids`,
      { cache: "no-store" }
    )

    if (listingRes.ok) {
      const ids: number[] = await listingRes.json()

      listingUrls = ids.map((id) => ({
        url: `${baseUrl}/services/service/${id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    }
  } catch {
    listingUrls = []
  }

  // ======================================================
  return [
    ...staticUrls,
    ...categoryUrls,
    ...listingUrls,
  ]
}
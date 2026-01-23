import { notFound } from "next/navigation";
import SubServiceClient from "../components/SubServiceClient";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CategorySEO = {
  id: number;
  name: string;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_h1?: string | null;
  seo_intro?: string | null;
};

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

async function getCategory(slug: string): Promise<CategorySEO | null> {
  const res = await fetch(
    `${API_URL}/categories/public/slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

/* --------------------------------------------------
   SEO METADATA (csak ha DB-ben meg van adva)
-------------------------------------------------- */
export async function generateMetadata(props: PageProps) {
  const { categorySlug } = await props.params;
  const category = await getCategory(categorySlug);

  // nincs SEO adat → NOINDEX
  if (
    !category ||
    !category.seo_title ||
    !category.seo_description
  ) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: category.seo_title,
    description: category.seo_description,
  };
}

/* --------------------------------------------------
   PAGE
-------------------------------------------------- */
export default async function CategorySlugPage(props: PageProps) {
  const { categorySlug } = await props.params;
  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {category.seo_h1 && (
        <h1 className="text-2xl font-semibold">
          {category.seo_h1}
        </h1>
      )}

      {category.seo_intro && (
        <p className="mt-2 text-sm text-gray-600 max-w-4xl">
          {category.seo_intro}
        </p>
      )}

      {/* ide jön majd a ServicesClient category_id-val */}
      <SubServiceClient mainCategoryId={category.id} />
    </div>
  );
}

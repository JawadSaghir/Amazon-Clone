import Link from "next/link";
import { notFound } from "next/navigation";

import { getInfoPage, infoPages } from "@/lib/info-pages";

type InfoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }));
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const page = getInfoPage(slug);

  if (!page) notFound();

  return (
    <main className="page-shell py-8">
      <section className="bg-white p-8 shadow-panel">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">{page.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black text-coal">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-coal/75">{page.body}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {page.bullets.map((bullet) => (
            <div key={bullet} className="border border-[#d5d9d9] bg-[#f7fafa] p-4 font-bold">
              {bullet}
            </div>
          ))}
        </div>
        <Link href="/" className="brass-button mt-8">
          Continue shopping
        </Link>
      </section>
    </main>
  );
}

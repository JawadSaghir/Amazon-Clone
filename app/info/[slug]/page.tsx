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
    <main className="page-shell px-4 py-8 sm:px-8">
      <section className="card p-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-basil">{page.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-coal">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-inkSoft">{page.body}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {page.bullets.map((bullet) => (
            <div key={bullet} className="rounded-xl border border-line bg-paper p-4 font-semibold text-coal">
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

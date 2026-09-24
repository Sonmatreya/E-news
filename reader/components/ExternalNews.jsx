import Link from "next/link";
import { base_api_url } from "@/config/config";

const ExternalNews = async ({ category = "general", title = "External News" }) => {
  let articles = [];

  try {
    const response = await fetch(
      `${base_api_url}/api/external-news?category=${encodeURIComponent(category)}&country=in&lang=en&max=6`,
      {
        next: {
          revalidate: 900,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      articles = data.articles || [];
    }
  } catch (error) {
    console.error("Failed to fetch external news:", error);
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-500">Powered by GNews</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, index) => (
          <article
            key={article.url || index}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200"
          >
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-500">
                No image
              </div>
            )}

            <div className="p-4">
              <p className="text-xs font-semibold text-red-600 mb-2">
                {article.source?.name || "External source"}
              </p>

              <h3 className="font-bold text-lg leading-snug text-slate-900">
                {article.title}
              </h3>

              {article.description && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {article.description}
                </p>
              )}

              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm font-semibold text-red-600 hover:underline"
              >
                Read Original →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ExternalNews;

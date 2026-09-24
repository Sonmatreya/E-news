import HeadLines from "@/components/HeadLines";
import Title from "@/components/Title";
import DetailsNews from "@/components/news/DetailsNews";
import DetailsNewsCol from "@/components/news/DetailsNewsCol";
import DetailsNewsRow from "@/components/news/DetailsNewsRow";
import LatestNews from "@/components/news/LatestNews";
import PopularNews from "@/components/news/PopularNews";
import SimpleNewsCard from "@/components/news/items/SimpleNewsCard";
import NewsCard from "@/components/news/items/NewsCard";
import Footer from "@/components/Footer";
import { base_api_url } from "@/config/config";

export const dynamic = 'force-dynamic';

const Home = async () => {
  let news = {};
  let categoryNames = [];

  try {
    const [newsResponse, categoryResponse] = await Promise.all([
      fetch(base_api_url + "/api/all/news", {
        next: {
          revalidate: 5,
        },
      }),
      fetch(base_api_url + "/api/categories/active", {
        next: {
          revalidate: 5,
        },
      }),
    ]);

    const data = await newsResponse.json();
    const categoryData = await categoryResponse.json();

    news = data.news || {};
    categoryNames = (categoryData.categories || [])
      .map((category) => category.name)
      .filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
  }

  // Keep the homepage layout working even if the category API is temporarily unavailable.
  if (categoryNames.length === 0) {
    categoryNames = Object.keys(news);
  }

  const getCategory = (index) => categoryNames[index] || '';
  const getCategoryNews = (index) => news[getCategory(index)] || [];

  return (
    <div>
      <main>
        <HeadLines news={news} />
        <div className="bg-slate-100">
          <div className="px-4 md:px-8 py-8">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12">
                <LatestNews news={getCategoryNews(0)} />
              </div>
              <div className="w-full lg:w-6/12 mt-5 lg:mt-0">
                <div className="flex w-full flex-col gap-y-[14px] pl-0 lg:pl-2">
                  <Title title={getCategory(1)} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                    {getCategoryNews(1).map((item, i) => (
                      i < 4 ? <SimpleNewsCard item={item} key={i} /> : null
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <PopularNews type="Popular news" />

            {/* first section */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <DetailsNewsRow
                    news={getCategoryNews(2)}
                    category={getCategory(2)}
                    type="details-news"
                  />
                  <DetailsNews
                    news={getCategoryNews(3)}
                    category={getCategory(3)}
                  />
                </div>
                <div className="w-full lg:w-4/12">
                  <DetailsNewsCol
                    news={getCategoryNews(0)}
                    category={getCategory(0)}
                  />
                </div>
              </div>
            </div>

            {/* 2nd section */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-4/12">
                  <div className="pr-2">
                    <DetailsNewsCol
                      news={getCategoryNews(1)}
                      category={getCategory(1)}
                      type="details-news-col"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-8/12">
                  <div className="pl-2">
                    <DetailsNewsRow
                      news={getCategoryNews(4)}
                      category={getCategory(4)}
                      type="details-news"
                    />
                    <DetailsNewsRow
                      news={getCategoryNews(5)}
                      category={getCategory(5)}
                      type="details-news"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd section */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <div>
                    <DetailsNewsRow
                      news={getCategoryNews(3)}
                      category={getCategory(3)}
                      type="details-news"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12">
                  <div className="pl-2">
                    <Title title="Recent news" />
                    <div className="grid grid-cols-1 gap-y-[14px] mt-4">
                      {getCategoryNews(2).map((item, i) => (
                        <NewsCard item={item} key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

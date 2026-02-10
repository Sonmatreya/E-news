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

  try {
    const news_data = await fetch(`${base_api_url}/api/all/news`, {
      next: {
        revalidate: 5,
      },
    });

    const data = await news_data?.json();
    news = data.news || {};
  } catch (error) {
    console.error('Failed to fetch news:', error);
  }

  // Initialize default empty arrays for categories to prevent undefined errors
  const defaultCategories = {
    Education: [],
    Technology: [],
    Travel: [],
    Sports: [],
    Health: [],
    Politics: [],
  };
  news = { ...defaultCategories, ...news };
  
  return (
    <div>
      <main>
        <HeadLines news={news} />
        <div className="bg-slate-100">
          <div className="px-4 md:px-8 py-8">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12">
                <LatestNews news={news["Education"]} />
              </div>
              <div className="w-full lg:w-6/12 mt-5 lg:mt-0">
                <div className="flex w-full flex-col gap-y-[14px] pl-0 lg:pl-2">
                  <Title title="Technology" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                    {news["Technology"].map((item, i) => {
                      if (i < 4) {
                        return <SimpleNewsCard item={item} key={i} />;
                      }
                    })}
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
                    news={news["Sports"]}
                    category="Sports"
                    type="details-news"
                  />
                  <DetailsNews news={news["Health"]}
                    category="Health"  />
                </div>
                <div className="w-full lg:w-4/12">
                  <DetailsNewsCol
                    news={news["Education"]}
                    category="Education"
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
                      news={news["Technology"]}
                      category="Technology"
                      type="details-news-col"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-8/12">
                  <div className="pl-2">
                    <DetailsNewsRow
                      news={news["Travel"]}
                      category="Travel"
                      type="details-news"
                    />
                    <DetailsNewsRow
                      news={news["Politics"]}
                      category="Politics"
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
                      news={news["Health"]}
                      category="Health"
                      type="details-news"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12">
                  <div className="pl-2">
                    <Title title="Recent news" />
                    <div className="grid grid-cols-1 gap-y-[14px] mt-4">
                      {news['Sports'].map((item, i) => (
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

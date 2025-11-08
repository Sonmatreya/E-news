import React from "react";
import Title from "../Title";
import SimpleDetailsNewCard from "./items/SimpleDetailsNewCard";
import NewsCard from "./items/NewsCard";

const DetailsNewsRow = ({ news, category, type }) => {
  if (!news || news.length === 0) {
    return (
      <div className="w-full flex flex-col gap-[14px] pr-2">
        <Title title={category} />
        <div className="text-gray-500">No news available in this category.</div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-[14px] pr-2">
      <Title title={category} />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        <SimpleDetailsNewCard news={news[0]} type={type} height={300} />
        <div className="grid grid-cols-1 gap-y-3">
          {news.slice(1).map((item, i) => {
            if (i < 3) {
              return <NewsCard item={item} key={item._id || i} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailsNewsRow;

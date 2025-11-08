'use client'
import React from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";
import Category from "./Category";
import { FaFacebookF } from "react-icons/fa";
import { AiFillYoutube, AiOutlineTwitter } from "react-icons/ai";
import { BsArrowUp } from "react-icons/bs";
import Gallery from "./news/Gallery";
import RecentNewsFooter from "./news/RecentNewsFooter";

const Footer = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1919]">
        <div className="px-4 md:px-8 py-10 w-full gap-12 grid lg:grid-cols-4 grid-cols-1">
          <div className="w-full">
            <div className="w-full flex flex-col gap-y-[14px]">
              <Image
                className=""
                width={200}
                height={100}
                style={{ width: 'auto', height: 'auto' }}
                src={logo}
                alt="logo"
              />
              <h2 className="text-slate-300">News-Bullet is a dynamic and independent digital news portal committed to delivering fast, factual, and unbiased journalism. We aim to empower readers with accurate information across every major category — from politics and international affairs to technology, sports, and entertainment.
              </h2>
              <h2 className="text-slate-300">
                We believe that trustworthy journalism plays a vital role in shaping an aware and responsible society. At News-Bullet, our mission is simple — to make news accessible, meaningful, and transparent for everyone. Whether you’re browsing on desktop or mobile, stay connected with News-Bullet for real-time updates and reliable insights.
              </h2>
            </div>
          </div>
          <Gallery />
          <div>
            <Category categories={[]} titleStyle="text-white" />
          </div>
          <RecentNewsFooter />
        </div>
      </div>
      <div className="bg-[#262323]">
        <div className="px-4 md:px-8 py-5 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="flex gap-y-2 text-gray-400 justify-start items-center">
            <span>© 2025 NewsBullet—All Rights Reserved.</span>
          </div>
          <div className="flex gap-x-[4px] items-center">
            <div className="flex gap-x-[4px]">
              <a
                className="w-[37px] text-red-500 h-[35px] flex justify-center items-center bg-[#ffffff2b]"
                href="#"
              >
                <FaFacebookF />
              </a>
              <a
                className="w-[37px] text-red-500 h-[35px] flex justify-center items-center bg-[#ffffff2b]"
                href="#"
              >
                <AiOutlineTwitter />
              </a>
              <a
                className="w-[37px] text-red-500 h-[35px] flex justify-center items-center bg-[#ffffff2b]"
                href="#"
              >
                <AiFillYoutube />
              </a>
            </div>
            <div className="ml-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-[37px] text-red-500 h-[35px] flex justify-center items-center bg-[#ffffff2b] hover:bg-[#ffffff4b] transition-all duration-300 cursor-pointer rounded-full shadow-lg hover:shadow-xl transform hover:scale-110"
                title="Back to top"
                fdprocessedid="back-to-top"
              >
                <BsArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

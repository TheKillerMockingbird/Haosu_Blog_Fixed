"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { assets } from "@/Assets/assets";
import Footer from "@/Components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const { id } = useParams(); // ✅ Grabs the [id] from the URL
  const [data, setData] = useState(null);

  // ✅ Fetch blog data from the API
  const fetchBlogData = async () => {
    try {
      const response = await axios.get("/api/blog", {
        params: { id }, // ?id=<id>
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  useEffect(() => {
    if (id) fetchBlogData();
  }, [id]);

  if (!data) return null; // or show a spinner if you want

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <Image
              src={assets.Dealers_Codex_Logo}
              width={180}
              alt="Site Logo"
              className="w-[130px] sm:w-auto"
            />
          </Link>
          <a href="mailto:thegamemasterofhaosu@gmail.com">
  <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
    Contact Me, If You Care To Make A Deal <Image src={assets.arrow} alt="Arrow" />
  </button>
</a>

        </div>

        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <Image
            src={data.authorImg}
            width={60}
            height={60}
            alt=""
            className="mx-auto mt-6 border border-white rounded-full"
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>

      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image
          className="border-4 border-white"
          src={data.image}
          width={1280}
          height={720}
          alt=""
        />
        <div className="blog-content" dangerouslySetInnerHTML={{__html:data.description}}></div>

        <div className="my-25">
          <p className="text-black font-semibold my-4">Share this I guess</p>
          <div className="flex">
            <Image src={assets.facebook_icon} width={50} alt="" />
            <Image src={assets.twitter_icon} width={50} alt="" />
            <Image src={assets.googleplus_icon} width={50} alt="" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

"use client";

import Image from "next/image";
import { FiMapPin, FiUserCheck } from "react-icons/fi";
import { GoZap } from "react-icons/go";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-14 lg:px-16 pt-5 font-[Outfit]">
      

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          {t("header").split(" ")[0]} <span className="text-gray-900 dark:text-white font-bold tracking-tight">{t("header").split(" ").slice(1).join(" ")}</span>
        </h1>
        <div className="h-1.5 w-16 bg-[#5F6FFF] mt-3 mx-auto rounded-full"></div>

      </div>

      {/* Hero Section */}
      <div className="my12 px-1 flex flex-col md:flex-row gap-5 lg:gap-13 items-center md:items-stretch justify-center">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-2/5 relative h-75 sm:h-100 md:h-auto min-h-100 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
          <Image
            src="/images/about_image.png"
            alt={t("imageAlt")}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="flex flex-col justify-center gap-6 md:w-3/5 text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed font-normal">
          <p>{t("heroText1")}</p>
          <p>{t("heroText2")}</p>
          
          <div className="pt-1">
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3">{t("visionTitle")}</h3>
            <p>{t("visionText")}</p>
          </div>
        </div>

      </div>

      {/* Why Choose Us Section */}
      <div className="mt-28 mb-20">

        <div className="flex flex-col items-center md:items-start mb-12">
          <div className="text-2xl sm:text-3xl font-light text-gray-500 dark:text-gray-400 tracking-wide">
            {t("whyChoose")}
          </div>
          <div className="h-1 w-20 bg-[#5F6FFF] mt-2 rounded-full"></div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Efficiency Card */}
          <div className="relative group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-10 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(95,111,255,0.3)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5F6FFF]/15 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#5F6FFF] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500">
                <GoZap className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">{t("features.efficiencyTitle")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {t("features.efficiencyText")}
              </p>
            </div>
          </div>

          {/* Convenience Card */}
          <div className="relative group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-10 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(95,111,255,0.3)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5F6FFF]/15 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#5F6FFF] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500">
                <FiMapPin className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">{t("features.convenienceTitle")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {t("features.convenienceText")}
              </p>
            </div>
          </div>

          {/* Personalization Card */}
          <div className="relative group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-10 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(95,111,255,0.3)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5F6FFF]/15 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#5F6FFF] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500">
                <FiUserCheck className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">{t("features.personalizationTitle")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {t("features.personalizationText")}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
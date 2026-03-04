"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { FaStethoscope } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  const locale = useLocale()

  return (
    // <div className="w-[90%] mx-auto  my-6">
    <div className="w-[89.5%] mx-auto px0.5  my-6 ">
      <div
        className="flex flex-col lg:flex-row items-center
        bg-linear-to-br from-[#5F6FFF] to-[#4757e8] 
        dark:from-[#1b2542] dark:to-[#161f33]
        rounded-2xl overflow-hidden 
        shadow-xl dark:shadow-2xl dark:shadow-indigo-900/20
        px-6 sm:px-10 lg:px-14 xl:px-14 py-10 lg:py-0 gap-8 lg:gap-0
        borde border-transparent dark:border-slate-600/50"
      >
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center gap-5 lg:py-14 text-center lg:text-left">
          
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 
            bg-white/20 dark:bg-slate-800/30 
            dark:border dark:border-slate-500/40
            text-white dark:text-indigo-300 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm"
          >
            <FaStethoscope className="w-3 h-3 sm:w-4 sm:h-4 text-white dark:text-indigo-400" />
            {t("trusted_platform")}
          </span>


          {/* Heading */}
<h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight flex flex-col
    ${locale === "ar" ? "lg:text-right text-center" : "lg:text-left text-center"}
`}>
  <span>{t("book_appointment")}</span>
  <span className="text-blue-200 dark:text-indigo-400/80">
    {t("with_trusted_doctors")}
  </span>
</h1>


          {/* Description */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-white/85 dark:text-slate-200/90 text-sm sm:text-base font-medium max-w-sm lg:max-w-md">
            <Image
              className="w-20 sm:w-24 shrink-0 filter dark:opacity-90 dark:contrast-125"
              src="/images/group_profiles.png"
              alt={t("doctors_group")}
              width={96}
              height={96}
            />
            <p>{t("meet_doctors_description")}</p>
          </div>

          {/* CTA Button */}
          <a
            href="#specialties"
            onClick={(e) => {
    e.preventDefault();
    document.getElementById('specialties')?.scrollIntoView({
      behavior: 'smooth' // حركة النزول تكون ناعمة
    });
  }}
  
            className="flex items-center gap-2.5 px-7 py-3 rounded-full 
              text-[#4757e8] dark:text-indigo-50
              bg-white dark:bg-indigo-500/80
              font-semibold text-sm sm:text-base mt-2 
              shadow-lg dark:shadow-indigo-500/20
              hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300"
          >
            {t("book_appointment_cta")}
            <FaArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Stats */}
          <div className="flex items-center gap-6 sm:gap-8 mt-2 text-white/90">
            <div className="text-center lg:text-left">
              <p className="text-xl sm:text-2xl font-bold">30+</p>
              <p className={`text-xs sm:text-sm text-white/60 dark:text-slate-300 font-light ${locale === "ar" ? "text-center" : "text-left"}`}>
                {t("years_exp")}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20 dark:bg-slate-600" />
            <div className="text-center lg:text-left">
              <p className="text-xl sm:text-2xl font-bold">15+</p>
              <p className={`text-xs sm:text-sm text-white/60 dark:text-slate-300 font-light ${locale === "ar" ? "text-center" : "text-left"} `}>
                {t("locations")}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20 dark:bg-slate-600" />
            <div className="text-center lg:text-left">
              <p className="text-xl sm:text-2xl font-bold">100%</p>
              <p className={`text-xs sm:text-sm text-white/60 dark:text-slate-300 font-light ${locale === "ar" ? "text-center" : "text-left"}`}>
                {t("satisfaction")}
              </p>
            </div>
          </div>

        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-end self-end">
          <Image
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto object-contain 
              drop-shadow-2xl dark:drop-shadow-[0_10px_30px_rgba(30,41,59,0.5)]
              dark:brightness-95"
            src="/images/header_img.png"
            alt={t("hero_image_alt")}
            width={600}
            height={450}
            priority
          />
        </div>
        
      </div>
    </div>
  );
}
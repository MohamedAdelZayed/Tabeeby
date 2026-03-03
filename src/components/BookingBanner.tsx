"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function BookingBanner() {

  const t = useTranslations("BookingBanner");
  const locale = useLocale();

  const isRTL = locale === "ar";

  return (
    <div className="my-10 sm:my-16 flex justify-center px-4 dark:bg-transparent">
      
      <div
        className="relative w-[97%] sm:w-[85%] bg-[#5F6FFF] bg-linear-to-b from-[#5464f0] dark:from-[#243466] dark:to-[#1b2846] rounded-2xl overflow-hidden flex items-center"
        style={{ minHeight: "clamp(200px, 35vw, 380px)" }}
      >

        {/* Background decorative circles */}
        <div className={`absolute -top-16 ${isRTL ? "-left-16" : "-right-16"} w-72 h-72 bg-white/20 dark:bg-white/10 rounded-full`} />
        <div className={`absolute -bottom-20 ${isRTL ? "left-32" : "right-32"} w-56 h-56 bg-white/20 dark:bg-white/10 rounded-full`} />

        {/* Text Content */}
        <div className={`relative z-10 w-[55%] py-8 sm:py-12 ${isRTL ? "pr-3.5 sm:pr-8 lg:pr-14 text-right" : "pl-3.5 sm:pl-8 lg:pl-14 text-left"}`}>

          <h2
            className="font-bold text-white leading-tight mb-4 sm:mb-6"
            style={{ fontSize: "clamp(1.1rem, 3.5vw, 3rem)" }}
          >
            {t("titleLine1")} <br />
            {t("titleLine2")} <br />
            {t("titleLine3")}
          </h2>

          <Link
            href={`/${locale}/doctors`}
            className="inline-block bg-white text-[#5F6FFF] font-medium px-5 sm:px-7 py-2 sm:py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
            style={{ fontSize: "clamp(0.7rem, 1.5vw, 1rem)" }}
          >
            {t("button")}
          </Link>
        </div>

        {/* Doctor Image */}
        <div className={`absolute bottom-0 w-[45%] h-full ${isRTL ? "left-0" : "right-0"}`}>
          <Image
            src="/images/appointment_img.png"
            alt="Doctor"
            fill
            className={`object-contain object-bottom  ${locale === "ar" ? "scale-x-[-1]" : ""} `}
            priority
          />
        </div>

      </div>

    </div>
  );
}
"use client";

import Image from "next/image";
import { doctorType } from "../lib/types";
import { useTranslations } from "next-intl";

export default function DoctorCard({ doctor } : {doctor : doctorType} ) {

    const t = useTranslations("Doctors");


  
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer
                    bg-white dark:bg-[#1A243A] border border-gray-100 dark:border-[#2A3B5A]">
      
      {/* Image */}
      <div className="relative h-48 bg-[#EEF0FF] dark:bg-[#162032]">
        {/* 192335 */}
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Availability */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-xs font-medium ${doctor.available ? 'text-green-500' : 'text-red-500'}`}>
            {doctor.available ? t("available") : t("notAvailable")}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight
                       group-hover:text-[#5F6FFF] group-hover:dark:text-blue-400 transition-colors">
          {doctor.name}
        </h3>

        {/* Specialty */}
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 group-hover:dark:text-gray-300">
          {t(`specialties.${doctor.specialty}`)}
        </p>
      </div>
    </div>
  );
}
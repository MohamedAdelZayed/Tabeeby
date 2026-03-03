"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/redux/store";
import { fetchSpecialties } from "../lib/redux/slices/specialitiesSlice";
import { useTranslations } from "next-intl";


export default function Specialties() {

  const dispatch = useDispatch<AppDispatch>();
  const { data : specialties } = useSelector( (state: RootState) => state.specialties );

  const t = useTranslations("Doctors");


  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <section id="specialties" className="py-12 px-4 dark:bg-transparent scroll-mt-20" >
      <div className="max-w-6xl mx-auto ">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
            {/* Find by Speciality */}
             {t("title")}
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            {/* Browse our trusted doctors by specialty and book your appointment easily and quickly. */}
            {t("description")}
          </p>

        </div>

        {/* Specialties Grid */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">

          {specialties?.map((specialty, index) => (
            
            <Link
              key={specialty.id}
              href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
              className="flex flex-col items-center gap-3 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
            
              {/* specialty Image */}
              <div className="rounded-full bg-[#EEF0FF] dark:bg-[#1f2937] flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Image src={specialty.icon} width={80} height={80} alt={specialty.name} />
              </div>

              {/* specialty Label */}
              <span className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium group-hover:text-primary transition-colors duration-200 max-w[80px]">
                {t(`specialties.${specialty.name}`)}
              </span>
            
            </Link>

          ))}

        </div>
        
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import DoctorCard from "./DoctorCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/redux/store";
import { fetchDoctors } from "../lib/redux/slices/doctorsSlice";
import { useLocale, useTranslations } from "next-intl";

export default function TopDoctors() {

  const { data: doctors } = useSelector((state: RootState) => state.doctors)

  const dispatch = useDispatch<AppDispatch>();

  const topDoctors = doctors.slice(0, 9)

  const locale = useLocale();

  const t = useTranslations("Doctors");

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  return (
    <section className="py-20 px-4 bg-linear-to-b from-white to-blue-50/40  dark:from-[#1A243A] dark:to-[#1A243A]">
      
      <div className="px-1.5 sm:px-6 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
            {t("topTitle")}
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            {t("topDescription")}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-14">
          {topDoctors.map((doctor) => (
            <Link
              href={`/${locale}/doctorProfile/${doctor.id}`}
              key={doctor.id}
              className="animate-slide-up"
              style={{
                animationDelay: `${(doctor.id % 5) * 0.08}s`,
                animationFillMode: "forwards",
              }}
            >
              <DoctorCard doctor={doctor} />
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-12">
          <Link
            href={`/${locale}/doctors`}
            
            className="px-10 py-3 rounded-full border border-[#5F6FFF] text-[#5F6FFF] dark:border-[#5F6FFF] dark:text-[#5F6FFF] text-sm font-medium hover:bg-[#5F6FFF] hover:text-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>

      </div>
    </section>
  );
}
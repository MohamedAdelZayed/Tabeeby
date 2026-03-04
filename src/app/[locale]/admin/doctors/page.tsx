"use client"

import DoctorCard from "@/src/components/DoctorCard";
import { fetchDoctors } from "@/src/lib/redux/slices/doctorsSlice";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DoctorsList() {

  const { data: doctors, loading } = useSelector((state: RootState) => state.doctors);
  const dispatch = useDispatch<AppDispatch>();

  const locale = useLocale()

  const t = useTranslations("DoctorsList");

  // fetch عند أول تحميل
  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  return (
    <div className="px-2 py-5 bg-gray-50 dark:bg-slate-900 min-h-screen">

  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{t("title")}</h1>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300 font-medium">
        {t("description")}
      </p>
    </div>
    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
      {
         locale === "en" 
          ? `${t("total")} ${doctors.length}` 
          : `${t("total")} ${doctors.length}`
      }
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    
    {doctors.length > 0 ? (
      doctors.map((doc) => (
        <Link
          href={`/doctorProfile/${doc.id}`}
          key={doc.id}
          className="block hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <DoctorCard doctor={doc} />
        </Link>
      ))
    ) : (
      /* حالة التحميل أو عدم وجود بيانات */
      <div className="col-span-full py-20 text-center">
        {loading ? (
           <p className="text-gray-400 dark:text-gray-500 animate-pulse">{t("loading")}</p>
        ) : (
           <p className="text-gray-400 dark:text-gray-500">{t("noDoctors")}</p>
        )}
      </div>
    )}
  </div>
</div>
  );
}
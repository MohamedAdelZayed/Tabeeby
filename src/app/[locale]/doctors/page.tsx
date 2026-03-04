"use client";

import DoctorCard from "@/src/components/DoctorCard";
import { useEffect, useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import { ImSpinner9 } from "react-icons/im";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { fetchDoctors } from "@/src/lib/redux/slices/doctorsSlice";
import { fetchSpecialties } from "@/src/lib/redux/slices/specialitiesSlice";
import { useLocale, useTranslations } from "next-intl";


export default function DoctorsPage() {

  const [showFilters, setShowFilters] = useState(false);


  const searchParams = useSearchParams()

  const specialty = searchParams.get("specialty");

  const selectedSpec = specialty || "AllSpecialties";


  const router = useRouter()


  const {data : doctors , loading } = useSelector( (state : RootState) => state.doctors )

  const { data : specialties } = useSelector( (state: RootState) => state.specialties );

  const dispatch = useDispatch<AppDispatch>();

  const t = useTranslations("Doctors");

  const locale = useLocale();

  // fetch عند أول تحميل
 useEffect(() => {
  if (doctors.length === 0) {
    dispatch(fetchDoctors());
  }
}, [dispatch, doctors.length]);


useEffect(() => {
  if (specialties.length === 0) {
    dispatch(fetchSpecialties());
  }
}, [dispatch, specialties.length]);




  const filteredDoctors = 
      selectedSpec === "AllSpecialties"
      ? doctors
      : doctors.filter( (doctor) =>  doctor.specialty?.toLowerCase() === selectedSpec.toLowerCase() )




  if (loading) {

    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <ImSpinner9 className="animate-spin text-[#5F6FFF] text-3xl" />
      </div>
    );
  }

    return (
    <div className="px-6 sm:px-16 py-6 sm:py-8 dark:bg-transparent ">

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {showFilters ? (
            <>
              <IoCloseOutline className="w-4 h-4" /> {t("closeFilters")}
            </>
          ) : (
            <>
              <LuSlidersHorizontal className="w-4 h-4" /> {t("filters")}
            </>
          )}
        </button>

        {showFilters && (
          <ul className="mt-3 flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800 shadow-sm">
            <li>
              <button
                onClick={() => router.push(`/${locale}/doctors`)}
                className={`w-full px-4 py-2.5 cursor-pointer rounded-lg text-sm border border-gray-300 dark:border-gray-700 ${
                  selectedSpec === "AllSpecialties"
                    ? "bg-[#5F6FFF] text-white"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
                
                ${locale === "ar" ? "text-right" : "text-left"}

                `}
              >
                {t("allSpecialties")}
              </button>
            </li>
            {specialties.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => router.push(`/${locale}/doctors?specialty=${s.name}`)}
                  className={`w-full px-4 py-2.5 cursor-pointer rounded-lg text-sm border border-gray-300 dark:border-gray-700 ${
                    selectedSpec === s.name
                      ? "bg-[#5F6FFF] text-white"
                      : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                  
                   ${locale === "ar" ? "text-right" : "text-left"}
                  
                  `}
                >
                  {t(`specialties.${s.name}`)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

        {/* Sidebar */}
        <aside className="hidden md:block w-52 lg:w-56 shrink-0">
          <h2 className="font-semibold text-gray-600 dark:text-gray-300 mb-4 text-sm">
            {t("browseBySpecialties")}
          </h2>

          <ul className="flex flex-col gap-2.5">
            <li>
              <button
                onClick={() => router.push(`/${locale}/doctors`)}
                className={`w-full px-4 py-2.5 cursor-pointer rounded-lg text-sm border border-gray-300 dark:border-gray-700 ${
                  selectedSpec === "AllSpecialties"
                    ? "bg-[#5F6FFF] text-white"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
                
                ${locale === "ar" ? "text-right" : "text-left"}`}
                
              >
                {t("allSpecialties")}
              </button>
            </li>
            {specialties.map((s) => (
              <li key={s.id}>

                <button
  onClick={() => router.push(`/${locale}/doctors?specialty=${s.name}`)}
  className={`w-full px-4 py-2.5 cursor-pointer rounded-lg text-sm border border-gray-300 dark:border-gray-700 
    ${selectedSpec === s.name ? "bg-[#5F6FFF] text-white" : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}
    ${locale === "ar" ? "text-right" : "text-left"}`}
>
  {t(`specialties.${s.name}`)}
</button>


              </li>
            ))}
          </ul>
        </aside>

        {/* Doctors Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {filteredDoctors.length} {t("doctorsFound")}
            </span>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredDoctors.map((doctor) => (
                <Link key={doctor.id} href={`/${locale}/doctorProfile/${doctor.id}`}>
                  <DoctorCard doctor={doctor} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 dark:text-gray-500">{t("noDoctorsFound")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

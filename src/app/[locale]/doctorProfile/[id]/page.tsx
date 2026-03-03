

import Image from 'next/image';
import { HiCheckBadge } from "react-icons/hi2";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { supabase } from '@/src/lib/supabaseClient';
import { doctorType } from '@/src/lib/types';
import { CiLocationOn } from "react-icons/ci";
import BookingSlots from '@/src/components/BookingSlots';
// استيراد دالة الترجمة للمكونات السيرفر
import { getTranslations } from "next-intl/server";

type ParamsType = {
  id: string,
  locale: string
}

export default async function DoctorProfile(props: { params: ParamsType }) {
  
 // 1. فك الـ params للحصول على الـ id واللغة
  const { id, locale } = await props.params;

  // 2. تفعيل الترجمة مع تمرير الـ locale يدوياً لضمان عدم حدوث 404
  const t = await getTranslations({ locale, namespace: "doctorProfile" });
  const tDoctors = await getTranslations({ locale, namespace: "Doctors" });


  async function getDoctorById() {
    const res = await supabase
      .from("doctors")
      .select("*")
      .eq("id", id)
      .single();

    return res.data
  }

  const doctor: doctorType = await getDoctorById();


  if (!doctor) return <div className="text-center py-20">Doctor not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-10 py-10 dark:bg-transparent">

      {/* --- Doctor Detail Section --- */}
      <div className="flex flex-col sm:flex-row gap-6 px-1.5 ">

        {/* Left Side: Doctor Image */}
        <div className="w-full sm:max-w-72 bg-[#5F6FFF] dark:bg-[#5F6FFF] rounded-lg">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={500}
            height={500}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* Right Side: Doctor Info Box */}
        <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 py-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300">

          {/* Name + Verified */}
          <div className="flex items-center gap-2 text-3xl font-medium text-gray-800 dark:text-gray-200">
            {doctor.name}
            <HiCheckBadge className="text-[#5F6FFF] text-xl" />
          </div>

          {/* Specialty + Experience */}
          <div className="flex items-center gap-3 text-sm mt-2 text-gray-600 dark:text-gray-400">
            {/* ترجمة التخصص ديناميكياً */}
            <p>MBBS - {tDoctors(`specialties.${doctor.specialty}`)}</p>
            <span className="py-0.5 px-3 border text-[11px] rounded-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              {doctor.experience_years} {t("specialtyExperience.experience")}
            </span>
          </div>

          {/* Location */}
          <div className="mt-5 flex items-center gap-1 text-sm">
            <CiLocationOn className="text-[#5F6FFF] text-xl" />
            <span className="text-gray-500 dark:text-gray-400 font-normal tracking-wide">
              {t("details.location")}
            </span>
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
              {doctor.city}, {doctor.country}
            </span>
          </div>

          {/* About */}
          <div className="mt-5">
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-200">
              {t("details.about")} <AiOutlineInfoCircle className="text-gray-500 dark:text-gray-400" />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[700px] mt-1 leading-relaxed">

              {locale === "en" ? doctor.description_en : doctor.description_ar}

            </p>
          </div>

          {/* Fee */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t("details.appointmentFee")}{" "}

              <span className="text-gray-900 dark:text-gray-200 font-semibold text-lg">
                 {locale === "en"
                   ? `${t("currency")}${doctor.appointment_fee}`
                   : `${doctor.appointment_fee} ${t("currency")}`}
              </span>

            </p>
          </div>

        </div>

      </div>

      {/* --- Booking Slots Section --- */}
      <BookingSlots
        doctorId={doctor.id}
        doctorName={doctor.name}
        doctorImage={doctor.image}
        specialty={doctor.specialty}
        fees={doctor.appointment_fee}
      />

    </div>
  );
};

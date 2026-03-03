"use client"

import { fetchAppointments, removeAppointment } from "@/src/lib/redux/slices/appointmentsSlice";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { supabase } from "@/src/lib/supabaseClient";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

export default function Appointments() {
  const { data: appointments } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAppointId, setSelectedAppointId] = useState<number | null>(null);

  const t = useTranslations("Appointments");

  const tDoctors = useTranslations("Doctors");

  const tProfile = useTranslations("doctorProfile");

  const locale = useLocale();

  useEffect(() => {
    if (appointments.length === 0) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, appointments.length]);

  const handleCancelAppoint = async () => {
    if (selectedAppointId === null) return;
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", selectedAppointId);

      if (error) throw error;
      dispatch(removeAppointment(selectedAppointId));
      toast.success(t("toast.cancelSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("toast.cancelError"));
    } finally {
      setSelectedAppointId(null);
    }
  };

  function calculateAge(birthday: string | null) {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }


 
    // التاريخ
function formatDateTime(date: string, time: string, locale: string = "en") {
 
  const formattedDate = new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString(
    locale === "ar" ? "ar-EG" : "en-US",
    { hour: "2-digit", minute: "2-digit", hour12: true }
  );

  return { formattedDate, formattedTime };
}


  return (
    <div className="p-2 md:p-6 min-h-screen bg-gray-50 dark:bg-slate-900">

  <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
    {t("title")}
  </h1>

  {/* --- Desktop Table View --- */}
  <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="text-xs text-gray-400 dark:text-gray-300 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-700/50">
          <th className="text-left px-5 py-4 w-8">#</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.patient")}</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.department")}</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.age")}</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.dateTime")}</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.doctor")}</th>
          <th className={`text-left px-5 py-4 ${locale === "ar" ? "text-right" : "text-left"}`}>{t("table.fees")}</th>
          <th className="px-5 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
        {appointments.map((appt, index) => (
          <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-300">{index + 1}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <Image
                  src={appt.patient?.image || "/images/userPlaceholder.png"}
                  alt="Patient"
                  width={32}
                  height={32}
                  className="rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-600"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{appt.patient?.name}</span>
              </div>
            </td>
            
            <td className="px-5 py-4 text-sm">
              <span className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md text-[11px] font-bold">
                {t(`specialties.${appt.specialty}`)}
              </span>
            </td>

            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
              {appt.patient?.birthday ? calculateAge(appt.patient.birthday) : "-"}
            </td>

            <td className="px-5 py-4 text-sm">
  <div className="flex flex-col gap-1">
    <span className="text-gray-800 dark:text-gray-100 font-semibold whitespace-nowrap">
      {formatDateTime(appt.appointment_date, appt.appointment_time, locale).formattedDate}
    </span>
    <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full w-fit">
      {formatDateTime(appt.appointment_date, appt.appointment_time, locale).formattedTime}
    </span>
  </div>
</td>
            
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <Image
                  src={appt.doctor_Image || "/images/userPlaceholder.png"}
                  alt="Doctor"
                  width={32}
                  height={32}
                  className="rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-600"
                />
                <span className="text-sm font-medium  text-gray-700 dark:text-gray-200">{appt.doctor_name}</span>
              </div>
            </td>

            <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                 {locale === "en"
                   ? `${tProfile("currency")}${appt.fees}`
                   : `${appt.fees} ${tProfile("currency")}`}
            </td>
            
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedAppointId(appt.id)}
                className="w-8 h-8 cursor-pointer bg-red-200 dark:bg-red-500 hover:bg-red-600 dark:text-white text-red-400 rounded-full flex items-center justify-center transition-all"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* --- Mobile Card View --- */}
  <div className="md:hidden space-y-4">
    {appointments.map((appt) => (
      <div key={appt.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
        <button
          onClick={() => setSelectedAppointId(appt.id)}
          className={`absolute top-4 w-8 h-8 bg-red-200 dark:bg-red-500  hover:bg-red-600 dark:text-white rounded-full flex items-center justify-center
            
            ${locale === "ar" ? "left-4" : "right-4"}

            `}
        >
          <HiOutlineX />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Image
            src={appt.patient?.image || "/images/userPlaceholder.png"}
            alt="Patient"
            width={45}
            height={45}
            className="rounded-full object-cover border border-gray-100 dark:border-gray-600"
          />
          <div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-100">{appt.patient?.name}</p>
            <p className="text-xs text-blue-500 dark:text-blue-300 font-bold uppercase">
              {t(`specialties.${appt.specialty}`)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-700 pt-4">
          <div>
  <p className="text-[10px] text-gray-400 dark:text-gray-300 uppercase font-bold mb-1">{t("table.dateTime")}</p>
  <div className="flex flex-col">
    <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
      {formatDateTime(appt.appointment_date, appt.appointment_time, locale).formattedDate}
    </p>
    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-300">
      {formatDateTime(appt.appointment_date, appt.appointment_time, locale).formattedTime}
    </p>
  </div>
</div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-300 uppercase font-bold">{t("table.doctor")}</p>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{appt.doctor_name}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-300 uppercase font-bold">{t("table.age")}</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{appt.patient?.birthday ? calculateAge(appt.patient.birthday) : "-"} {t("table.years")}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-300 uppercase font-bold">{t("table.fees")}</p>
            
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">

              {locale === "en"
                   ? `${tProfile("currency")}${appt.fees}`
                   : `${appt.fees} ${tProfile("currency")}`}
              
            </p>
          
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* --- Cancel Confirmation Modal --- */}
  {selectedAppointId && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiOutlineX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t("modal.title")}</h3>
        <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
          {t("modal.description")}
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setSelectedAppointId(null)}
          >
            {t("modal.no")}
          </button>
          <button
            className="flex-1 px-4 py-2.5 bg-red-500 dark:bg-red-600 text-white font-bold rounded-xl hover:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900 transition-all"
            onClick={handleCancelAppoint}
          >
            {t("modal.yes")}
          </button>
        </div>
      </div>
    </div>
  )}
  
</div>
  );
}
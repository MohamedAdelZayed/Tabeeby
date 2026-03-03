"use client"

import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { FaUserMd, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Image from "next/image";
import { supabase } from "@/src/lib/supabaseClient";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, removeAppointment } from "@/src/lib/redux/slices/appointmentsSlice";
import toast from "react-hot-toast";
import { fetchDoctors } from "@/src/lib/redux/slices/doctorsSlice";
import { useLocale, useTranslations } from "next-intl";


export default function Dashboard() {

  const {data : appointments} = useSelector( (state : RootState) => state.appointments )

  const {data: doctors} = useSelector( (state : RootState) => state.doctors)

  const dispatch = useDispatch<AppDispatch>();

  const latestAppoint = appointments.slice(0,5)

  const [selectedAppointId, setSelectedAppointId] = useState<number | null>(null);
  
  const t = useTranslations("Dashboard");

  const locale = useLocale();


  // fetch عند أول تحميل
useEffect(() => {

  if (appointments.length === 0) {
    dispatch(fetchAppointments());
  }

  if (doctors.length === 0) {
    dispatch(fetchDoctors()); 
  }

}, [dispatch, appointments.length, doctors.length]);



   const handleCancelAppoint = async () => {
   
    if (selectedAppointId === null) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", selectedAppointId);

      if (error) throw error;

      dispatch( removeAppointment(selectedAppointId) )
      toast.success(t("toast.cancelSuccess"));

    } catch (err) {
      console.error(err);
      toast.error(t("toast.cancelError"));
    } finally {
      setSelectedAppointId(null);
    }
  };


  const patientsCount  = new Set( appointments.map( (appoint) => appoint.patient.id ) )


  return (
    <div className="p-2 md:p-6">

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6">

        {/* Doctors */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 flex-1 min-w-[150px]">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
            <FaUserMd className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{doctors.length}</p>
            {/* <p className="text-xs text-gray-400 dark:text-gray-400">Doctors</p> */}
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("stats.doctors")}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 flex-1 min-w-[150px]">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
            <FaCalendarAlt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{appointments.length}</p>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("stats.appointments")}</p>
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 flex-1 min-w-[150px]">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
            <FaUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{patientsCount.size}</p>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("stats.patients")}</p>
          </div>
        </div>

      </div>

      {/* Latest Appointments */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 max-w-full lg:max-w-lg">

        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 dark:border-slate-700">
          <FaCalendarAlt className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("latestAppointments.title")}
          </h2>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-700">

          {latestAppoint.map((appt) => (
            <div key={appt.id} className="flex items-center justify-between px-5 py-3">

              <div className="flex items-center gap-3">
                <Image
  src={appt.doctor_Image}
  alt={appt.doctor_name}
  width={36}
  height={36}
  className="rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-200 shadow-sm"
/>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {appt.doctor_name}
                  </p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {/* Booked on {appt.appointment_date} */}
                    {t("latestAppointments.bookedOn")} {new Date(appt.appointment_date).toLocaleDateString(locale)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppointId(appt.id)}
                className="w-7 h-7 bg-red-200 dark:bg-red-500 hover:bg-red-300 dark:hover:bg-red-600 dark:text-white cursor-pointer text-red-400 rounded-full flex items-center justify-center transition-colors"
              >
                <HiOutlineX />
              </button>

            </div>
          ))}

        </div>
      </div>

      {/* Modal */}
      {selectedAppointId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-lg dark:shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
            <p className="text-gray-800 dark:text-gray-100 mb-4 font-medium">
              {t("modal.cancelConfirm")}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleCancelAppoint}
              >
                {t("modal.yes")}
              </button>
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 cursor-pointer text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                onClick={() => setSelectedAppointId(null)}
              >
                {t("modal.no")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
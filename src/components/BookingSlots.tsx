"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { SlotType } from "../lib/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAppointment, fetchAppointments } from "../lib/redux/slices/appointmentsSlice";
import { useLocale, useTranslations } from "next-intl";
import { RootState } from "../lib/redux/store";


function generateNext7Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);

    days.push({
      day: nextDay.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(), // MON
      date: nextDay.getDate(), // 14
      fullDate: nextDay.toISOString().split("T")[0], // 2026-02-14
    });
  }

  return days;
}


type BookingSlotsProps = {
  doctorId?: number;
  doctorName?: string;
  doctorImage?: string;
  specialty?: string;
  fees?: number
};


export default function BookingSlots( {doctorId,doctorName,doctorImage,specialty,fees} : BookingSlotsProps ) {


  const days = generateNext7Days()
  
  const [selectedDay, setSelectedDay] = useState<string>(days[0].day);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [timeSlots, setSlots] = useState<SlotType[]>([])

  const router = useRouter()

   const t = useTranslations("bookingSlots");

  const dispatch = useDispatch();

  const locale = useLocale()

  const appointments = useSelector((state: RootState) => state.appointments.data);

  async function getSchedule(){

    const { data, error } = await supabase
    .from("doctor_schedule")
    .select("*")
    .eq("doctor_id", doctorId )


    if (error) {
        console.error(error);
        setSlots([]);
        return;
      }


      setSlots(data)

  }


  useEffect( () => {
    getSchedule()
  } ,[])


  const filteredSlots = timeSlots.filter( (slot) => 
    slot.day.toLowerCase() === selectedDay.toLowerCase()
  )


  function getHalfHourSlots(start: string, end: string) {

  const slots: string[] = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {

    // تحويل لـ 12 ساعة مع AM/PM
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const time = `${displayHour}:${minute === 0 ? "00" : minute} ${ampm}`;
    slots.push(time);

    // نزود 30 دقيقة
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }

  return slots;
  }
 


function calculateAge(birthday: string | null) {
  if (!birthday) return null;

  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}



async function handleBooking(){

  if(!selectedTime){
    // toast.error("Please select a time!");
    toast.error(t("errors.selectTime"));
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    toast.error(t("errors.notLoggedIn"));
    return;
  }



   // 🔹 جلب بيانات إضافية من جدول users
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*") // أو أي أعمدة عندك
    .eq("auth_id", user.id)
    .single();

  if (userError) {
    console.error(userError);
    toast.error(t("errors.fetchUserFailed"));
    return;
  }


 const patientAge = calculateAge(userData?.birthday);




  const selectedFullDate = days.find(d => d.day === selectedDay)?.fullDate;

  if (!selectedFullDate) return;

  // 1️⃣ نتحقق هل المعاد اتحجز قبل كده
  const { data: existingAppointments, error: checkError } = await supabase
    .from("appointments")
    .select("id, user_id")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", selectedFullDate)
    .eq("appointment_time", selectedTime);

  if (checkError) {
    console.error(checkError);
    toast.error(t("errors.somethingWrong"));
    return;
  }

  if (existingAppointments && existingAppointments.length > 0) {

    // لو نفس المستخدم
    const alreadyBookedByUser = existingAppointments.some(
      (app) => app.patient_id === userData.id
    );

    if (alreadyBookedByUser) {
      toast.error(t("errors.alreadyBooked"));
      return;
    }

    // لو محجوز من حد تاني
    toast.error(t("errors.bookedByAnother"));
    return;
  }


  // ✅ لو مفيش حجز مسبق
  const { data: insertedData , error } = await supabase.from("appointments").insert([
    {
      doctor_id: doctorId,
      doctor_name: doctorName,
      doctor_Image: doctorImage,
      specialty: specialty,
      appointment_date: selectedFullDate,
      appointment_time: selectedTime,
      patient_id: userData.id, 
      fees: fees
    }
  ]).select().single();


  
  if (error) {
    console.error(error);
    toast.error(t("errors.bookingFailed"));
  } else {

    const appointmentWithPatient = {
    ...insertedData,
    patient: {
        id: userData.id,
        name: userData.name,
        image: userData.image,
        birthday: userData.birthday
    }
};



  if (appointments.length === 0) {
     await dispatch(fetchAppointments()); // Redux فاضي → هات الكل
  } else {
     dispatch(addAppointment(appointmentWithPatient)); // فيه داتا → ضيف الجديد
  }
    
    toast.success(t("success.booked"));
    
    router.push("/my-appointments");
  }
}








  return (

  <div
  dir={locale === "ar" ? "rtl" : "ltr"}
  className={`
    mt-4 sm:mt-6 lg:mt-10 px-4 sm:px-6 md:px-8 lg:px-0
    font-medium text-gray-700 dark:text-gray-300
    max-w-full sm:max-w-4xl
    ${locale === "ar" ? "mx-auto sm:mr-24 md:mr-40 lg:mr-80" : "sm:ml-24 md:ml-40 lg:ml-80"}
  `}
>

  <p className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4`}>{t("title")}</p>

  {/* Days List */}
  <div className="relative w-full">
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none sm:hidden"></div>
    <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 pb-4 no-scrollbar snap-x snap-mandatory">
      {days.map((item, index) => (
        <div
          key={index}
          onClick={() => setSelectedDay(item.day)}
          className={`
            snap-center 
            flex flex-col items-center justify-center 
            min-w-[70px] h-[70px]
            rounded-2xl cursor-pointer transition-all border shrink-0
            ${selectedDay === item.day 
              ? "bg-[#5F6FFF] text-white border-[#5F6FFF]" 
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700"}
          `}
        >
          <p className="text-[12px] font-extrabold uppercase mb-1">{item.day}</p>
          <p className="text-lg font-extrabold">{item.date}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Time Slots */}
  <div className="mt-8">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">
       {t("availableSlots")}
    </p>

    {filteredSlots.length === 0 && (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 font-medium">
           {t("noAppointments")}
        </p>
      </div>
    )}

    {filteredSlots.length > 0 && (
      // <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        
        {filteredSlots.map((slot, index) => {
          const periods = getHalfHourSlots(slot.start_time, slot.end_time);
          return periods.map((time, idx) => (
            <button
              key={`${index}-${idx}`}
              onClick={() => setSelectedTime(time)}
              className={`
                text-sm py-3 px-2 rounded-xl border transition-all duration-200 cursor-pointer text-center
                ${selectedTime === time
                  ? "bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-md"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#5F6FFF] hover:bg-blue-50 dark:hover:bg-blue-900"}
              `}
            >
              {time}
            </button>
          ));
        })}
      </div>
    )}
  </div>

  <div className="mt-10 mb-10">
    <button
      onClick={() => handleBooking()}
      className="w-full sm:w-auto cursor-pointer bg-[#5F6FFF] text-white text-base font-semibold px-12 py-4 rounded-xl hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shadow-lg shadowblue-100 dark:shadow-none "
    >
      {t("bookButton")}
    </button>
  </div>

</div>
  );
}

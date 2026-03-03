"use client"

import { fetchAppointments, removeAppointment } from "@/src/lib/redux/slices/appointmentsSlice";
import { fetchCurrentUser } from "@/src/lib/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { supabase } from "@/src/lib/supabaseClient";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { AppointmentType } from "@/src/lib/types";
import { useSearchParams } from "next/navigation";

export default function MyAppointments() {

  const [selectedAppointId, setSelectedAppointId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  
  const { data: appointments , loading } = useSelector((state: RootState) => state.appointments);

  const dispatch = useDispatch<AppDispatch>();
  
  const {data: currentUser} = useSelector((state: RootState) => state.user);
  
  const locale = useLocale()

  const t = useTranslations("myAppointments");

  const [loadingPayId, setLoadingPayId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const appointmentIdParam = searchParams.get("appointmentId");

  useEffect(() => {
   if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);


// فلترة حسب اليوزر الحالي
const userAppointments = currentUser
  ? appointments.filter((a) =>  a.patient?.id === currentUser.id)
  : [];



   useEffect(() => {
  if (appointments.length === 0) {
    dispatch(fetchAppointments());
  }
}, [dispatch, appointments.length]);



  function formatDateTime(date: string, time: string, locale: string = "en") {
 
    // التاريخ
   const formattedDate = new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: locale === "ar" ? "long" : "short",
    year: "numeric",
   });

  // الوقت
   const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString(
    locale === "ar" ? "ar-EG" : "en-US", // عربي الساعة صباح/مساء بالعربي
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
   );

   return `${formattedDate} | ${formattedTime}`; 
  }

  
  const handleCancelAppoint = async () => {
   
    if (selectedAppointId === null) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", selectedAppointId);

      if (error) throw error;

      dispatch( removeAppointment(selectedAppointId) )

      toast.success(t("success.appointmentCancelled")); 

    } catch (err) {
      console.error(err);
      toast.error(t("errors.cancelAppointmentFailed"));
    } finally {
      setSelectedAppointId(null);
    }
  };




  const now = new Date();


// Upcoming: الأقرب حدوثاً أولاً (Ascending)
// const upcomingAppointments = userAppointments
//   .filter((item) => new Date(`${item.appointment_date}T${item.appointment_time}`) >= now)
//   .sort((a, b) =>
//     new Date(`${a.appointment_date}T${a.appointment_time}`).getTime() -
//     new Date(`${b.appointment_date}T${b.appointment_time}`).getTime()
//   );

// // Past: الأحدث تاريخاً أولاً (Descending)
// const pastAppointments = userAppointments
//   .filter((item) => new Date(`${item.appointment_date}T${item.appointment_time}`) < now)
//   .sort((a, b) =>
//     new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() -
//     new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
//   );


  // Upcoming: الأبعد حدوثاً أولاً (Descending)
// أي موعد هيظهر أولاً اللي بعيد في المستقبل
const upcomingAppointments = userAppointments
  .filter((item) => new Date(`${item.appointment_date}T${item.appointment_time}`) >= now)
  .sort((a, b) =>
    new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() -
    new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
  );

// Past: الأحدث تاريخاً أولاً (Descending)
// أي موعد هيظهر أولاً اللي حصل مؤخراً
const pastAppointments = userAppointments
  .filter((item) => new Date(`${item.appointment_date}T${item.appointment_time}`) < now)
  .sort((a, b) =>
    new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() -
    new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
  );

  

const displayedAppointments = 
   activeTab === "upcoming" ? upcomingAppointments : pastAppointments;




// تأثير التأكد من نجاح الدفع بعد العودة من Stripe
  useEffect(() => {
  const confirmPayment = async () => {
    // 1. التأكد من وجود القيم
    if (success === 'true' && appointmentIdParam) {
      
      try {
        // 2. تحديث قاعدة البيانات
        const { error } = await supabase
          .from("appointments")
          .update({ is_paid: true })
          .eq("id", Number(appointmentIdParam));

        if (!error) {
          // 3. إظهار رسالة النجاح مرة واحدة فقط
          toast.success(t("success.paymentCompleted"));

          // 4. أهم خطوة: تحديث الداتا في Redux عشان الزرار يقلب Paid فوراً
          dispatch(fetchAppointments());

          // 5. نعدل رابط الصفحة في المتصفح لمسح الـ query parameters 
          // بحيث رسالة نجاح الدفع لا تظهر مرة ثانية عند عمل Refresh
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      } catch (err) {
        console.error("Payment Confirmation Error:", err);
      }
    }
  };

  confirmPayment();
}, [success, appointmentIdParam, dispatch, t]);


  // دالة الدفع
  const handlePayment = async (item: AppointmentType) => {

    setLoadingPayId(item.id);
    
    // هنا بيبعت طلب للـ API route اللي فوق
  // fetch("/api/checkout-session") = روح نفذ الكود اللي في route.ts ده
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          appointmentId: item.id,   
          doctorName: item.doctor_name, 
          amount: item.fees,
          locale: locale // دي اللي جاية من useLocale()
        }),
      });

      

      const data = await res.json();// هيرجع { url: session.url }


      if (data.url) {
        window.location.href = data.url; // يفتح صفحة الدفع
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      toast.error(t("errors.paymentFailed"));      
    } finally {
      setLoadingPayId(null);
    }
  };








if (!currentUser || loading) {
  return (
    <div className="flex justify-center items-center py-20">
      <ImSpinner9 className="animate-spin text-[#5F6FFF] text-3xl" />
    </div>
  );
}





  return (
   <div className="max-w-7xl mx-auto px-5.5 sm:px-14 md:px8 py-4 sm:py-6">

  <div className="flex items-center justify-between mb-8">

    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
       {t("title")}
    </h1>

    <div className="flex gap-6 border-b pt-3.5 sm:pt-0 border-gray-200 dark:border-gray-700">
      
      <button
        onClick={() => setActiveTab("upcoming")}
        className={`relative pb-2 text-sm font-medium cursor-pointer transition-all duration-300 ${
          activeTab === "upcoming"
            ? "text-[#5F6FFF]"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        }`}
      >
        {t("upcoming")}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-[#5F6FFF] transition-all duration-300 ${
            activeTab === "upcoming" ? "w-full" : "w-0"
          }`}
        ></span>
      </button>

      <button
        onClick={() => setActiveTab("past")}
        className={`relative pb-2 text-sm font-medium cursor-pointer transition-all duration-300 ${
          activeTab === "past"
            ? "text-[#5F6FFF]"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        }`}
      >
        {t("past")}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-[#5F6FFF] transition-all duration-300 ${
            activeTab === "past" ? "w-full" : "w-0"
          }`}
        ></span>
      </button>

    </div>
  </div>

  <div className="space-y-6">
    {displayedAppointments.length > 0 ? (
      displayedAppointments.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 relative rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 flex flex-col lg:flex-row gap-6 hover:shadow-md dark:hover:shadow-gray-900/40 transition-all"
        >

          <div className="relative w-full sm:w-40 aspect-square bg-blue-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={item.doctor_Image}
              alt={item.doctor_name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
            />
          </div>

          <div className="flex-1 space-y-1">

            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                {item.doctor_name}
              </h2>
            </div>

            

            <p className="text-sm text-[#5F6FFF] font-medium">
              {t(`specialties.${item.specialty}`)}
            </p>

            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("address")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("addressDetails.line1")} <br />
                {t("addressDetails.line2")} 
              </p>
            </div>


            <div className="pt-3 text-sm">
  <span className="font-semibold text-gray-700 dark:text-gray-300">
    {t("dateTime")}
  </span>
  <span
    className={`text-gray-500 dark:text-gray-400 ml-2 ${
      locale === "ar" ? "text-right" : "text-left inline"
    }`}
  >
    {formatDateTime(
      item.appointment_date,
      item.appointment_time,
      locale
    )}
  </span>
</div>

          </div>


          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-44">
  {/* زرار الدفع أو حالة "تم الدفع" */}
  {item.is_paid ? (
    <div className="w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-green-50 text-green-600 border border-green-200 flex items-center justify-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      {t("paid")}
    </div>
  ) : (
    <button
      disabled={loadingPayId === item.id}
      onClick={() => handlePayment(item)}
      className="w-full py-2.5 px-4 cursor-pointer rounded-lg text-sm font-medium border border-[#5F6FFF] text-[#5F6FFF] hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingPayId === item.id ? (
        <ImSpinner9 className="animate-spin text-lg" />
      ) : (
        t("payOnline")
      )}
    </button>
  )}

  {/* زرار إلغاء الحجز - يظهر فقط لو الموعد لم يدفع بعد  */}
  {!item.is_paid && (
    <button
      onClick={() => setSelectedAppointId(item.id)}
      className="w-full py-2.5 px-4 cursor-pointer rounded-lg text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
    >
      {t("cancelAppointment")}
    </button>
  )}
</div>

        </div>
      ))
    ) : (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400 rounded-2xl">
        {t("noAppointments", {
           type: activeTab === "upcoming" ? t("upcoming") : t("past")
        })}
      </div>
    )}
  </div>

  {selectedAppointId && (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
        <p className="text-gray-800 dark:text-gray-200 mb-4 font-medium">
          {t("cancelConfirm")}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleCancelAppoint}
          >
            {t("yes")}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setSelectedAppointId(null)}
          >
            {t("no")}
          </button>
        </div>
      </div>
    </div>
  )}

</div>
  );
}

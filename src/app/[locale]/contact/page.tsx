"use client";

import { supabase } from "@/src/lib/supabaseClient";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { HiOutlineBriefcase } from 'react-icons/hi';
import { useTranslations } from "next-intl"; 


export default function Contact() {
  const [loading, setLoading] = useState(false);

  const t = useTranslations("Contact");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // الوصول للفورم وتعريف نوعه بشكل صحيح لـ TypeScript
    const form = e.currentTarget as HTMLFormElement;

    // استخدام FormData لجلب البيانات بطريقة احترافية تتجنب أخطاء النوع
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      toast.error(t("allFieldsRequired"));
      setLoading(false);
      return;
    }

      try {

    const { error } = await supabase
      .from("contacts")
      .insert([{ name, email, message }]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("messageSent"))
      form.reset();
    }

    } catch (err) {
    toast.error(t("unexpectedError"));
    } finally {
     setLoading(false);
    }

  }

   return (
    <div className="mx-auto max-w-7xl px-6.5 sm:px-11 lg:px-16 py12 md:py16 pt-6 font-[Outfit] dark:text-gray-200">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          {t("header").split(" ")[0]} <span className="text-gray-900 dark:text-white font-bold tracking-tight">{t("header").split(" ").slice(1).join(" ")}</span>
        </h1>
        <div className="h-1.5 w-16 bg-[#5F6FFF] mt-3 mx-auto rounded-full"></div>
        <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
          {t("subHeader")}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 md:gap-10 items-start">

        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Office Card */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("office")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-600 rounded-2xl flex items-center justify-center group-hover:bg-[#5F6FFF] transition-all duration-300">
                  <FiMapPin className="text-lg text-[#5F6FFF] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold mb-0.5 text-sm">{t("visitUs")}</p>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                    54709 Willms Station, Suite 350,<br /> Washington, DC 20033
                  </p>

                  {/* <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
  {t("officeAddress").split(",").map((line, i) => (
    <span key={i}>
      {line.trim()}
      {i < t("officeAddress").split(",").length - 1 && <br />}
    </span>
  ))}
</p> */}

                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-600 rounded-2xl flex items-center justify-center group-hover:bg-[#5F6FFF] transition-all duration-300">
                  <FiPhone className="text-lg text-[#5F6FFF] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold mb-0.5 text-sm">{t("callUs")}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">(415) 555-0132</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-600 rounded-2xl flex items-center justify-center group-hover:bg-[#5F6FFF] transition-all duration-300">
                  <FiMail className="text-lg text-[#5F6FFF] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold mb-0.5 text-sm">{t("emailUs")}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">zayd0497gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Card */}
          <div className="group relative overflow-hidden bg-[#5F6FFF] dark:bg-[#4a58d6]/80  p-6 rounded-2xl text-white shadow-lg hover:shadow-[#5F6FFF]/40 transition-all duration-500 cursor-pointer">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 dark:bg-white/10 rounded-2xl backdrop-blur-md group-hover:bg-white/30 transition-colors">
                <HiOutlineBriefcase className="text-2xl text-white" />
              </div>
              <div>
                <p className="font-bold text-lg tracking-tight">{t("careers")}</p>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">
                  {t("careersDesc")}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-700"></div>
          </div>
          
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t("yourName")}</label>
              <input
                name="name"
                type="text"
                placeholder={t("yourName")}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/20 focus:border-[#5F6FFF] transition-all shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t("yourEmail")}</label>
              <input
                name="email"
                type="email"
                placeholder={t("yourEmail")}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/20 focus:border-[#5F6FFF] transition-all shadow-sm"
              />
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t("message")}</label>
              <textarea
                name="message"
                rows={4}
                placeholder={t("messagePlaceholder")}
                className="w-full bg-white dark:bg-gray-700 placeholder:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/20 focus:border-[#5F6FFF] transition-all resize-none shadow-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full md:w-auto bg-[#5F6FFF] dark:bg-[#4a58d6]/80 cursor-pointer text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-[#4a58d6] hover:shadow-lg hover:shadow-[#5F6FFF]/30 active:scale-[0.97] transition-all duration-300"
              >
                {loading ? t("sending") : t("sendMessage")}
                <FiSend className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { supabase } from "../lib/supabaseClient";
import { clearUser } from "../lib/redux/slices/userSlice";
import { AppDispatch } from "../lib/redux/store";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const dispatch = useDispatch<AppDispatch>();

  // تحديد اللغة الحالية واللغة القادمة
  const currentLocale = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
  const nextLocale = currentLocale === 'en' ? 'ar' : 'en';

  async function handleLogout() {
    try{
    await supabase.auth.signOut();
    dispatch(clearUser());
    toast.success(t("logout_success"));
    // التوجيه للرئيسية مع الحفاظ على اللغة الحالية
    router.push(`/${currentLocale}`);
    
  } catch (error) {
    toast.error(t("logout_error"));
  }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 flex justify-between items-center z-50 
      bg-white dark:bg-[#1A243A] 
      border-b border-gray-200 dark:border-[#25335e] 
      shadow-sm dark:shadow-black/30
      px-4 sm:px-10"
      style={{ height: "64px" }}
    >
      <div className="flex items-center gap-2 sm:gap-4 h-full">

              {/* Logo */}
      <Link href="/" className="shrink-0 group">
        <Image
          src={currentLocale === 'ar' ? "/images/logo4-ar.png" : "/images/logo (6).png"}
          alt="Tabeeby Logo"
          width={176}
          height={40}
           className="w-32 sm:w-40 md:w-44 cursor-pointer 
               transition-all duration-300 
               dark:brightness-0 dark:invert 
               dark:opacity-90 hover:opacity-100"
        />
      </Link>


        <span className="hidden sm:block text-[10px] mt-1.5 tracking-widest bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md font-bold border border-blue-100 dark:border-blue-800 whitespace-nowrap">
          {t("adminPanel")}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Language Switcher */}
        <button
          onClick={() => {
            const segments = pathname.split('/').slice(2);
            router.push(`/${nextLocale}/${segments.join('/')}`);
          }}
          className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl cursor-pointer bg-gray-200/20 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-200 border border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
          title={currentLocale === "en" ? "العربية" : "English"}
        >
          <HiOutlineGlobeAlt size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold uppercase w-4 sm:w-5">
            {currentLocale === "en" ? "AR" : "EN"}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-[#5F6FFF] text-white cursor-pointer px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-[#4e5de6] transition-all text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
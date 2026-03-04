"use client"

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdCalendarToday, MdPersonAdd, MdListAlt, MdGroups } from "react-icons/md";


export default function AdminSidebar() {

  const t = useTranslations("AdminSidebar");

  const pathName = usePathname();


  const locale = useLocale()

  const navItems = [
    { href: "dashboard", label: t("dashboard"), icon: <MdDashboard className="w-5 h-5"/> },
    { href: "allAppointments", label: t("allAppointments"), icon: <MdCalendarToday className="w-5 h-5" /> },
    { href: "addDoctor", label: t("addDoctor"), icon: <MdPersonAdd className="w-5 h-5" /> },
    { href: "doctors", label: t("doctors"), icon: <MdListAlt className="w-5 h-5" /> },
    // { href: "patients", label: "Patients", icon: <MdGroups className="w-5 h-5" /> },
  ];
  
  return (
    <aside
      className={`w-14 md:w-64 bg-gray-50 dark:bg-slate-900 ${locale === "en" ? 'border-r' : 'border-l'} border-gray-300 dark:border-gray-700 flex flex-col transition-all duration-300`}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <nav className="py-4 px-2 md:px-4 flex flex-col gap-1">
        
        {navItems.map((item) => {
          const isActive = pathName.includes(`/admin/${item.href}`);
          return (
            <Link
              href={`/admin/${item.href}`}
              key={item.href}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out
                ${isActive 
                  ? "bg-[#5F6FFF] text-white shadow-sm shadow-blue-100" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 hover:pl-6"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              
              <span className={isActive ? "text-white" : "text-gray-400 dark:text-gray-300"}>
                {item.icon}
              </span>
      
              <span className="hidden md:inline">
                  {item.label}
              </span>
      
            </Link>
          );
        })}
      
      </nav>
    
    </aside>
  );
}
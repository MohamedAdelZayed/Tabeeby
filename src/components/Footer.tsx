"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineEmail, MdOutlinePhoneInTalk } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {

  const pathname = usePathname();
  
  const t = useTranslations("footer"); 


  const locale = useLocale()


   const navLinks = [
    { label: t("quickLinks.home"), href: "/" },
    { label: t("quickLinks.doctors"), href: "/doctors" },
    { label: t("quickLinks.about"), href: "/about" },
    { label: t("quickLinks.contact"), href: "/contact" },
  ];

  return (
    !pathname.startsWith("/admin") && (

      <footer className="bg-white dark:bg-[#1A243A] border-t border-gray-100 dark:border-[#25335e] mt-10">

        <div className="max-w-7xl mx-auto px-6 pt-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Brand */}
            <div className="md:col-span-2 space-y-3">

              <Link href="/" className="inline-block">
                <Image
                  src={locale === 'ar' ? "/images/logo4-ar.png" : "/images/logo (6).png"}
                  alt="Tabeeby Logo"
                  width={140}
                  height={32}
                  className="opacity-90 hover:opacity-100 transition-opacity dark:brightness-0 dark:invert dark:opacity-90"
                />
              </Link>

              <p className="text-gray-400 dark:text-gray-400 text-sm leading-relaxed max-w-xs">

                {t("brand.description")}

              </p>

            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-[12px] tracking-widest uppercase">
                {t("quickLinks.title")}
              </h3>

              <ul className="space-y-2">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-300 text-[13px] hover:text-[#5F6FFF] dark:hover:text-blue-400 transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get In Touch */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-[12px] tracking-widest uppercase">
                {t("getInTouch.title")}
              </h3>

              <div className="space-y-3">

                <a
                  href="tel:+201227245823"
                  className="group flex items-center gap-2 text-gray-500 dark:text-gray-300 text-[13px] hover:text-[#5F6FFF] dark:hover:text-blue-400 transition-all"
                >
                  <MdOutlinePhoneInTalk className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-400 group-hover:text-[#5F6FFF] dark:group-hover:text-blue-400" />
                   {t("getInTouch.phone")}
                </a>

                <a
                  href="mailto:zayd0497@gmail.com"
                  className="group flex items-center gap-2 text-gray-500 dark:text-gray-300 text-[13px] hover:text-[#5F6FFF] dark:hover:text-blue-400 transition-all"
                >
                  <MdOutlineEmail className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-400 group-hover:text-[#5F6FFF] dark:group-hover:text-blue-400" />
                  {/* zayd0497@gmail.com */}
                  {t("getInTouch.email")}
                </a>

              </div>
            </div>

          </div>

          {/* Divider & Copyright */}
          <div className="text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-[#25335e] mt-6 py-4">
            <p className="text-center font-semibold text-sm">
              {/* &copy; 2026 Mohamed Adel - All Rights Reserved. */}
              {t("copyright")}
            </p>
          </div>

        </div>
      </footer>

    )
  );
}
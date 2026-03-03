"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineX, HiChevronDown, HiOutlineGlobeAlt } from "react-icons/hi";
import { RiMenu3Fill } from "react-icons/ri";
import { clearUser, fetchCurrentUser } from "../lib/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/redux/store";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { setTheme, toggleTheme } from "../lib/redux/slices/themeSlice";
import { useTranslations, useLocale } from 'next-intl';
import toast from "react-hot-toast";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdown, setIsUserDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.data);

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const currentLocale = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
  const nextLocale = currentLocale === 'en' ? 'ar' : 'en';

  const locale = useLocale();
  
  const t = useTranslations("Navbar");
  // const m = useTranslations("Messages");

  const navLinks = [
  { label: t("home") , href: `/${currentLocale}` },
  { label: t("Doctors"), href: `/${currentLocale}/doctors` },
  { label: t("services") , href: `/${currentLocale}/services` },
  { label: t("about"), href: `/${currentLocale}/about` },
  { label: t("contact") , href: `/${currentLocale}/contact` },
];


  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(fetchCurrentUser());
      } else {
        dispatch(clearUser());
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [dispatch]);

  async function handleLogout() {

    try {

    await supabase.auth.signOut();
    dispatch(clearUser());
    setIsUserDropdown(false);
    setIsMenuOpen(false);

    toast.success(t("logout_success"));

    // التوجيه للرئيسية مع الحفاظ على اللغة الحالية
    router.push(`/${currentLocale}`);
    
  } catch (error) {
    toast.error(t("logout_error"));
  }

  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // اغلاق المنيو لما المستخدم يكبّر الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsUserDropdown(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    dispatch(setTheme(savedTheme));
  }
}, [dispatch]);

useEffect(() => {
  if (themeMode === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [themeMode]);


useEffect(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // requestAnimationFrame عشان يتنفذ بعد ما الصفحة تظهر
  const frame = requestAnimationFrame(scrollToTop);

  return () => cancelAnimationFrame(frame);
}, [pathname]);


  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
  className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 transition-all duration-500
    ${
      isScrolled
        ? "bg-white/70 dark:bg-[#1A243A]/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30"
        : "bg-white dark:bg-[#1A243A]"
    }
    border-b border-gray-200 dark:border-[#25335e] min-h-14`}
>
      {/* Logo */}
      <Link href="/" className="shrink-0 group">
        <Image
          src={currentLocale === 'ar' ? "/images/logo4-ar.png" : "/images/logo (6).png"}
          alt="Tabeeby Logo"
          width={176}
          height={40}
           className={`w-32 sm:w-40 md:w-44 cursor-pointer 
               transition-all duration-300 
               dark:brightness-0 dark:invert 
               dark:opacity-90 hover:opacity-100 
               `}
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-3 lg:gap-6 font-medium">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <span
                className={`relative py-1 text-sm tracking-wide transition-colors duration-300 ${
                  pathname === link.href
  ? "text-[#4052f8] dark:text-blue-400"
  : "text-gray-700 dark:text-gray-200 hover:text-[#4052f8] dark:hover:text-blue-400"

                }`}
              >
                {link.label}
              
                <span
  className={`absolute left-0 -bottom-1 h-0.5 bg-[#5F6FFF] dark:bg-blue-400 origin-left w-full transform transition-transform duration-500 ease-out ${
    pathname === link.href ? "scale-x-100" : "scale-x-0"
  }`}
/>
              </span>

            </Link>
          </li>
        ))}

        {user?.role === "admin" && (
          <li>
            <Link href="/admin/dashboard">
              <span className="relative py-1 px-2 text-sm font-medium text-white bg-[#5F6FFF] rounded-full hover:bg-[#4e5de6] dark:bg-[#4e5de6] transition-colors">
                {t("adminPanel")}
              </span>
            </Link>
          </li>
        )}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 relative">

        {/* <button
  onClick={() => dispatch(toggleTheme())}
  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
  {themeMode === "dark" ? (
    <HiOutlineSun className="text-yellow-400 cursor-pointer text-xl transition-transform duration-300 rotate-0 hover:rotate-180" />
  ) : (
    <HiOutlineMoon className="text-gray-700 cursor-pointer dark:text-gray-200 text-xl transition-transform duration-300 rotate-0 hover:-rotate-12" />
  )}
</button> */}



 {/* Language Switcher */}
      <button
  onClick={() => {
    const segments = pathname.split('/').slice(2); // باقي الرابط بعد /en أو /ar
    router.push(`/${nextLocale}/${segments.join('/')}`);
  }}
  className="flex items-center gap-1.5 p-2 rounded-xl cursor-pointer bg-gray-200/20 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-200 border border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
  title={currentLocale === "en" ? "العربية" : "English"}
>
  <HiOutlineGlobeAlt size={18} className="text-blue-600 dark:text-blue-400 " />
  <span className="text-xs font-bold uppercase w-4">
    {currentLocale === "en" ? "AR" : "EN"}
  </span>
</button>

 

        {/* User Avatar + Dropdown */}
        {user && (
          <div
            className="relative flex items-center gap-1 py-2"
            onMouseEnter={() => window.innerWidth >= 768 && setIsUserDropdown(true)}
            onMouseLeave={() => window.innerWidth >= 768 && setIsUserDropdown(false)}
          >
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => window.innerWidth < 768 && setIsUserDropdown((prev) => !prev)}
            >
              <div className="w-9 h-9 relative shrink-0">
                <Image
                  src={user?.image || "/images/userPlaceholder.png"}
                  alt="User Profile"
                  fill
                  priority
                  quality={100}
                  className="rounded-full object-cover border-[1.5px] border-gray-100 shadow-sm"
                />
              </div>

              <HiChevronDown
                className={`hidden md:block text-gray-500 dark:text-gray-200  transition-transform duration-300 ${
                  isUserDropdown ? "rotate-180" : ""
                }`}
              />
            
            </div>

            {/* Overlay موبايل */}
            {isUserDropdown && (
              <div
                className="fixed inset-0 z-50 md:hidden"
                onClick={() => setIsUserDropdown(false)}
              />
            )}

            {/* Dropdown */}
{isUserDropdown && (
  <div
    className={`absolute top-12 p-2 w-48 rounded-xl border border-gray-200 shadow-lg flex flex-col
      ${currentLocale === 'ar' ? 'right-auto left-0 text-right' : 'right-0 text-left'}
      bg-white dark:bg-gray-800 z-70
    `}
  >
    <Link
      href={`/${locale}/myProfile`}
      onClick={() => setIsUserDropdown(false)}
      className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#25335e] dark:hover:text-gray-200"
    >
      {t("myProfile")}
    </Link>

    <Link
      href={`/${locale}/my-appointments`}
      onClick={() => setIsUserDropdown(false)}
      className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#25335e] dark:hover:text-gray-200"
    >
      {t("myAppointments")}
    </Link>

    <hr className="my-1 border-gray-200" />

    <button
      onClick={handleLogout}
      className="px-4 py-2.5 cursor-pointer rounded-lg text-sm font-semibold text-red-500 text-left hover:bg-red-100 transition-colors"
    >
      {t("logout")}
    </button>
  </div>
)}
          </div>
        )}

        {/* Login Button - Desktop */}
        {!user && (
          <Link href="/login" className="hidden md:block">
            <button className="bg-[#5F6FFF] text-white cursor-pointer px-6 py-2 rounded-full hover:bg-[#4e5de6] transition-all text-sm font-medium whitespace-nowrap">
              {t("login")}
            </button>
          </Link>
        )}

        {/* Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-700 dark:text-gray-200 p-1 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiOutlineX /> : <RiMenu3Fill />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className={`absolute top-14 w-52 bg-white dark:bg-[#1E2D48] border border-gray-100 rounded-2xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)] py-3 md:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300
          
           ${currentLocale === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}

          `}>
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative flex items-center mx-4 px-2 py-3 text-sm font-medium transition-colors duration-300 rounded-lg ${
                      pathname === link.href
                        ? "text-[#5F6FFF] bg-blue-50"
                        : "text-gray-600 hover:text-[#5F6FFF] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {user?.role === "admin" && (
                <li className="px-4 mt-1">
                  <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span className="flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-[#5F6FFF] rounded-xl hover:bg-[#4e5de6] transition-colors">
                      {t("adminPanel")}
                    </span>
                  </Link>
                </li>
              )} 

              {!user && (
                <li className="px-4 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-[#5F6FFF] text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-100 hover:bg-[#4e5de6] transition-colors">
                      {t("login")}
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabaseClient";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { AppDispatch } from "@/src/lib/redux/store";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/src/lib/redux/slices/userSlice";
import { useLocale, useTranslations } from "next-intl";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });

  const [checkingUser, setCheckingUser] = useState(true);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const t = useTranslations("login");
 
  const locale = useLocale()

  async function handleLogin() {

    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };

    // Validation
    if (!email.includes("@")) {
      newErrors.email = t("errors.invalidEmail");
      hasError = true;
    }
    if (password.length < 6) {
      newErrors.password = t("errors.passwordMin");
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoggingIn(true);

    try {

    // تسجيل الدخول
    const { data: res, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      toast.error(t("errors.invalidCredentials"));
      console.log(authError);
      setIsLoggingIn(false);
      return;
    }

    toast.success(t("success.loginSuccess"));


     dispatch(fetchCurrentUser())
    .unwrap()
    .then(() => router.replace("/"))
    .catch((err) => {
      console.log(err);
      toast.error(t("errors.fetchUserError"));
      setIsLoggingIn(false);
    });

      } catch (err) {
    console.error("Unexpected Error:", err);
    setIsLoggingIn(false);
  }

  }


useEffect(() => {
  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.replace("/"); // redirect لو عامل login
    } else {
      setCheckingUser(false); // الصفحة تظهر لما نتاكد مش عامل login
    }
  }

  checkUser();
}, []);




if (checkingUser) {
  return (

    <div className="flex justify-center items-center py-20 text-gray-500">
            <ImSpinner9 className="animate-spin text-[#5F6FFF] text-3xl" />
          </div>
  );
}


  return (
      <div className={`flex items-center justify-center min-h-[80vh] bg-white px-4 ${locale === "ar" ? "text-right" : "text-left"}`}>
      
        <div className={`w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-100 ${locale === "ar" ? "text-right" : "text-left"}`}>
        
        <h2 className="text-2xl font-semibold text-gray-700">{t("title")}</h2>

        <p className="text-gray-500 mt-2 mb-6">
           {t("description")}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
      
          {/* Email */}
          <div>
            <label className={`block text-gray-600 text-sm mb-1 ${locale === "ar" ? "text-right" : "text-left"}`}>
              {t("email")}
            </label>
            
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`w-full border p-2.5 rounded-lg outline-none focus:border-[#5F6FFF] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-gray-600 text-sm mb-1 ${locale === "ar" ? "text-right" : "text-left"} `}>
              {t("password")}
            </label>
            
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={`w-full border p-2.5 rounded-lg outline-none focus:border-[#5F6FFF] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>


          <button 
  disabled={isLoggingIn} // منع الضغط المتكرر
  className={`w-full bg-[#5F6FFF] flex items-center justify-center gap-2 text-white py-3 rounded-xl font-medium mt-2 transition-all ${
    isLoggingIn ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-[#4e5de6]"
  }`}
>
  {isLoggingIn ? (
    <>
      <ImSpinner9 className="animate-spin text-xl" />
      <span>{locale === "ar" ? "جاري تسجيل الدخول..." : "Logging in..."}</span>
    </>
  ) : (
    t("loginButton")
  )}
</button>

          <p className={`text-sm text-gray-600 mt-4 ${locale === "ar" ? "text-right" : "text-left"} `}>
             {t("createAccount")}
            <Link href={`/register`} className="text-[#5F6FFF] ml-1 hover:underline">
              {t("clickHere")}
            </Link>
          </p>
        </form>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import { fetchCurrentUser } from "@/src/lib/redux/slices/userSlice";
import { AppDispatch } from "@/src/lib/redux/store";
import { useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter()

  const t = useTranslations("register");
  const locale = useLocale();

  // state ??????? ??? ???
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  async function handleRegister() {

    setErrors({ name: "", email: "", password: "", role: "" });

    let hasError = false;
    const newErrors = { name: "", email: "", password: "", role: "" };

    // Validation
    if (name.trim().length < 3) {
      newErrors.name = t("errors.name");
      hasError = true;
    }

    if (!email.includes("@")) {
      newErrors.email = t("errors.email");
      hasError = true;
    }

    if (password.length < 6) {
      newErrors.password = t("errors.password");
      hasError = true;
    }

  

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

  // 1. ????? ???? ?? Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
      if (authError.message.includes("User already registered")) {
        toast.error(t("errors.emailExists"));
      } else {
        toast.error(t("errors.failedRegister"));
      }
      setIsSubmitting(false);
      console.log(authError);
      return;
    }


  // 2. ????? ?????? ???????? ?? ???? users
  if (authData?.user) {
  const { error } = await supabase
    .from("users")
    .insert([
      {
        auth_id: authData.user.id,
        name: name,
        email: email,
        role: "user",
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    toast.error(t("errors.failedSaveUser"));
    setIsSubmitting(false); 
    console.log(error);
    return;
  }

   toast.success(t("success.registered"));

}else{
  toast.error(t("errors.genericError"));
}



  dispatch(fetchCurrentUser())
  .unwrap()
  .then(() => router.replace("/"))
  .catch(err => {
    console.log(err);
    toast.error(t("errors.fetchUserError"));
    setIsSubmitting(false); 
  });



  }




useEffect(() => {
  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.replace("/"); // redirect ?? ???? register
    } else {
      setCheckingUser(false); // ?????? ???? ??? ????? ?? ???? register
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

       <div className={`flex items-center justify-center min-h-[80vh] bg-white px-4 py-7 ${ locale === "ar" ? "text-right" : "text-left"}`} >

         <div className={`w-full max-w-md border border-gray-200 rounded-2xl p-5 shadow-lg shadow-gray-100 ${ locale === "ar" ? "text-right" : "text-left"}`} >
      
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">{t("title")}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label className={`block text-gray-600 text-sm mb-1 ${locale === "ar" ? "text-right" : "text-left"}`}>
              {t("name")}
            </label>
            
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className={`w-full border p-2.5 rounded-lg outline-none focus:border-[#5F6FFF] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

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
            <label className={`block text-gray-600 text-sm mb-1 ${locale === "ar" ? "text-right" : "text-left"}`}>
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
  disabled={isSubmitting}
  className={`w-full bg-[#5F6FFF] flex items-center justify-center gap-2 text-white py-3 rounded-xl font-medium mt-2 transition-all ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-[#4e5de6]"
  }`}
>
  {isSubmitting ? (
    <>
      <ImSpinner9 className="animate-spin text-xl" />
      <span>{locale === "ar" ? "جاري إنشاء الحساب..." : "Creating Account..."}</span>
    </>
  ) : (
    t("registerButton")
  )}
</button>

          <p className={`text-sm text-gray-600 mt-2 ${locale === "ar" ? "text-right" : "text-left"}`}>
            {t("haveAccount")}
            <Link href={`/login`} className={`text-[#5F6FFF] ${locale === "ar" ? "mr-1" : "ml-1"} hover:underline`}>
              {t("loginHere")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

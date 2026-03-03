"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";
import Image from "next/image";
import ProfileSkeleton from "@/src/components/ProfileSkeleton";
import { AppDispatch, RootState } from "@/src/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, fetchCurrentUser, updateUser } from "@/src/lib/redux/slices/userSlice";
import { useTranslations } from "next-intl";


export default function UserProfile() {

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: user, loading } = useSelector((state: RootState) => state.user);
  const t = useTranslations("Profile");



  useEffect( () => {
    if(!user){
      dispatch( fetchCurrentUser() )
    }
  } ,[dispatch , user ])



const handleSave = async () => {
  const form = document.getElementById("profileForm") as HTMLFormElement;
  const formData = new FormData(form);

  const birthday = formData.get("birthday");
  const updates: any = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    gender: formData.get("gender"),
    birthday: birthday === "" ? null : birthday,
  };

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("auth_id", user?.auth_id);

  if (error) {
    toast.error(t("updateFailed"));
    console.error("Update error:", error);
  } else {

    dispatch(updateUser(updates));

    toast.success(t("updateSuccess"));

    setIsEditing(false);
  }
};


const handleImageUpload = async (e: any) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  setIsUploading(true);

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.auth_id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    if (!data?.publicUrl) throw new Error("Failed to get public URL");

    const imageUrl = data.publicUrl + "?t=" + new Date().getTime();

    const { error: updateError } = await supabase
      .from("users")
      .update({ image: imageUrl })
      .eq("auth_id", user.auth_id);

    if (updateError) throw updateError;

    dispatch(updateUser({ image: imageUrl }));

    toast.success(t("imageUpdated")); 

  } catch (err) {
    console.error(err);
    toast.error(t("imageUploadFailed"));
  } finally {
    setIsUploading(false);
  }
};


const handleDeleteAccount = async () => {
  try {
    if (!user?.auth_id) return;

    setIsDeleting(true);

    // استدعاء API لحذف الحساب من Supabase و الجداول المرتبطة
    const res = await fetch("/api/deleteAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_id: user.auth_id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setIsDeleting(false);
      toast.error(t("accountDeleteFailed"))
      return;
    }

    // تسجيل الخروج 
    await supabase.auth.signOut();

    //بعد حذف الحساب أو تسجيل الخروج
    dispatch(clearUser());

    toast.success(t("accountDeleted"));

    setTimeout(() => {
      window.location.href = "/"; 
    }, 1500);

  } catch (err) {
    console.error(err);
    toast.error(t("somethingWentWrong"));
    setIsDeleting(false);
  }
};



if (loading) return <ProfileSkeleton/> ;



 return (
    <div className="min-h-screen bg-gray50 dark:bg-gray900 pb-10">
      
      {/* Banner */}
      <div className="h-48 bg-linear-to-r from-[#5F6FFF] to-[#7c89ff]" />

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
          
          {/* الرأس */}
          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-blue-100 dark:bg-gray-700 relative flex items-center justify-center">
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 border-4 border-t-[#5F6FFF] border-gray-300 rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-semibold text-[#5F6FFF] animate-pulse">{t("uploading")}</p>
                  </div>
                )}

                <Image
                  src={user?.image || "/images/userPlaceholder.png"}
                  alt={user?.name || t("user")}
                  width={160}
                  height={160}
                  className={`w-full h-full object-cover ${isUploading ? "opacity-30" : ""}`}
                  key={user?.image}
                />

                <input
                  type="file"
                  accept="image/*"
                  id="avatarInput"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <button
                type="button"
                onClick={() => document.getElementById("avatarInput")?.click()}
                className="absolute bottom-2 right-2 p-2 cursor-pointer bg-white dark:bg-gray-700 rounded-xl shadow-md text-[#5F6FFF]"
              >
                <FaCamera size={16} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {user?.name || t("userName")}
              </h1>
              <p className="text-gray-400 dark:text-gray-300">{user?.email}</p>

              <div className="mt-3 flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#5F6FFF] rounded-full z-10"></div>
                  <div className="absolute w-4 h-4 bg-[#5F6FFF] rounded-full animate-ping opacity-40"></div>
                  <div className="absolute w-3 h-3 bg-[#5F6FFF] rounded-full blur-[2px] opacity-60"></div>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-tight">
                  {t("activeAccount")}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-6 py-2 bg-[#5F6FFF] text-white cursor-pointer rounded-2xl font-semibold hover:bg-blue-700 transition-all active:scale-95 shadowlg shadowblue-100"
              >
                {isEditing ? t("saveChanges") : t("editProfile")}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 bg-red-500 text-white cursor-pointer rounded-2xl font-semibold hover:bg-red-600 transition-all active:scale-95 shadowlg shadow-red200"
              >
                {t("deleteAccount")}
              </button>
            </div>
          </div>

          <hr className="my-7 border-gray-200 dark:border-gray-700" />

          {/* البيانات */}
          <form id="profileForm" className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Contact */}
            <div className="space-y-6">
              <SectionTitle title={t("contactInformation")} />
              <InfoRow label={t("fullName")} value={user?.name} name="name" isEditing={isEditing} placeholder={t("enterName")} icon={<FaUser /> }  t={t}/>
              <InfoRow label={t("email")} value={user?.email} isEditing={false} icon={<FaEnvelope />} t={t}/>
              <InfoRow label={t("phone")} value={user?.phone || ""} name="phone" isEditing={isEditing} placeholder={t("addPhone")} icon={<FaPhone />} t={t} />
              <InfoRow label={t("address")} value={user?.address || ""} name="address" isEditing={isEditing} placeholder={t("addAddress")} isTextArea icon={<FaMapMarkerAlt />} t={t}/>
            </div>

            {/* Basic */}
            <div className="space-y-6">
              <SectionTitle title={t("basicInformation")} />
             

              <InfoRow
  label={t("gender")}
  value={user?.gender}
  name="gender"
  isEditing={isEditing}
  isSelect
  options={["Male", "Female"]}
  icon={<FaUser />}
  t={t}
/>




             
              <InfoRow label={t("birthday")} value={user?.birthday} name="birthday" isEditing={isEditing} type="date" icon={<FaCalendarAlt />}  t={t}/>
            </div>

          </form>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <p className="text-gray-800 dark:text-gray-200 mb-4 font-medium">
              {t("confirmDelete")}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className={`px-4 py-2 rounded-lg transition cursor-pointer text-white ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } flex items-center justify-center gap-2`}
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("deleting")}
                  </>
                ) : (
                  t("yes")
                )}
              </button>

              <button
                className="px-4 py-2 bg-gray-200 cursor-pointer dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setShowDeleteModal(false)}
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

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
    <span className="w-6 h-[2px] bg-[#5F6FFF] rounded-full"></span>
    {title}
  </h3>
);

const InfoRow = ({
  icon,
  label,
  value,
  isEditing,
  isTextArea,
  placeholder,
  isSelect,
  options,
  name,
  type,
  t,
}: any) => (
  <div className="flex items-start gap-4 group">
    
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-400  group-hover:text-[#7886FF]  group-hover:bg-blue-50 dark:group-hover:bg-gray-600 transition-all">
      {icon}
    </div>

    <div className="flex-1">
      
      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider">
        {label}
      </p>

      {isEditing ? (
        isSelect ? (
          <select
            name={name}
            defaultValue={value ?? options?.[0]}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          >
            {options?.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>
  {opt === "Male" ? t("male") : t("female")}
</option>
              
            ))}
          </select>
        ) : isTextArea ? (
          <textarea
            name={name}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        ) : (
          <input
            name={name}
            type={type || "text"}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        )
      ) : (
        <p
          className={`font-medium ${
            value
              ? "text-gray-700 dark:text-gray-200"
              : "text-gray-400 dark:text-gray-500 italic"
          }`}
        >
 

          {
  name === "gender" && value
    ? value === "Male"
      ? t("male")
      : value === "Female"
      ? t("female")
      : value
    : value || placeholder || t("notSet")
}

        </p>
      )}
    </div>
  </div>
);

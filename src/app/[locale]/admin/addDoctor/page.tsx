"use client"

import { addDoctor } from "@/src/lib/redux/slices/doctorsSlice";
import { supabase } from "@/src/lib/supabaseClient";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function AddDoctor() {

  const [formData, setFormData] = useState({
    image:"",
    name: "", 
    email: "",
    specialty: "General physician",
    description: "",
    experience_years: 0,
    appointment_fee: 0,
    city: "",
    country: "",
    rating: 0,
  });

  const dispatch = useDispatch()

  const t = useTranslations("AddDoctor");

  const tDocs = useTranslations("Doctors");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData( (prev) => ( { ...prev, [name]: value, } ));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: localPreviewUrl }));

    const fileExt = file.name.split('.').pop();
    const fileName = `doc-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase
      .storage
      .from("doctor-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      toast.error(t("toast.uploadError"));
      return;
    }

    const { data: urlData } = supabase
      .storage
      .from("doctor-images")
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, image: urlData.publicUrl }));
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    
    const dataToSend = { ...formData, name: `Dr. ${formData.name}` };

    try{
      const { data, error } = await supabase
        .from("doctors")
        .insert([dataToSend])
        .select();

      if(error) throw error;

      const doctorId = data[0].id;

      const defaultSchedules = [
        { day: "SUN", start_time: "08:00:00", end_time: "12:00:00" },
        { day: "MON", start_time: "09:00:00", end_time: "13:00:00" },
        { day: "TUE", start_time: "10:00:00", end_time: "14:00:00" },
        { day: "WED", start_time: "11:00:00", end_time: "15:00:00" },
        { day: "THU", start_time: "12:00:00", end_time: "16:00:00" },
        { day: "SAT", start_time: "09:30:00", end_time: "13:30:00" },
      ];

      for (const schedule of defaultSchedules) {
        await supabase.from("doctor_schedule").insert([{
          doctor_id: doctorId,
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        }]);
      }

      dispatch(addDoctor(data[0]));
      toast.success(t("toast.success"));

      setFormData({
        image: "",
        name: "",
        email: "",
        specialty: "General physician",
        description: "",
        experience_years: 0,
        appointment_fee: 0,
        city: "",
        country: "",
        rating: 0,
      });

    }catch(err){
      console.error(err);
      toast.error(t("toast.error"));
    }
  }

  return (
    <div className=" p-1.5 sm:p-3 bg-gray-50 dark:bg-slate-900 min-h-screen">
      
  <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t("title")}</h1>
  
  <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 md:p-8 max-w-4xl">
    
    {/* Upload Section - Centered on mobile */}
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <label className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-blue-400 dark:border-blue-600 transition-colors bg-gray-50 dark:bg-slate-700">
        {formData.image ? (
          <Image
            src={formData.image}
            alt="Doctor"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src={"/images/userPlaceholder.png"}
              alt="Placeholder"
              width={160}
              height={160}
              className="w-12 h-12 dark:opacity-80"
            />
          </div>
        )}
      
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t("photo")}</p>
        {/* <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 2MB</p> */}
      </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
      
      {/* Name */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.name")}</label>
        <input
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all" 
          placeholder={t("placeholders.name")} 
        />
      </div>

      {/* Speciality */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.specialty")}</label>
        <select
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all"
        >
          <option value="General physician">{tDocs("specialties.General physician")}</option>
          <option value="Gynecologist">{tDocs("specialties.Gynecologist")}</option>
          <option value="Dermatologist">{tDocs("specialties.Dermatologist")}</option>
          <option value="Pediatricians">{tDocs("specialties.Pediatricians")}</option>
          <option value="Neurologist">{tDocs("specialties.Neurologist")}</option>
          <option value="Gastroenterologist">{tDocs("specialties.Gastroenterologist")}</option>
        </select>
      </div>

      {/* Experience & Fee  */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.experience")}</label>
          <input
            name="experience_years"
            type="number"
            value={formData.experience_years}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.fees")}</label>
          <input
            name="appointment_fee"
            type="number"
            value={formData.appointment_fee}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all" 
          />
        </div>
      </div>

      {/* Location Grouped */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.city")}</label>
          <input
            name="city"
            placeholder={t("placeholders.city")}
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.country")}</label>
          <input
            name="country"
            placeholder={t("placeholders.country")}
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 outline-none transition-all" 
          />
        </div>
      </div>

    </div>

    {/* Description */}
    <div className="mt-5 space-y-1">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tight">{t("labels.about")}</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-gray-300 dark:placeholder:text-white dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 dark:bg-slate-700 dark:text-gray-100 resize-none outline-none transition-all"
        rows={4}
        placeholder={t("placeholders.about")}
      />
    </div>

    <div className="mt-8 flex justify-center md:justify-start">
      <button 
        type="submit"
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-3 rounded-xl shadowlg shadow-blue100 dark:shadow-blue-900 transition-all active:scale-95"
      >
        {t("button")}
      </button>
    </div>

  </form>

</div>
  );
}
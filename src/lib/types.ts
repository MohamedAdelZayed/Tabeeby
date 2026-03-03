
export type doctorType = {
  appointment_fee:number;
  available:boolean;
  description_en: string; // الوصف بالإنجليزية
  description_ar: string; // الوصف بالعربية
  experience_years:number;
  id:number;
  image:string;
  name:string;
  rating:number;
  specialty:string;
  city:string,
  country:string
}


export interface UserType {
  id: number | null;
  auth_id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  gender: string | null;
  birthday: string | null;
  phone: string | null;
  address: string | null;
  created_at: string | null;
  isLoggedIn: boolean;
}


export type SpecialtyType = {
  id: number;
  name: string;
  icon: string;
}


export type SlotType = {
  created_at: string
  day: string
  doctor_id: number
  end_time: string
  id: number
  start_time: string
}


export interface AppointmentType {
  id: number;
  appointment_date: string;
  appointment_time: string;
  fees: number;
  specialty?: string;
  doctor_id?: number;
  doctor_name?: string;
  doctor_Image?: string;
  patient: {
    id: number;
    name: string;
    image?: string;
    birthday?: string | null;
  };
  is_paid: boolean
}
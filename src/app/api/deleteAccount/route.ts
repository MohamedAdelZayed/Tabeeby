import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// تعريف الـ Client بقيم احتياطية لضمان نجاح الـ Build في Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // التأكد من وجود المفتاح الحقيقي وقت التشغيل
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const body = await req.json();
    const { auth_id } = body;
    if (!auth_id) return NextResponse.json({ error: "No auth_id provided" }, { status: 400 });

    // 1. حذف المواعيد المرتبطة بالمريض أولاً (باستخدام patient_id)
    await supabaseAdmin.from("appointments").delete().eq("patient_id", auth_id);

    // 2. حذف بيانات المستخدم من جدول users
    const { error: userError } = await supabaseAdmin.from("users").delete().eq("auth_id", auth_id);
    if (userError) throw userError;

    // 3. حذف الحساب نهائياً من Supabase Auth (يتطلب Service Role)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth_id);
    if (authError) throw authError;

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete account" }, { status: 500 });
  }
}
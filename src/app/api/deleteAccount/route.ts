import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Client بسيرفر مع Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auth_id } = body;
    if (!auth_id) return NextResponse.json({ error: "No auth_id provided" }, { status: 400 });

    // حذف البيانات المرتبطة أولًا
    await supabaseAdmin.from("appointments").delete().eq("user_id", auth_id);

    // حذف بيانات المستخدم من جدول users
    const { error: userError } = await supabaseAdmin.from("users").delete().eq("auth_id", auth_id);
    if (userError) throw userError;

    // حذف الحساب من Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth_id);
    if (authError) throw authError;

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete account" }, { status: 500 });
  }
}

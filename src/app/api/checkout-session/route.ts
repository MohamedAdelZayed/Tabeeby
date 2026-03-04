import Stripe from "stripe";
import { NextResponse } from "next/server";

// 1. تعريف المفتاح مع قيمة احتياطية وهمية لمنع فشل الـ Build
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

// 2. إنشاء الـ instance بدون علامة التعجب "!"
const stripe = new Stripe(stripeSecretKey);

// دالة POST الخاصة بـ API route /api/checkout-session
// أي fetch من الكومبوننت بالـ POST هينفذ الكود ده على السيرفر
export async function POST(req: Request) {
  try {
    // قراءة البيانات المرسلة من المتصفح
    // دي نفس البيانات اللي بعتناها بالكومبوننت:
    // appointmentId, doctorName, amount, locale
    const { appointmentId, doctorName, amount, locale } = await req.json();

    // إنشاء Checkout Session جديد على Stripe
    // هذا هو اللي هيرجع رابط صفحة الدفع
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // طرق الدفع المقبولة
      locale: "en", // لغة صفحة الدفع (يمكن تعديلها حسب احتياجك)
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              // اسم ووصف الخدمة يمكن ترجمته حسب اللغة
              name: locale === "ar" ? `${doctorName} : كشف طبي` : `Medical Session: ${doctorName}`,
              description: locale === "ar" ? `حجز موعد رقم: #${appointmentId}` : `Booking Ref: #${appointmentId}`,
            },
            unit_amount: Math.round(Number(amount) * 100), // تحويل السعر من دولار لسنت
          },
          quantity: 1,
        },
      ],
      // الرابط اللي هيتم تحويل المستخدم ليه بعد الدفع الناجح
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/my-appointments?success=true&appointmentId=${appointmentId}`,
      // الرابط لو المستخدم لغى الدفع
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/my-appointments?canceled=true`,
    });

    // إرسال رابط الجلسة للمتصفح على شكل JSON
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    // في حالة حدوث أي خطأ، نرجع رسالة خطأ للمتصفح
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
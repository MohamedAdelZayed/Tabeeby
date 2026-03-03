import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // اللغات المدعومة
  locales: ['en', 'ar'],
  // اللغة الافتراضية إذا لم يتم تحديد لغة
  defaultLocale: 'en',
  // لإظهار رمز اللغة دائماً في الرابط (مثل /en/...)
  localePrefix: 'always' 
});

export const config = {
  // يستثني ملفات الميديا والـ api والـ _next
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};



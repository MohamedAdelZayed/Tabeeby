export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-start pt-24 overflow-hidden">

      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-linear-to-r from-[#5F6FFF] to-[#7c89ff] blur-3xl opacity-20 dark:opacity-30 -z-10"></div>
      <div className="max-w-4xl w-full px-4 relative">
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white dark:border-gray-700">
          
          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl animate-pulse bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-md animate-pulse"></div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 w-full">
              <div className="h-8 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto md:mx-0"></div>
              <div className="h-4 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md mx-auto md:mx-0"></div>
              <div className="flex justify-center md:justify-start gap-2 pt-2">
                <div className="w-20 h-6 animate-pulse bg-gray-100 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>

            <div className="w-32 h-12 animate-pulse bg-[#5F6FFF]/20 dark:bg-[#5F6FFF]/30 rounded-2xl hidden md:block"></div>
          </div>

          <hr className="my-10 border-gray-100 dark:border-gray-700" />

          {/* Form Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-700 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Loader */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#5F6FFF] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#5F6FFF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[#5F6FFF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 tracking-widest uppercase">
            Syncing your profile
          </span>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl"; 

type Service = {
  title: string;
  description: string;
  image: string;
};

export default function Services() {
  const t = useTranslations("Services");

  const services: Service[] = [
    {
      title: t("mentalHealth.title"),
      description: t("mentalHealth.description"),
      image: "/images/Mental.jpg",
    },
    {
      title: t("neurology.title"),
      description: t("neurology.description"),
      image: "/images/Neurology.jpg",
    },
    {
      title: t("burnTreatment.title"),
      description: t("burnTreatment.description"),
      image: "/images/Burn.jpg",
    },
    {
      title: t("cancerCare.title"),
      description: t("cancerCare.description"),
      image: "/images/cancer.png",
    },
    {
      title: t("laborDelivery.title"),
      description: t("laborDelivery.description"),
      image: "/images/Labor.jpg",
    },
    {
      title: t("heartVascular.title"),
      description: t("heartVascular.description"),
      image: "/images/heart.png",
    },
  ];

  return (
    <section className="relative py-10 overflow-hidden ">
      <div className="absolute top-32 -right-20 w-125 h-125 bg-[#5F6FFF]/8 dark:bg-[#5F6FFF]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-150 h-150 bg-[#5F6FFF]/6 dark:bg-[#5F6FFF]/10 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(95,111,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(95,111,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            <span className="text-gray-400 dark:text-gray-500 font-light">{t("our")}</span>
            <span className="text-gray-900 dark:text-white">{t("medicalServices")}</span>
          </h2>
          <div className="h-1.5 w-24 bg-linear-to-r from-[#5F6FFF] to-[#5F6FFF]/50 mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-6 lg:px8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: `slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
              }}
            >
              <div className="relative h-full py-1 bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-500 overflow-hidden group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-[#5F6FFF]/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#5F6FFF] via-[#5F6FFF]/60 to-[#5F6FFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="relative p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#5F6FFF]/20 to-[#5F6FFF]/5 group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative w-full h-full rounded-full overflow-hidden border border-[#5F6FFF]/20 flex items-center justify-center shadow-inner">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#5F6FFF] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#5F6FFF]/0 to-transparent opacity-0 group-hover:opacity-100 group-hover:from-[#5F6FFF]/10 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
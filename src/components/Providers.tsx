"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
import { NextIntlClientProvider } from "next-intl";

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Provider store={store}>{children}</Provider>
    </NextIntlClientProvider>
  );
}
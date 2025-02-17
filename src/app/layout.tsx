import "./globals.css";
import {ReactNode} from "react";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";



export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: ReactNode;
}>) {

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body>
        <div className={"p-4"}>
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </div>
        </body>
        </html>
    );
}

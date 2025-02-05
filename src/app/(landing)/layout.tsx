import "@style/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans , Montserrat, Nunito_Sans} from "next/font/google";
import {cn} from "@lib/tailwind-merge";
import { ThemeProvider } from "@layout/global-theme";
import {HeroUIProvider} from "@heroui/react";
import ToastLayout from '@layout/toastify.tsx';
import JotaiProvider from '@provider/jotai-provider.tsx';

const montserrat = Montserrat({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
})
const nunito_sans = Nunito_Sans({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
});

const fontSans = FontSans({
    subsets: ['latin', 'vietnamese'],
    display: "swap",
    variable: '--font-sans',
});

export const metadata: Metadata = {

};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Also supported but less commonly used
    // interactiveWidget: 'resizes-visual',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}): JSX.Element {
    // return redirect('/login');
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={"overscroll-contain scroll-smooth"}
        >
        {/*<head>*/}
        {/*	<link*/}
        {/*		rel="manifest"*/}
        {/*		href="/manifest.json"*/}
        {/*	/>*/}
        {/*	<title></title>*/}
        {/*</head>*/}
        <body className={cn(nunito_sans.className, "min-h-dvh  antialiased ")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            // enableSystem
            forcedTheme={'light'}
        >
            <ToastLayout>
                <JotaiProvider>
                    <HeroUIProvider>
                        {children}
                    </HeroUIProvider>
                </JotaiProvider>
            </ToastLayout>
        </ThemeProvider>
        </body>
        </html>
    );
}

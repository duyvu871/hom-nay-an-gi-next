import "@style/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import {cn} from "@lib/tailwind-merge";
import { ThemeProvider } from "@layout/global-theme";
import {HeroUIProvider} from "@heroui/react";
const fontSans = FontSans({
    subsets: ['latin', 'vietnamese'],
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
            className={"overscroll-contain scroll-smooth dark"}
        >
        {/*<head>*/}
        {/*	<link*/}
        {/*		rel="manifest"*/}
        {/*		href="/manifest.json"*/}
        {/*	/>*/}
        {/*	<title></title>*/}
        {/*</head>*/}
        <body className={cn(fontSans.className, "min-h-dvh  font-sans antialiased ")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            // enableSystem
            forcedTheme={'dark'}
        >
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

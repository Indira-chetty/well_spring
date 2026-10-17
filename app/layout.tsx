import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Wellspring — Your mission, moving forward",description:"A connected workspace for funding, programmes, finance and communications."};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }

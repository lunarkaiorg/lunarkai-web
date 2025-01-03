import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { AppKitContextProvider } from "./contexts/AppKitContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";
import { PaymentContextProvider } from "./contexts/PaymentContext";
import { baseContainerStyleCss } from "./constants";

const font = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Lunark AI',
  description: 'Lunark AI is your blockchain companion powered by dual intelligence - combining a conversational assistant that speaks your language with an autonomous agent that makes things happen. It turns complex blockchain operations into simple conversations, handling all the technical details while you focus on what matters.',
  authors: [{ name: 'Lunark AI' }],
  icons: {
    icon: [
      {
        url: '/images/icons/icon-dark.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/icons/icon-light.svg',
        media: '(prefers-color-scheme: dark)',
      }
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <GlobalContextProvider>
          <AppKitContextProvider>
            <UserContextProvider>
              <PaymentContextProvider>
                {children}
                <Toaster 
                  position="top-center" 
                  toastOptions={{ 
                    style: {
                      padding: "6px 6px 6px 14px",
                      borderRadius: "0.75rem",
                      position: "relative",
                      ...baseContainerStyleCss
                    }
                  }}
                />
              </PaymentContextProvider>
            </UserContextProvider>
          </AppKitContextProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
}

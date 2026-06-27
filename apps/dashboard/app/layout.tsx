import type { Metadata, ReactNode, Viewport } from "next";

export const metadata: Metadata = {
  title: "Auto Chat",
  description: "Governed WhatsApp and social conversation command center",
  applicationName: "Auto Chat",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Auto Chat",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [{ url: "/icons/auto-chat-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/auto-chat-icon.svg", type: "image/svg+xml" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#39ff14"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

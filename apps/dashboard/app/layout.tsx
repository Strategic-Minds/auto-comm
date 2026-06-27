import type { ReactNode } from "react";

export const metadata = {
  title: "Auto Chat",
  description: "Governed WhatsApp and social conversation command center"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

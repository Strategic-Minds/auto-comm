export const metadata = {
  title: "AUTO COMM",
  description: "Governed WhatsApp lead generation command center"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

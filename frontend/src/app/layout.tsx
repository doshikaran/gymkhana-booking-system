import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import "./globals.css";

export const metadata = {
  title: "Jolly Gymkhana Sports center",
  description: "Mobile-first court booking",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ReactQueryProvider>
          <ToasterProvider />
          <div className="max-w-md mx-auto min-h-screen flex flex-col">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

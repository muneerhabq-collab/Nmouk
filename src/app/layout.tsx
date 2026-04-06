import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'نموّك | استراتيجية العلامة التجارية بالذكاء الاصطناعي',
  description: 'توليد ذكي لهوية العلامة التجارية واستراتيجيات التسويق.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Tajawal:wght@200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/20">{children}</body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter, Exo_2 } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';


const inter = Inter({ subsets: ['latin'] });
const exo2 = Exo_2({ 
  subsets: ['latin'],
  variable: '--font-exo2',
});

export const metadata: Metadata = {
  title: 'Moqa - Test and Debug Webhooks',
  description: 'A powerful webhook testing and debugging service',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${exo2.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

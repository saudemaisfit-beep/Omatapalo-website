import type { Metadata } from "next";
import "./globals.css";
import { createClient } from '@/lib/supabase/server';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: "Grupo Omatapalo — Fazemos Acontecer",
  description: "Grupo Omatapalo: Engenharia, Construção, Agroindústria, Imobiliário, Energia, Hotelaria e Infraestrutura em Angola e além.",
  keywords: "Omatapalo, Angola, construção, engenharia, infraestrutura, grupo empresarial",
  icons: {
    icon: '/Five-icon-OMATAPALO.png',
    shortcut: '/Five-icon-OMATAPALO.png',
    apple: '/Five-icon-OMATAPALO.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId = '';
  try {
    const db = await createClient();
    const { data } = await db.from('site_settings').select('value').eq('key', 'ga_tracking_id').single();
    if (data?.value) gaId = data.value;
  } catch {}

  return (
    <html lang="pt" className="h-full">
      <body className="min-h-full">
        {children}
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}

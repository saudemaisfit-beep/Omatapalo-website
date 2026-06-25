import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'CMS — Omatapalo Admin' };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

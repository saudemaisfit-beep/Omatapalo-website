'use client';
import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const NAV = [
  { href: '/admin',            label: 'Dashboard',  icon: '⊞' },
  { href: '/admin/posts',      label: 'Notícias',   icon: '📰' },
  { href: '/admin/portfolio',  label: 'Portfólio',  icon: '🏗️' },
  { href: '/admin/pages',      label: 'Páginas',    icon: '📄' },
  { href: '/admin/media',         label: 'Media',        icon: '🖼️' },
  { href: '/admin/certificacoes',    label: 'Certificações',    icon: '🏅' },
  { href: '/admin/identidade-visual', label: 'Id. Visual',       icon: '🎨' },
  { href: '/admin/users',         label: 'Utilizadores',  icon: '👥' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    });
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#64748b', fontSize: 14 }}>A carregar...</div>
    </div>
  );

  async function logout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#07101f', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Grupo Omatapalo</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>CMS Admin</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <a key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                background: active ? '#1a396e' : 'transparent',
                color: active ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: active ? 600 : 400,
                textDecoration: 'none', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          <button onClick={logout} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: '#94a3b8', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
            Sair →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [
    { count: postsCount },
    { count: portfolioCount },
    { count: pagesCount },
    { count: mediaCount },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    supabase.from('media').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Notícias',  value: postsCount ?? 0,     href: '/admin/posts',     color: '#1a396e' },
    { label: 'Projetos',  value: portfolioCount ?? 0,  href: '/admin/portfolio', color: '#0f766e' },
    { label: 'Páginas',   value: pagesCount ?? 0,      href: '/admin/pages',     color: '#7c3aed' },
    { label: 'Ficheiros', value: mediaCount ?? 0,      href: '/admin/media',     color: '#b45309' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>Bem-vindo ao painel de gestão do Grupo Omatapalo.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <a key={s.label} href={s.href} style={{ textDecoration: 'none', background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'block', transition: 'box-shadow 0.2s' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Acções rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '+ Nova notícia', href: '/admin/posts/new' },
              { label: '+ Novo projeto', href: '/admin/portfolio/new' },
              { label: '+ Nova página',  href: '/admin/pages/new' },
              { label: '+ Upload media', href: '/admin/media' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ display: 'block', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 14, color: '#1a396e', fontWeight: 600, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                {a.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Acerca do CMS</h2>
          <ul style={{ fontSize: 13, color: '#64748b', lineHeight: 2, paddingLeft: 16 }}>
            <li>Notícias publicáveis com editor rico</li>
            <li>Portfólio de obras com galeria</li>
            <li>Gestão de páginas e SEO</li>
            <li>Biblioteca de media centralizada</li>
            <li>Conteúdos sincronizados com o site</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

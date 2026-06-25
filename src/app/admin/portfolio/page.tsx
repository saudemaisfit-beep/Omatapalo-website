import { createClient } from '@/lib/supabase/server';

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Portfólio</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>{projects?.length ?? 0} projetos</p>
        </div>
        <a href="/admin/portfolio/new" style={{ background: '#1a396e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          + Novo projeto
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {projects?.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Nenhum projeto ainda. Cria o primeiro!</div>
        )}
        {projects?.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ aspectRatio: '16/9', background: '#f1f5f9', overflow: 'hidden' }}>
              {p.cover_image
                ? <img src={p.cover_image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>Sem imagem</div>
              }
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eff6ff', color: '#1a396e', padding: '2px 8px', borderRadius: 20 }}>{p.category}</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: p.published ? '#dcfce7' : '#f1f5f9', color: p.published ? '#16a34a' : '#64748b', padding: '2px 8px', borderRadius: 20 }}>{p.published ? 'Pub.' : 'Rascunho'}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{p.title}</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>{p.location} {p.year ? `· ${p.year}` : ''}</p>
              <a href={`/admin/portfolio/${p.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#1a396e', textDecoration: 'none', padding: '6px 14px', border: '1px solid #1a396e', borderRadius: 6, display: 'inline-block' }}>Editar</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

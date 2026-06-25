import { createClient } from '@/lib/supabase/server';

export default async function PagesAdmin() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from('pages').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Páginas</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>{pages?.length ?? 0} páginas</p>
        </div>
        <a href="/admin/pages/new" style={{ background: '#1a396e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>+ Nova página</a>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              {['Título', 'Slug', 'Estado', 'Data', 'Acções'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages?.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Nenhuma página ainda.</td></tr>}
            {pages?.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p.title}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>/{p.slug}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.published ? '#dcfce7' : '#f1f5f9', color: p.published ? '#16a34a' : '#64748b' }}>
                    {p.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{new Date(p.created_at).toLocaleDateString('pt-PT')}</td>
                <td style={{ padding: '14px 16px' }}>
                  <a href={`/admin/pages/${p.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#1a396e', textDecoration: 'none', padding: '5px 12px', border: '1px solid #1a396e', borderRadius: 6 }}>Editar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

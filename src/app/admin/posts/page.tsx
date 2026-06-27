'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Post = { id: string; title: string; slug: string; published: boolean; created_at: string };

export default function PostsPage() {
  const supabase = createClient();
  const [posts, setPosts]         = useState<Post[]>([]);
  const [filter, setFilter]       = useState<'todos' | 'publicado' | 'rascunho'>('todos');
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('id,title,slug,published,created_at').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setSelected(new Set());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = posts.filter(p => {
    const matchFilter = filter === 'todos' || (filter === 'publicado' ? p.published : !p.published);
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const allChecked = filtered.length > 0 && filtered.every(p => selected.has(p.id));

  function toggleAll() {
    if (allChecked) {
      setSelected(prev => { const s = new Set(prev); filtered.forEach(p => s.delete(p.id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); filtered.forEach(p => s.add(p.id)); return s; });
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  async function applyBulk() {
    if (!bulkAction || selected.size === 0) return;
    const ids = Array.from(selected);
    if (bulkAction === 'publicar') {
      await supabase.from('posts').update({ published: true }).in('id', ids);
    } else if (bulkAction === 'rascunho') {
      await supabase.from('posts').update({ published: false }).in('id', ids);
    } else if (bulkAction === 'eliminar') {
      if (!confirm(`Eliminar ${ids.length} notícia(s)? Esta acção é irreversível.`)) return;
      await supabase.from('posts').delete().in('id', ids);
    }
    setBulkAction('');
    load();
  }

  async function togglePublish(post: Post) {
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id);
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
  }

  const counts = {
    todos:     posts.length,
    publicado: posts.filter(p => p.published).length,
    rascunho:  posts.filter(p => !p.published).length,
  };

  const tabStyle = (t: typeof filter) => ({
    padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: filter === t ? '#1a396e' : 'transparent',
    color: filter === t ? '#fff' : '#64748b',
    border: 'none',
  } as React.CSSProperties);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Notícias</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>{posts.length} artigos no total</p>
        </div>
        <a href="/admin/posts/new" style={{ background: '#1a396e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>+ Nova notícia</a>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, background: '#f1f5f9', padding: 4, borderRadius: 8, width: 'fit-content' }}>
        {(['todos', 'publicado', 'rascunho'] as const).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => { setFilter(t); setSelected(new Set()); }}>
            {t === 'todos' ? 'Todos' : t === 'publicado' ? 'Publicados' : 'Rascunhos'}
            <span style={{ marginLeft: 6, background: filter === t ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: filter === t ? '#fff' : '#475569', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar notícias…"
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: 260, outline: 'none', color: '#0f172a' }}
        />
        <select
          value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer' }}
        >
          <option value="">Acção em bloco…</option>
          <option value="publicar">✅ Publicar seleccionadas</option>
          <option value="rascunho">📝 Mover para rascunho</option>
          <option value="eliminar">🗑 Eliminar seleccionadas</option>
        </select>
        <button
          onClick={applyBulk}
          disabled={!bulkAction || selected.size === 0}
          style={{ padding: '8px 18px', background: bulkAction && selected.size > 0 ? '#1a396e' : '#e2e8f0', color: bulkAction && selected.size > 0 ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: bulkAction && selected.size > 0 ? 'pointer' : 'default' }}
        >
          Aplicar {selected.size > 0 ? `(${selected.size})` : ''}
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', width: 40 }}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: 'pointer', width: 15, height: 15 }} />
              </th>
              {['Título', 'Estado', 'Data', 'Acções'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>A carregar…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Nenhuma notícia encontrada.</td></tr>}
            {filtered.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9', background: selected.has(post.id) ? '#eff6ff' : 'transparent' }}>
                <td style={{ padding: '12px 16px' }}>
                  <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleOne(post.id)} style={{ cursor: 'pointer', width: 15, height: 15 }} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{post.title}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>/{post.slug}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => togglePublish(post)}
                    style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: post.published ? '#dcfce7' : '#f1f5f9', color: post.published ? '#16a34a' : '#64748b' }}
                  >
                    {post.published ? '● Publicado' : '○ Rascunho'}
                  </button>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{new Date(post.created_at).toLocaleDateString('pt-PT')}</td>
                <td style={{ padding: '14px 16px', display: 'flex', gap: 8 }}>
                  <a href={`/admin/posts/${post.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#1a396e', textDecoration: 'none', padding: '5px 12px', border: '1px solid #1a396e', borderRadius: 6 }}>Editar</a>
                  <a href={`/noticias/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textDecoration: 'none', padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}>Ver</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

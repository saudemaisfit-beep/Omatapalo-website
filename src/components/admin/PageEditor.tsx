'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Page = { id?: string; title?: string; slug?: string; content?: string; seo_title?: string; seo_desc?: string; published?: boolean; };

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function PageEditor({ page }: { page?: Page }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ title: page?.title ?? '', slug: page?.slug ?? '', content: page?.content ?? '', seo_title: page?.seo_title ?? '', seo_desc: page?.seo_desc ?? '', published: page?.published ?? false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'title' && !page?.id) setForm(f => ({ ...f, title: value as string, slug: slugify(value as string) }));
  }

  async function save(publish?: boolean) {
    setSaving(true); setMsg('');
    const payload = { ...form, published: publish !== undefined ? publish : form.published };
    let error;
    if (page?.id) { ({ error } = await supabase.from('pages').update(payload).eq('id', page.id)); }
    else { ({ error } = await supabase.from('pages').insert(payload)); }
    setSaving(false);
    if (error) setMsg('Erro: ' + error.message);
    else { setMsg('Guardado!'); setTimeout(() => router.push('/admin/pages'), 800); }
  }

  async function del() {
    if (!page?.id || !confirm('Apagar esta página?')) return;
    await supabase.from('pages').delete().eq('id', page.id);
    router.push('/admin/pages');
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <a href="/admin/pages" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Páginas</a>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>{page?.id ? 'Editar Página' : 'Nova Página'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {page?.id && <button onClick={del} style={{ padding: '9px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apagar</button>}
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '9px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Rascunho</button>
          <button onClick={() => save(true)} disabled={saving} style={{ padding: '9px 18px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'A guardar...' : 'Publicar'}</button>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 20, padding: '10px 16px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, fontSize: 13, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Título</label>
            <input style={{ ...inp, fontSize: 18, fontWeight: 700 }} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Título da página" />
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Conteúdo</label>
            <textarea style={{ ...inp, minHeight: 400, resize: 'vertical', lineHeight: 1.7 }} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Conteúdo da página..." />
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>SEO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Meta título</label>
                <input style={inp} value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="Título SEO" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Meta descrição</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={form.seo_desc} onChange={e => set('seo_desc', e.target.value)} placeholder="Descrição para motores de busca..." />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 12 }}>Estado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Publicado
            </label>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Slug (URL)</label>
            <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="slug-da-pagina" />
          </div>
        </div>
      </div>
    </div>
  );
}

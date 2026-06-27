'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import MediaPicker from './MediaPicker';

type Post = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category?: string;
  published?: boolean;
};

const CATEGORIES = ['Geral', 'Construção', 'Energia', 'Mineração', 'Responsabilidade Social', 'Sustentabilidade', 'Comunidade'];

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    cover_image: post?.cover_image ?? '',
    category: post?.category ?? 'Geral',
    published: post?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaPicker, setMediaPicker] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'title' && !post?.id) {
      setForm(f => ({ ...f, title: value as string, slug: slugify(value as string) }));
    }
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `posts/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
      set('cover_image', publicUrl);
      await supabase.from('media').insert({ name: file.name, url: publicUrl, mime_type: file.type, size: file.size });
    }
    setUploading(false);
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setMsg('');
    const payload = { ...form, published: publish !== undefined ? publish : form.published };
    let error;
    if (post?.id) {
      ({ error } = await supabase.from('posts').update(payload).eq('id', post.id));
    } else {
      ({ error } = await supabase.from('posts').insert(payload));
    }
    setSaving(false);
    if (error) setMsg('Erro: ' + error.message);
    else { setMsg('Guardado!'); setTimeout(() => router.push('/admin/posts'), 800); }
  }

  async function deletePost() {
    if (!post?.id || !confirm('Apagar esta notícia?')) return;
    await supabase.from('posts').delete().eq('id', post.id);
    router.push('/admin/posts');
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {mediaPicker && <MediaPicker onSelect={url => set('cover_image', url)} onClose={() => setMediaPicker(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <a href="/admin/posts" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Notícias</a>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>{post?.id ? 'Editar Notícia' : 'Nova Notícia'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {post?.id && <button onClick={deletePost} style={{ padding: '9px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apagar</button>}
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '9px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Guardar rascunho</button>
          <button onClick={() => save(true)} disabled={saving} style={{ padding: '9px 18px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {saving ? 'A guardar...' : 'Publicar'}
          </button>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 20, padding: '10px 16px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, fontSize: 13, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Título</label>
            <input style={{ ...inp, fontSize: 18, fontWeight: 700 }} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Título da notícia" />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Resumo</label>
            <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Breve descrição da notícia..." />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Conteúdo</label>
            <textarea style={{ ...inp, minHeight: 380, resize: 'vertical', lineHeight: 1.7 }} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Conteúdo completo da notícia..." />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 12 }}>Estado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} style={{ width: 16, height: 16 }} />
              Publicado
            </label>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Slug (URL)</label>
            <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="slug-da-noticia" />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Categoria</label>
            <select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 12 }}>Imagem de capa</label>
            {form.cover_image
              ? <div style={{ position: 'relative', marginBottom: 10 }}>
                  <img src={form.cover_image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 6 }} />
                  <button onClick={() => set('cover_image', '')} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
                </div>
              : <div onClick={() => setMediaPicker(true)} style={{ width: '100%', aspectRatio: '16/9', background: '#f1f5f9', borderRadius: 6, marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed #cbd5e1', gap: 8 }}>
                  <span style={{ fontSize: 28 }}>🖼</span>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Escolher imagem</span>
                </div>
            }
            <button onClick={() => setMediaPicker(true)} style={{ width: '100%', padding: '9px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#1a396e', cursor: 'pointer', marginBottom: 8 }}>
              📁 {form.cover_image ? 'Alterar imagem' : 'Seleccionar da biblioteca'}
            </button>
            {uploading && <div style={{ fontSize: 12, color: '#1a396e', marginBottom: 6 }}>A fazer upload...</div>}
            <input style={{ ...inp, fontSize: 12 }} value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="ou colar URL directo" />
          </div>
        </div>
      </div>
    </div>
  );
}

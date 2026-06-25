'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Project = {
  id?: string; title?: string; slug?: string; description?: string;
  category?: string; client?: string; location?: string; year?: number;
  fiscalizacao?: string; cover_image?: string; images?: string[]; featured?: boolean; published?: boolean;
};

const CATEGORIES = [
  { id: 'inst',      label: 'Edifícios Institucionais' },
  { id: 'saude',     label: 'Saúde' },
  { id: 'ensino',    label: 'Ensino' },
  { id: 'habitacao', label: 'Habitação e Escritórios' },
  { id: 'recintos',  label: 'Recintos Desportivos, Culturais e Comerciais' },
  { id: 'agro',      label: 'Agricultura e Indústria' },
  { id: 'turismo',   label: 'Turismo e Lazer' },
  { id: 'vias',      label: 'Vias de Comunicação' },
  { id: 'pontes',    label: 'Pontes e Viadutos' },
  { id: 'infra',     label: 'Infra-estruturas' },
  { id: 'oilgas',    label: 'Oil & Gas' },
  { id: 'energia',   label: 'Energia' },
];

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function ProjectEditor({ project }: { project?: Project }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    title: project?.title ?? '', slug: project?.slug ?? '', description: project?.description ?? '',
    category: project?.category ?? 'inst', client: project?.client ?? '',
    location: project?.location ?? '', fiscalizacao: project?.fiscalizacao ?? '', year: project?.year ?? new Date().getFullYear(),
    cover_image: project?.cover_image ?? '', images: project?.images ?? [],
    featured: project?.featured ?? false, published: project?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'title' && !project?.id) {
      setForm(f => ({ ...f, title: value as string, slug: slugify(value as string) }));
    }
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const path = `portfolio/${Date.now()}-cover.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
      set('cover_image', publicUrl);
      await supabase.from('media').insert({ name: file.name, url: publicUrl, mime_type: file.type, size: file.size });
    }
    setUploading(false);
  }

  async function uploadGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const path = `portfolio/${Date.now()}-${file.name}`;
      const { data } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
        urls.push(publicUrl);
        await supabase.from('media').insert({ name: file.name, url: publicUrl, mime_type: file.type, size: file.size });
      }
    }
    set('images', [...form.images, ...urls]);
    setUploading(false);
  }

  async function save(publish?: boolean) {
    setSaving(true); setMsg('');
    const payload = { ...form, published: publish !== undefined ? publish : form.published };
    let error;
    if (project?.id) { ({ error } = await supabase.from('portfolio_projects').update(payload).eq('id', project.id)); }
    else { ({ error } = await supabase.from('portfolio_projects').insert(payload)); }
    setSaving(false);
    if (error) setMsg('Erro: ' + error.message);
    else { setMsg('Guardado!'); setTimeout(() => router.push('/admin/portfolio'), 800); }
  }

  async function del() {
    if (!project?.id || !confirm('Apagar este projeto?')) return;
    await supabase.from('portfolio_projects').delete().eq('id', project.id);
    router.push('/admin/portfolio');
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <a href="/admin/portfolio" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Portfólio</a>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>{project?.id ? 'Editar Projeto' : 'Novo Projeto'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {project?.id && <button onClick={del} style={{ padding: '9px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apagar</button>}
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '9px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Rascunho</button>
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
            <input style={{ ...inp, fontSize: 18, fontWeight: 700 }} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nome do projeto" />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Descrição</label>
            <textarea style={{ ...inp, minHeight: 180, resize: 'vertical', lineHeight: 1.7 }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descreve o projeto..." />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 12 }}>Galeria de imagens</label>
            <input type="file" accept="image/*" multiple onChange={uploadGallery} style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }} />
            {uploading && <div style={{ fontSize: 12, color: '#1a396e', marginBottom: 12 }}>A fazer upload...</div>}
            {form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                {form.images.map((url, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    <button onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11, lineHeight: '20px', padding: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 10 }}>Estado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Publicado
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Destaque
            </label>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Categoria</label>
            <select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Cliente</label>
              <input style={inp} value={form.client} onChange={e => set('client', e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Localização</label>
              <input style={inp} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Luanda, Angola" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Fiscalização</label>
              <input style={inp} value={form.fiscalizacao} onChange={e => set('fiscalizacao', e.target.value)} placeholder="Entidade fiscalizadora" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Ano</label>
              <input style={inp} type="number" value={form.year} onChange={e => set('year', parseInt(e.target.value))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Slug</label>
              <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="nome-do-projeto" />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 12 }}>Imagem de capa</label>
            {form.cover_image && <img src={form.cover_image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />}
            <input type="file" accept="image/*" onChange={uploadCover} style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }} />
            <input style={{ ...inp, fontSize: 12 }} value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="ou URL directo" />
          </div>
        </div>
      </div>
    </div>
  );
}

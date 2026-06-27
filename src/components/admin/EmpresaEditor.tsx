'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from './MediaPicker';
import type { Company } from '@/data/empresas';

interface Props {
  company: Company;
  initialDescription: string;
  initialGallery: string[];
}

export default function EmpresaEditor({ company, initialDescription, initialGallery }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [description, setDescription] = useState(initialDescription);
  const [gallery, setGallery] = useState<string[]>(initialGallery);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [mediaPicker, setMediaPicker] = useState(false);

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

  async function save() {
    setSaving(true);
    setMsg('');
    const { error } = await supabase.from('empresas').upsert({
      slug: company.slug,
      full_description: description,
      gallery,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' });
    setSaving(false);
    if (error) setMsg('Erro: ' + error.message);
    else { setMsg('Guardado!'); setTimeout(() => router.refresh(), 800); }
  }

  function removeImage(url: string) {
    setGallery(g => g.filter(u => u !== url));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {mediaPicker && (
        <MediaPicker
          onSelect={url => setGallery(g => [...g, url])}
          onClose={() => setMediaPicker(false)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <a href="/admin/empresas" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Empresas</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            {company.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo} alt={company.name} style={{ height: 40, objectFit: 'contain' }} />
            )}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>{company.name}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={`/empresas/${company.slug}`} target="_blank" rel="noopener noreferrer" style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ver página →</a>
          <button onClick={save} disabled={saving} style={{ padding: '9px 22px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 20, padding: '10px 16px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, fontSize: 13, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Descrição */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Descrição</label>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 12px' }}>Separa os parágrafos com uma linha em branco (Enter duas vezes).</p>
          <textarea
            style={{ ...inp, minHeight: 280, resize: 'vertical', lineHeight: 1.7 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Escreve a descrição da empresa aqui..."
          />
        </div>

        {/* Galeria */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>Galeria de Imagens</label>
            <button onClick={() => setMediaPicker(true)} style={{ padding: '7px 16px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              + Adicionar imagem
            </button>
          </div>

          {gallery.length === 0 ? (
            <div onClick={() => setMediaPicker(true)} style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>
              Clique para adicionar imagens à galeria
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {gallery.map((url, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImage(url)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
                  <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#fff', fontWeight: 700 }}>{i + 1}</div>
                </div>
              ))}
              <div onClick={() => setMediaPicker(true)} style={{ aspectRatio: '4/3', border: '2px dashed #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', fontSize: 24 }}>+</div>
            </div>
          )}
        </div>

        {/* Info estática */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>Informação estática (editar no código)</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Nome', company.name], ['Sector', company.sectorLabel], ['Área', company.area], ['Ano', company.year], ['Website', company.link || '—']].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</div>
                <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

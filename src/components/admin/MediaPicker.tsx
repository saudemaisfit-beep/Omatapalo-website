'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type MediaItem = { id: string; name: string; url: string; mime_type: string; size: number; created_at: string };

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

function fmt(bytes: number) {
  if (!bytes) return '-';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaPicker({ onSelect, onClose }: Props) {
  const supabase = createClient();
  const [tab, setTab]           = useState<'biblioteca' | 'upload'>('biblioteca');
  const [media, setMedia]       = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [search, setSearch]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setMedia(data ?? []);
  }

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!list.length) return;
    setUploading(true);
    for (const file of list) {
      const path = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
        await supabase.from('media').insert({ name: file.name, url: publicUrl, mime_type: file.type, size: file.size });
      }
    }
    setUploading(false);
    await load();
    setTab('biblioteca');
  }

  const filtered = media.filter(m =>
    m.mime_type?.startsWith('image/') &&
    (!search || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 1000, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {(['biblioteca', 'upload'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 20px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', borderBottom: tab === t ? '2px solid #1a396e' : '2px solid transparent', background: 'transparent', color: tab === t ? '#1a396e' : '#64748b', textTransform: 'capitalize' }}>
                {t === 'biblioteca' ? '🖼 Biblioteca de Média' : '⬆ Fazer Upload'}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

          {tab === 'biblioteca' && (
            <>
              {/* Grid */}
              <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Pesquisar imagens…"
                  style={{ width: '100%', padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
                />
                {filtered.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>
                    Nenhuma imagem encontrada.{' '}
                    <button onClick={() => setTab('upload')} style={{ color: '#1a396e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Fazer upload</button>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                  {filtered.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item)}
                      style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: selected?.id === item.id ? '3px solid #1a396e' : '3px solid transparent', position: 'relative', aspectRatio: '1', background: '#f8fafc' }}
                    >
                      <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {selected?.id === item.id && (
                        <div style={{ position: 'absolute', top: 6, right: 6, background: '#1a396e', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar — selected info */}
              {selected && (
                <div style={{ width: 240, borderLeft: '1px solid #e2e8f0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, overflowY: 'auto' }}>
                  <img src={selected.url} alt={selected.name} style={{ width: '100%', borderRadius: 6, objectFit: 'cover', aspectRatio: '4/3' }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Nome</div>
                    <div style={{ fontSize: 13, color: '#0f172a', wordBreak: 'break-all' }}>{selected.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Tamanho</div>
                    <div style={{ fontSize: 13, color: '#0f172a' }}>{fmt(selected.size)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Data</div>
                    <div style={{ fontSize: 13, color: '#0f172a' }}>{new Date(selected.created_at).toLocaleDateString('pt-PT')}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'upload' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
                style={{ width: '100%', maxWidth: 560, border: `2px dashed ${dragOver ? '#1a396e' : '#cbd5e1'}`, borderRadius: 12, padding: '60px 40px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#eff6ff' : '#f8fafc', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>☁️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {uploading ? 'A fazer upload…' : 'Arrastar e largar imagens aqui'}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>ou clique para seleccionar do computador</div>
                <div style={{ display: 'inline-block', padding: '10px 24px', background: '#1a396e', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                  Seleccionar ficheiros
                </div>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files) upload(e.target.files); }} />
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Formatos suportados: JPG, PNG, WebP, GIF · Sem limite de tamanho</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {selected ? `Seleccionado: ${selected.name}` : 'Nenhuma imagem seleccionada'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ padding: '9px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
            <button
              onClick={() => { if (selected) { onSelect(selected.url); onClose(); } }}
              disabled={!selected}
              style={{ padding: '9px 20px', background: selected ? '#1a396e' : '#e2e8f0', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: selected ? 'pointer' : 'default', color: selected ? '#fff' : '#94a3b8' }}
            >
              Inserir imagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

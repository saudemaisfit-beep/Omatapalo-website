'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type MediaItem = { id: string; name: string; url: string; mime_type: string; size: number; created_at: string; };

export default function MediaPage() {
  const supabase = createClient();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setMedia(data ?? []);
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const path = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
        await supabase.from('media').insert({ name: file.name, url: publicUrl, mime_type: file.type, size: file.size });
      }
    }
    setUploading(false);
    load();
  }

  async function del(item: MediaItem) {
    if (!confirm(`Apagar "${item.name}"?`)) return;
    await supabase.from('media').delete().eq('id', item.id);
    load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  }

  function fmt(bytes: number) {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Media</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>{media.length} ficheiros</p>
        </div>
        <label style={{ background: '#1a396e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {uploading ? 'A fazer upload...' : '+ Upload'}
          <input type="file" multiple accept="image/*,video/*,.pdf" onChange={upload} style={{ display: 'none' }} />
        </label>
      </div>

      {media.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8', fontSize: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
          Nenhum ficheiro ainda. Faz upload acima!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {media.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ aspectRatio: '4/3', background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
              {item.mime_type?.startsWith('image/') ? (
                <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  {item.mime_type?.includes('pdf') ? '📄' : '📁'}
                </div>
              )}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }} title={item.name}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>{fmt(item.size)}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy(item.url)} style={{ flex: 1, padding: '5px 0', background: copied === item.url ? '#f0fdf4' : '#f8fafc', border: `1px solid ${copied === item.url ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: copied === item.url ? '#16a34a' : '#475569', cursor: 'pointer' }}>
                  {copied === item.url ? '✓ Copiado' : 'Copiar URL'}
                </button>
                <button onClick={() => del(item)} style={{ padding: '5px 8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, color: '#dc2626', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Asset = { id: number; title: string; description: string; download_url: string; sort_order: number; published: boolean };
const EMPTY = { title: '', description: '', download_url: '', sort_order: 0, published: true };

export default function IdentidadeVisualAdmin() {
  const supabase = createClient();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newAsset, setNewAsset] = useState({ ...EMPTY });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('brand_assets').select('*').order('sort_order').then(({ data }) => setAssets(data ?? []));
  }, []);

  function update(id: number, field: keyof Asset, value: string | boolean) {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  async function save(asset: Asset) {
    setSaving(asset.id); setMsg('');
    const { error } = await supabase.from('brand_assets').update({
      title: asset.title, description: asset.description, download_url: asset.download_url, published: asset.published
    }).eq('id', asset.id);
    setSaving(null);
    setMsg(error ? 'Erro: ' + error.message : 'Guardado!');
    setTimeout(() => setMsg(''), 2500);
  }

  async function deleteAsset(id: number) {
    if (!confirm('Apagar este item?')) return;
    await supabase.from('brand_assets').delete().eq('id', id);
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>, isNew = false) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const path = `brand/${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
      if (isNew) setNewAsset(a => ({ ...a, download_url: publicUrl }));
    }
    setUploading(false);
  }

  async function createAsset() {
    if (!newAsset.title) return;
    setSaving(-1); setMsg('');
    const sort = assets.length > 0 ? Math.max(...assets.map(a => a.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('brand_assets').insert({ ...newAsset, sort_order: sort }).select().single();
    setSaving(null);
    if (error) { setMsg('Erro: ' + error.message); }
    else { setAssets(prev => [...prev, data]); setNewAsset({ ...EMPTY }); setAdding(false); setMsg('Item criado!'); }
    setTimeout(() => setMsg(''), 2500);
  }

  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' };
  const lbl = (t: string) => <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#64748b', display: 'block', marginBottom: 6 }}>{t}</label>;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Identidade Visual</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>Gere os ficheiros de download disponíveis na página de Identidade Visual.</p>
        </div>
        <button onClick={() => { setAdding(true); setNewAsset({ ...EMPTY }); }}
          style={{ padding: '10px 20px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Novo ficheiro
        </button>
      </div>

      {msg && (
        <div style={{ marginBottom: 20, padding: '10px 16px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, fontSize: 13, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {/* Form novo */}
      {adding && (
        <div style={{ background: '#fff', borderRadius: 12, border: '2px solid #1a396e', marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ background: '#1a396e', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Novo Ficheiro</span>
            <button onClick={() => setAdding(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>{lbl('Título')}<input style={inp} value={newAsset.title} onChange={e => setNewAsset(a => ({ ...a, title: e.target.value }))} placeholder="ex: LOGOTIPO" /></div>
            <div>{lbl('Descrição')}<textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={newAsset.description} onChange={e => setNewAsset(a => ({ ...a, description: e.target.value }))} placeholder="Descrição do ficheiro..." /></div>
            <div>
              {lbl('Ficheiro para Download')}
              <input type="file" onChange={e => uploadFile(e, true)} style={{ fontSize: 13, color: '#64748b', marginBottom: 8, display: 'block' }} />
              {uploading && <div style={{ fontSize: 12, color: '#1a396e', marginBottom: 6 }}>A fazer upload...</div>}
              <input style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} value={newAsset.download_url} onChange={e => setNewAsset(a => ({ ...a, download_url: e.target.value }))} placeholder="ou URL directo" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setAdding(false)} style={{ padding: '9px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={createAsset} disabled={saving === -1 || !newAsset.title} style={{ padding: '9px 22px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!newAsset.title || saving === -1) ? 0.6 : 1 }}>
                {saving === -1 ? 'A criar...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {assets.map(asset => (
          <div key={asset.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{asset.title}</span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: asset.published ? '#dcfce7' : '#f1f5f9', color: asset.published ? '#16a34a' : '#64748b', fontWeight: 700 }}>
                  {asset.published ? 'Visível' : 'Oculto'}
                </span>
              </div>
              <button onClick={() => deleteAsset(asset.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 12, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Apagar</button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>{lbl('Título')}<input style={inp} value={asset.title} onChange={e => update(asset.id, 'title', e.target.value)} /></div>
              <div>{lbl('Descrição')}<textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} value={asset.description} onChange={e => update(asset.id, 'description', e.target.value)} /></div>
              <div>
                {lbl('Link / Ficheiro')}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} value={asset.download_url} onChange={e => update(asset.id, 'download_url', e.target.value)} placeholder="https://..." />
                  <label style={{ whiteSpace: 'nowrap', padding: '9px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                    Upload
                    <input type="file" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setUploading(true);
                      const path = `brand/${Date.now()}-${file.name}`;
                      const { data } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
                      if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(data.path);
                        update(asset.id, 'download_url', publicUrl);
                      }
                      setUploading(false);
                    }} />
                  </label>
                </div>
                {uploading && <div style={{ fontSize: 12, color: '#1a396e', marginTop: 4 }}>A fazer upload...</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={asset.published} onChange={e => update(asset.id, 'published', e.target.checked)} />
                  Visível no site
                </label>
                <button onClick={() => save(asset)} disabled={saving === asset.id} style={{ padding: '9px 22px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving === asset.id ? 0.6 : 1 }}>
                  {saving === asset.id ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type GNItem = {
  value: string;
  label: string;
  img: string;
  suffix: string;
};

const DEFAULT_ITEMS: GNItem[] = [
  { value: '14',   label: 'Hospitais',          img: '/inauguracao.jpg',                      suffix: '' },
  { value: '5000', label: 'Estradas',            img: '/EN-230-omatapalo-2.jpg',               suffix: 'km' },
  { value: '4',    label: 'Portos',              img: '/TOPSIDE NAMIBE.JPG',                   suffix: '' },
  { value: '6',    label: 'Linhas Alta Tensão',  img: '/omatapalo-electrificacao.jpg',          suffix: '' },
  { value: '6',    label: 'Construções Esp.',    img: '/MINISTÉRIO DO PLANEAMENTO.JPG',         suffix: '' },
  { value: '10',   label: 'Escolas',             img: '/colegio-paula-frassinetti.jpg',         suffix: '' },
  { value: '2',    label: 'Aeroportos',          img: '/aeroporto-namibe.jpg',                  suffix: '' },
  { value: '3500', label: 'Equipamentos',        img: '/GRUA.jpg',                              suffix: '' },
  { value: '3',    label: 'Barragens',           img: '/barragem-calucuve.jpg',                 suffix: '' },
  { value: '8',    label: 'ETAR',                img: '/etar-huila.jpg',                        suffix: '' },
  { value: '7',    label: 'Unidades Hoteleiras', img: '/FLOW HOTEL LUANDA AEROPORTO.jpeg',      suffix: '' },
  { value: '14',   label: 'Centrais Solares',    img: '/parquesolar.jpg',                       suffix: '' },
];

const DEFAULT_HEADER = {
  eyebrow: 'O Que Construímos',
  title: 'Grandes\nNúmeros',
  description: 'Mais de duas décadas a construir infra-estruturas que melhoram a vida das comunidades e contribuem para o crescimento do país.',
};

const btn = (active = false) => ({
  padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12,
  fontWeight: 700, background: active ? '#1a396e' : '#f1f5f9', color: active ? '#fff' : '#374151',
});

export default function GrandesNumerosAdmin() {
  const [items, setItems] = useState<GNItem[]>(DEFAULT_ITEMS);
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    createClient().from('site_content').select('field,value').eq('page', 'grandes-numeros').then(({ data }) => {
      if (!data) return;
      for (const row of data) {
        if (row.field === 'items') {
          try { setItems(JSON.parse(row.value)); } catch {}
        }
        if (row.field === 'header') {
          try { setHeader(JSON.parse(row.value)); } catch {}
        }
      }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 4000); }

  async function save() {
    setSaving(true);
    const rows = [
      { page: 'grandes-numeros', field: 'items',  value: JSON.stringify(items) },
      { page: 'grandes-numeros', field: 'header', value: JSON.stringify(header) },
    ];
    const { error } = await createClient().from('site_content').upsert(rows);
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Guardado com sucesso!');
  }

  async function uploadImage(idx: number, file: File) {
    setUploading(idx);
    const db = createClient();
    const ext = file.name.split('.').pop();
    const path = `grandes-numeros/${Date.now()}-${idx}.${ext}`;
    const { data, error } = await db.storage.from('media').upload(path, file, { upsert: true });
    if (error) { flash('❌ Erro ao carregar: ' + error.message); setUploading(null); return; }
    const { data: urlData } = db.storage.from('media').getPublicUrl(data.path);
    updateItem(idx, 'img', urlData.publicUrl);
    setUploading(null);
    flash('✅ Imagem carregada!');
  }

  function updateItem(i: number, field: keyof GNItem, val: string) {
    setItems(items => items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  }

  function addItem() {
    setItems(items => [...items, { value: '0', label: 'Novo Item', img: '', suffix: '' }]);
  }

  function removeItem(i: number) {
    setItems(items => items.filter((_, idx) => idx !== i));
  }

  function moveItem(i: number, dir: -1 | 1) {
    setItems(items => {
      const arr = [...items];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '16px 18px', marginBottom: 10 };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Grandes Números</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Edita os cartões com estatísticas, imagens e textos de cabeçalho.</p>
        </div>
        <button onClick={save} disabled={saving} style={{ ...btn(true), padding: '10px 24px', fontSize: 13, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar tudo'}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', borderRadius: 4, marginBottom: 20, fontSize: 13, fontWeight: 600, background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}` }}>
          {msg}
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ ...card, marginBottom: 28, borderLeft: '3px solid #1a396e' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 14 }}>Cabeçalho da Secção</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Eyebrow</label>
            <input value={header.eyebrow} onChange={e => setHeader(h => ({ ...h, eyebrow: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Título</label>
            <input value={header.title} onChange={e => setHeader(h => ({ ...h, title: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Descrição</label>
          <textarea value={header.description} onChange={e => setHeader(h => ({ ...h, description: e.target.value }))}
            rows={2} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Itens */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>
        Cartões ({items.length})
      </div>

      {items.map((item, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 1fr auto auto auto', gap: 8, alignItems: 'center' }}>

            {/* preview imagem */}
            <div style={{ width: 72, height: 56, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              {item.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>

            {/* label */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 3 }}>RÓTULO</label>
              <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)}
                style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
            </div>

            {/* value */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 3 }}>VALOR</label>
              <input value={item.value} onChange={e => updateItem(i, 'value', e.target.value)}
                style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
            </div>

            {/* img url + upload */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 3 }}>IMAGEM</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <input value={item.img} onChange={e => updateItem(i, 'img', e.target.value)}
                  placeholder="/caminho/imagem.jpg"
                  style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, boxSizing: 'border-box', minWidth: 0 }} />
                <button onClick={() => fileRefs.current[i]?.click()}
                  disabled={uploading === i}
                  style={{ ...btn(), padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {uploading === i ? '…' : '⬆'}
                </button>
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  ref={el => { fileRefs.current[i] = el; }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(i, f); }} />
              </div>
            </div>

            <button onClick={() => moveItem(i, -1)} style={{ ...btn(), padding: '6px 8px' }}>↑</button>
            <button onClick={() => moveItem(i, 1)}  style={{ ...btn(), padding: '6px 8px' }}>↓</button>
            <button onClick={() => removeItem(i)}   style={{ ...btn(), padding: '6px 8px', color: '#ef4444' }}>✕</button>
          </div>
        </div>
      ))}

      <button onClick={addItem} style={{ ...btn(), border: '1.5px dashed #cbd5e1', background: '#f8fafc', width: '100%', padding: '10px', marginTop: 4, fontSize: 12 }}>
        + Adicionar cartão
      </button>
    </div>
  );
}

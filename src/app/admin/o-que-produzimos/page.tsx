'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };

type Item = { v: number; l: string };

const DEFAULT: Item[] = [
  { v: 55, l: 'Estaleiros de Obras Activos' },
  { v: 8,  l: 'Centros de Betão' },
  { v: 1,  l: 'Plataforma de Produção de Cuba' },
  { v: 1,  l: 'Fábrica de Conexões' },
  { v: 3,  l: 'Fábricas de Cabo' },
  { v: 7,  l: 'Contratos de Betuminosos' },
  { v: 7,  l: 'Fábricas de Artefatos de Cimento' },
  { v: 6,  l: 'Instalações de Metalomecânica' },
  { v: 2,  l: 'Indústrias de Carpintaria' },
  { v: 1,  l: 'Laboratório de Ensaio de Materiais' },
];

export default function OQueProduzimosAdminPage() {
  const [items, setItems] = useState<Item[]>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'o_que_produzimos_cfg').single().then(({ data }) => {
      if (data?.value) try { setItems(JSON.parse(data.value)); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'o_que_produzimos_cfg', value: JSON.stringify(items) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  function upd(i: number, f: keyof Item, v: string) {
    setItems(p => p.map((it, idx) => idx === i ? { ...it, [f]: f === 'v' ? Number(v) : v } : it));
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>O Que Produzimos</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{items.length} estatísticas de capacidade industrial</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setItems(p => [...p, { v: 0, l: '' }])} style={{ padding: '10px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>+ Adicionar</button>
          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Número</label>
              <input type="number" value={s.v} onChange={e => upd(i, 'v', e.target.value)} style={inp} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Descrição</label>
              <input value={s.l} onChange={e => upd(i, 'l', e.target.value)} style={inp} />
            </div>
            <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', lineHeight: 1, marginBottom: 2 }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

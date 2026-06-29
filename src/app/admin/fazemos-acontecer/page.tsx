'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };

type BigStat = { v: number; s: string; l: string; sub: string };
type SmallStat = { v: number; p: string; l: string };

const DEF_BIG: BigStat[] = [
  { v: 15000, s: '+', l: 'Colaboradores', sub: 'em Angola e em África' },
  { v: 1500000, s: ' m²', l: 'Área Construída', sub: 'edifícios e infraestrutura' },
  { v: 5000, s: '+ km', l: 'de Estrada', sub: 'pavimentada em Angola' },
];
const DEF_SMALL: SmallStat[] = [
  { v: 8,    p: '+', l: 'Estações de Tratamento de Água' },
  { v: 2000, p: '+', l: 'Documentos de Gestão e Controlo' },
  { v: 12,   p: '+', l: 'Infraestruturas de Comunicação' },
  { v: 6,    p: '+', l: 'Energias Renováveis Integradas' },
  { v: 2000, p: '',  l: 'Habitações entregues' },
  { v: 600,  p: '',  l: 'Profissionais com formação superior' },
];

export default function FazemosAcontecer() {
  const [big, setBig] = useState<BigStat[]>(DEF_BIG);
  const [small, setSmall] = useState<SmallStat[]>(DEF_SMALL);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'fazemos_acontecer_cfg').single().then(({ data }) => {
      if (data?.value) try { const d = JSON.parse(data.value); if (d.big) setBig(d.big); if (d.small) setSmall(d.small); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'fazemos_acontecer_cfg', value: JSON.stringify({ big, small }) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  function updBig(i: number, f: keyof BigStat, v: string) {
    setBig(p => p.map((it, idx) => idx === i ? { ...it, [f]: f === 'v' ? Number(v) : v } : it));
  }
  function updSmall(i: number, f: keyof SmallStat, v: string) {
    setSmall(p => p.map((it, idx) => idx === i ? { ...it, [f]: f === 'v' ? Number(v) : v } : it));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Fazemos Acontecer</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Estatísticas e números da homepage</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>3 Estatísticas Principais</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {big.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 80px 1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Número</label>
                <input type="number" value={s.v} onChange={e => updBig(i, 'v', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Sufixo</label>
                <input value={s.s} onChange={e => updBig(i, 's', e.target.value)} style={inp} placeholder="+" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Label</label>
                <input value={s.l} onChange={e => updBig(i, 'l', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Sub-label</label>
                <input value={s.sub} onChange={e => updBig(i, 'sub', e.target.value)} style={inp} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>Estatísticas Secundárias ({small.length})</div>
        <button onClick={() => setSmall(p => [...p, { v: 0, p: '+', l: '' }])} style={{ padding: '6px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>+ Adicionar</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {small.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>#{i + 1}</span>
              <button onClick={() => setSmall(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 16, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 60px 1fr', gap: 8 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Número</label>
                <input type="number" value={s.v} onChange={e => updSmall(i, 'v', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Prefixo</label>
                <input value={s.p} onChange={e => updSmall(i, 'p', e.target.value)} style={inp} placeholder="+" />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Label</label>
                <input value={s.l} onChange={e => updSmall(i, 'l', e.target.value)} style={inp} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

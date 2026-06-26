'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Member = { name: string; role: string; initials: string; featured?: boolean };
type Tier   = { id: string; short: string; label: string; members: Member[] };

const DEFAULT_TIERS: Tier[] = [
  {
    id: 'conselho', short: '01', label: 'Conselho de Administração',
    members: [
      { name: 'Pedro Vieira Santos', role: 'Presidente do Conselho de Administração', initials: 'PVS', featured: true },
      { name: 'Marques Antunes',     role: 'Administrador',               initials: 'MA' },
      { name: 'Pedro Vieira Santos', role: 'Administrador',               initials: 'PV' },
      { name: 'Carlos Freitas',      role: 'Administrador Não Executivo', initials: 'CF' },
    ],
  },
  {
    id: 'executiva', short: '02', label: 'Comissão Executiva',
    members: [
      { name: 'Pedro Vieira Santos', role: 'Chief Executive Officer',    initials: 'PVS', featured: true },
      { name: 'Marques Antunes',     role: 'Chief Operating Officer',    initials: 'MA' },
      { name: 'Pedro Vieira Santos', role: 'Chief Financial Officer',    initials: 'PV' },
      { name: 'Almeida e Silva',     role: 'Director Executivo de Produção de Construção Civil', initials: 'AS' },
      { name: 'Pedro Martins',       role: 'Director Executivo Financeiro',             initials: 'PM' },
      { name: 'Cláudio Barbosa',     role: 'Director Executivo Comercial',              initials: 'CB' },
      { name: 'José Malafaia',       role: 'Director Executivo de Produção de Vias e Infraestruturas', initials: 'JM' },
      { name: 'Arménio Lopes',       role: 'Director Executivo de Produção de Instalações Especiais', initials: 'AL' },
      { name: 'Joana Guedes',        role: 'Directora Executiva Jurídica',          initials: 'JG' },
      { name: 'Manuel Mamboza',      role: 'Director Executivo de Central de Compras', initials: 'MM' },
      { name: 'Luís Marques',        role: 'Assessor da Administração',         initials: 'LM' },
    ],
  },
];

const inp = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' as const };

export default function ConselhoAdminPage() {
  const [tiers, setTiers]   = useState<Tier[]>(DEFAULT_TIERS);
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'conselho_tiers').single().then(({ data }) => {
      if (data?.value) { try { setTiers(JSON.parse(data.value)); } catch {} }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'conselho_tiers', value: JSON.stringify(tiers) });
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Guardado!');
  }

  function updateMember(ti: number, mi: number, field: keyof Member, val: string | boolean) {
    setTiers(prev => prev.map((t, tidx) => tidx !== ti ? t : {
      ...t,
      members: t.members.map((m, midx) => midx !== mi ? m : { ...m, [field]: val }),
    }));
  }

  function removeMember(ti: number, mi: number) {
    setTiers(prev => prev.map((t, tidx) => tidx !== ti ? t : { ...t, members: t.members.filter((_, i) => i !== mi) }));
  }

  function addMember(ti: number) {
    setTiers(prev => prev.map((t, tidx) => tidx !== ti ? t : {
      ...t, members: [...t.members, { name: '', role: '', initials: '' }],
    }));
  }

  function moveMember(ti: number, mi: number, dir: -1 | 1) {
    setTiers(prev => prev.map((t, tidx) => {
      if (tidx !== ti) return t;
      const arr = [...t.members];
      const j = mi + dir;
      if (j < 0 || j >= arr.length) return t;
      [arr[mi], arr[j]] = [arr[j], arr[mi]];
      return { ...t, members: arr };
    }));
  }

  const tier = tiers[active];

  return (
    <div style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Conselho de Administração</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{tier.members.length} membros na tab activa</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tiers.map((t, i) => (
          <button key={t.id} onClick={() => setActive(i)} style={{ padding: '8px 20px', borderRadius: 6, border: '1.5px solid', borderColor: active === i ? '#1a396e' : '#e2e8f0', background: active === i ? '#1a396e' : '#fff', color: active === i ? '#fff' : '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Members */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {tier.members.map((m, mi) => (
          <div key={mi} style={{ background: '#fff', border: `1.5px solid ${m.featured ? '#1a396e' : '#e2e8f0'}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px auto auto auto auto', gap: 8, alignItems: 'center' }}>
              <input value={m.name}     onChange={e => updateMember(active, mi, 'name',     e.target.value)} placeholder="Nome"     style={inp} />
              <input value={m.role}     onChange={e => updateMember(active, mi, 'role',     e.target.value)} placeholder="Cargo"    style={inp} />
              <input value={m.initials} onChange={e => updateMember(active, mi, 'initials', e.target.value)} placeholder="Iniciais" style={{ ...inp, fontWeight: 700, textTransform: 'uppercase' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!m.featured} onChange={e => updateMember(active, mi, 'featured', e.target.checked)} />
                Destaque
              </label>
              <button onClick={() => moveMember(active, mi, -1)} style={{ padding: '8px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer' }}>↑</button>
              <button onClick={() => moveMember(active, mi,  1)} style={{ padding: '8px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer' }}>↓</button>
              <button onClick={() => removeMember(active, mi)}   style={{ padding: '8px 10px', background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => addMember(active)} style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 8, fontSize: 14, color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
        + Adicionar membro
      </button>
    </div>
  );
}

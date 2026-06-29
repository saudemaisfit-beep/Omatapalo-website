'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };

const DEF = {
  linha1: 'CONSTRUÍMOS',
  linha2: 'O SEU FUTURO',
  corpo: 'Com mais de 30 anos de história e 15.000 profissionais dedicados, estamos prontos para o seu próximo grande projecto.',
  btn1: 'Iniciar Projecto →',
  btn2: 'Ver Portfólio',
};

export default function ConstruimosFuturoAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'construimos_futuro_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'construimos_futuro_cfg', value: JSON.stringify(data) });
    setSaving(false);
    setMsg(error ? '❌ Erro ao guardar' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  const field = (label: string, key: keyof typeof DEF, placeholder?: string) => (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
      <input value={data[key]} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))} style={inp} placeholder={placeholder} />
    </div>
  );

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Construímos o Futuro</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Secção CTA com fundo escuro na homepage</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {field('Linha 1 (sólida)', 'linha1', 'CONSTRUÍMOS')}
        {field('Linha 2 (contorno)', 'linha2', 'O SEU FUTURO')}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo</label>
          <textarea value={data.corpo} onChange={e => setData(p => ({ ...p, corpo: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 } as React.CSSProperties} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Botão primário', 'btn1', 'Iniciar Projecto →')}
          {field('Botão secundário', 'btn2', 'Ver Portfólio')}
        </div>
      </div>
    </div>
  );
}

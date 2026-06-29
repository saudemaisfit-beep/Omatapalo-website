'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

const DEF = {
  titulo: 'Energias Renováveis.',
  corpo: 'A aposta nas Energias Renováveis representa um compromisso ambicioso, que inclui uma aceleração sem precedentes do nosso crescimento no sector, suportado pela nossa história de sucesso enquanto líderes da inovação. Não se trata apenas de levar energia às comunidades, mas sim de contribuir para que estas possam ter vidas mais sustentáveis, no presente e no futuro. Estamos a implementar medidas concretas para proteger o futuro da humanidade, começando com o objectivo de nos tornarmos numa empresa 100% verde. Comprometemo-nos a entregar energia limpa, e continuaremos a expandir o nosso portefólio nesse sentido.',
};

export default function ParaOndeVamosAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'para_onde_vamos_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'para_onde_vamos_cfg', value: JSON.stringify(data) });
    setSaving(false);
    setMsg(error ? '❌ Erro ao guardar' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Para Onde Vamos</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Secção "Energias Renováveis" na homepage</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Título</label>
          <input value={data.titulo} onChange={e => setData(p => ({ ...p, titulo: e.target.value }))} style={inp} placeholder="Energias Renováveis." />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo</label>
          <textarea value={data.corpo} onChange={e => setData(p => ({ ...p, corpo: e.target.value }))} rows={8} style={ta} />
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

const DEF = {
  youtube_id: 'kuVu9thTbIM',
  citacao: 'Para nós, a responsabilidade social começa na nossa casa e nas condições que damos aos nossos Colaboradores. É nesta matriz e nesta filosofia que assenta a nossa capacidade de fazer acontecer.',
  paragrafo: 'Num país onde existe pobreza e desigualdade, a OMATAPALO considera a responsabilidade social de extrema importância. A contribuição para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvida através da promoção e apoio em iniciativas nos domínios da beneficência e solidariedade social.',
  ods_imgs: ['/ods-08.png', '/ods-09.png', '/ods-11.png', '/ods-13.png'],
};

export default function MissaoSorrirAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'missao_sorrir_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'missao_sorrir_cfg', value: JSON.stringify(data) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Missão Fazer Sorrir</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Página de Responsabilidade Social</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>ID do Vídeo YouTube</label>
          <input value={data.youtube_id} onChange={e => setData(p => ({ ...p, youtube_id: e.target.value }))} style={inp} placeholder="kuVu9thTbIM" />
          <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>Apenas o ID (ex: se o URL for youtube.com/watch?v=<strong>kuVu9thTbIM</strong>, coloca só: kuVu9thTbIM)</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Citação (itálico)</label>
          <textarea value={data.citacao} onChange={e => setData(p => ({ ...p, citacao: e.target.value }))} rows={4} style={ta} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo</label>
          <textarea value={data.paragrafo} onChange={e => setData(p => ({ ...p, paragrafo: e.target.value }))} rows={4} style={ta} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Imagens ODS (4 imagens)</div>
          {data.ods_imgs.map((src, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', width: 60 }}>ODS {i + 1}</span>
              <input value={src} onChange={e => { const imgs = [...data.ods_imgs]; imgs[i] = e.target.value; setData(p => ({ ...p, ods_imgs: imgs })); }} style={{ ...inp, flex: 1 }} placeholder="/ods-08.png" />
              {src && <img src={src} alt="" style={{ height: 36, width: 36, objectFit: 'cover', borderRadius: 4 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

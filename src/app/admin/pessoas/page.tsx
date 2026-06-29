'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

const DEF = {
  body_p1: 'Contando com mais de 15.000 colaboradores directos, a OMATAPALO possui no seu quadro técnico áreas de conhecimento relacionadas com a sua actividade.',
  body_p2: 'A empresa assenta a sua actuação em níveis de empenho, diligência na execução, responsabilidade na sua conduta, formando uma equipa pluridisciplinar capaz de conduzir processos, produzir resultados e garantir padrões de qualidade, cumprimento de prazos rigorosos, para uma sociedade que, cada vez mais, exige soluções mais céleres.',
  section_img: '/COLABORADORES OMTP.png',
};

export default function PessoasAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    const db = createClient();
    db.from('site_content').select('field,value').eq('page', 'pessoas').in('field', ['body_p1', 'body_p2', 'section_img']).then(({ data: rows }) => {
      if (rows?.length) {
        const map: Record<string, string> = {};
        rows.forEach(({ field, value }: { field: string; value: string }) => { map[field] = value; });
        setData(prev => ({ ...prev, ...map }));
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    const db = createClient();
    const fields = Object.entries(data) as [string, string][];
    const errors: string[] = [];
    for (const [field, value] of fields) {
      const { error } = await db.from('site_content').upsert({ page: 'pessoas', field, value }, { onConflict: 'page,field' });
      if (error) errors.push(error.message);
    }
    setSaving(false);
    setMsg(errors.length ? `❌ Erro: ${errors[0]}` : '✅ Pessoas guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Pessoas</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Secção "A nossa maior obra são as Pessoas"</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo 1</label>
          <textarea value={data.body_p1} onChange={e => setData(p => ({ ...p, body_p1: e.target.value }))} rows={3} style={ta} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo 2</label>
          <textarea value={data.body_p2} onChange={e => setData(p => ({ ...p, body_p2: e.target.value }))} rows={3} style={ta} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Imagem</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={data.section_img} onChange={e => setData(p => ({ ...p, section_img: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="/COLABORADORES OMTP.png" />
            <button onClick={() => setPicker(true)} style={{ padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap' }}>🖼 Escolher</button>
          </div>
          {data.section_img && <img src={data.section_img} alt="" style={{ marginTop: 8, height: 80, objectFit: 'cover', borderRadius: 4, maxWidth: '100%' }} />}
        </div>
      </div>

      {picker && (
        <MediaPicker
          onSelect={url => { setData(p => ({ ...p, section_img: url })); setPicker(false); }}
          onClose={() => setPicker(false)}
        />
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

type Metric = { v: string; label: string; desc: string; accent: string };
type Photo = { src: string; label: string };

const DEF = {
  hero_text: 'Através do apoio ao Clube Desportivo da Huíla, Grupo Omatapalo reafirma o seu compromisso com o desenvolvimento do desporto angolano, investindo na formação de talentos, na promoção de valores positivos e na criação de oportunidades para as futuras gerações. Acreditamos que o desporto é uma poderosa ferramenta de inclusão social, educação e transformação das comunidades.',
  p1: 'Enquanto patrocinadora do Clube Desportivo da Huíla, a Omatapalo desempenha um papel activo na valorização do desporto nacional e no fortalecimento do futebol na Região Sul de Angola.',
  p2: 'Um dos marcos desta parceria foi o apoio à construção do Complexo de Treino General de Exército Francisco Pereira Furtado, uma infra-estrutura moderna concebida para proporcionar melhores condições de preparação aos atletas, promover a excelência desportiva e contribuir para o crescimento sustentável do clube e da modalidade na província da Huíla.',
  p3: 'Este investimento reflecte a visão da Omatapalo de gerar impacto positivo duradouro, apoiando iniciativas que promovem o desenvolvimento humano, social e desportivo das comunidades angolanas.',
  metrics: [
    { v: '180', label: 'Atletas federados', desc: 'Atletas registados e em competição federada', accent: '#C8102E' },
    { v: '125', label: 'Em formação', desc: 'Jovens talentos nas camadas de formação do clube', accent: '#006633' },
    { v: '60', label: 'Atletas seniores', desc: 'Equipa sénior em competição de alto nível', accent: '#FFD700' },
    { v: 'CDH', label: 'Clube Desportivo da Huíla', desc: 'Parceria da Omatapalo com o emblema da Huíla', accent: '#C8102E' },
  ] as Metric[],
  photos: [
    { src: '/cdh-treino-1.jpg', label: 'Formação Desportiva' },
    { src: '/cdh-treino-2.jpg', label: 'Treino' },
    { src: '/cdh-treino-3.jpg', label: 'Plantel' },
    { src: '/cdh-treino-4.jpg', label: 'Competição' },
    { src: '/cdh-treino-5.jpg', label: 'CDH' },
  ] as Photo[],
};

export default function CDHAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [picker, setPicker] = useState<string | null>(null);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'cdh_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'cdh_cfg', value: JSON.stringify(data) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ CDH guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  function updMetric(i: number, f: keyof Metric, v: string) {
    setData(p => ({ ...p, metrics: p.metrics.map((m, idx) => idx === i ? { ...m, [f]: v } : m) }));
  }
  function updPhoto(i: number, f: keyof Photo, v: string) {
    setData(p => ({ ...p, photos: p.photos.map((ph, idx) => idx === i ? { ...ph, [f]: v } : ph) }));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>CDH — Clube Desportivo da Huíla</h1>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Texto do Hero (parágrafo introdutório)</label>
          <textarea value={data.hero_text} onChange={e => setData(p => ({ ...p, hero_text: e.target.value }))} rows={4} style={ta} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Secção "Apoio ao Desenvolvimento Desportivo"</div>
          {(['p1', 'p2', 'p3'] as const).map((k, i) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Parágrafo {i + 1}</label>
              <textarea value={data[k]} onChange={e => setData(p => ({ ...p, [k]: e.target.value }))} rows={3} style={ta} />
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12 }}>4 Métricas CDH</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {data.metrics.map((m, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Valor</label>
                    <input value={m.v} onChange={e => updMetric(i, 'v', e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Label</label>
                    <input value={m.label} onChange={e => updMetric(i, 'label', e.target.value)} style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Descrição</label>
                  <input value={m.desc} onChange={e => updMetric(i, 'desc', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Cor (hex)</label>
                  <input value={m.accent} onChange={e => updMetric(i, 'accent', e.target.value)} style={inp} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Fotos da Galeria</div>
            <button onClick={() => setData(p => ({ ...p, photos: [...p.photos, { src: '', label: '' }] }))} style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>+ Adicionar</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.photos.map((ph, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 200px auto auto', gap: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={ph.src} onChange={e => updPhoto(i, 'src', e.target.value)} style={{ ...inp, flex: 1 }} placeholder="/foto.jpg" />
                  <button onClick={() => setPicker(`photo_${i}`)} style={{ padding: '9px 10px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🖼</button>
                </div>
                <input value={ph.label} onChange={e => updPhoto(i, 'label', e.target.value)} style={inp} placeholder="Label" />
                {ph.src && <img src={ph.src} alt="" style={{ height: 38, width: 56, objectFit: 'cover', borderRadius: 3 }} />}
                <button onClick={() => setData(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 16, cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {picker !== null && (
        <MediaPicker
          onSelect={url => {
            if (picker.startsWith('photo_')) updPhoto(Number(picker.split('_')[1]), 'src', url);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

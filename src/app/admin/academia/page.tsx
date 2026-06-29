'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

type Stat = { value: number; label: string; prefix: string; suffix: string };

const DEF = {
  paragraph: 'ACADEMIA OMATAPALO, inaugurada em 2021, tem como objetivo primordial a formação de quadros e funcionários do Grupo, com vista ao desenvolvimento e especialização dos seus profissionais.',
  badge: 'Desde 2021',
  stats: [
    { value: 76000, label: 'Horas de Formação', prefix: '+ ', suffix: '' },
    { value: 2021, label: 'Ano de Inauguração', prefix: '', suffix: '' },
    { value: 3200, label: 'Colaboradores Formados', prefix: '+ ', suffix: '' },
  ] as Stat[],
  gallery: ['/Formação omatapalo.jpg', '/Academia-barra.jpg', '/academia-barra1.jpg', '/academia-barra2.jpg'],
  hero_img: '/Academia-barra.jpg',
};

export default function AcademiaAdminPage() {
  const [data, setData] = useState(DEF);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [picker, setPicker] = useState<string | null>(null);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'academia_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'academia_cfg', value: JSON.stringify(data) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  function updStat(i: number, f: keyof Stat, v: string) {
    setData(p => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, [f]: f === 'value' ? Number(v) : v } : s) }));
  }

  function updGallery(i: number, v: string) {
    setData(p => { const g = [...p.gallery]; g[i] = v; return { ...p, gallery: g }; });
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Academia</h1>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo principal</label>
          <textarea value={data.paragraph} onChange={e => setData(p => ({ ...p, paragraph: e.target.value }))} rows={4} style={ta} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Badge (ex: "Desde 2021")</label>
          <input value={data.badge} onChange={e => setData(p => ({ ...p, badge: e.target.value }))} style={inp} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 14 }}>Imagem em destaque</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={data.hero_img} onChange={e => setData(p => ({ ...p, hero_img: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="/imagem.jpg" />
            <button onClick={() => setPicker('hero_img')} style={{ padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap' }}>🖼 Escolher</button>
          </div>
          {data.hero_img && <img src={data.hero_img} alt="" style={{ marginTop: 8, height: 80, objectFit: 'cover', borderRadius: 4, maxWidth: '100%' }} />}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 14 }}>3 Estatísticas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.stats.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 60px 60px 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Valor</label>
                  <input type="number" value={s.value} onChange={e => updStat(i, 'value', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Prefixo</label>
                  <input value={s.prefix} onChange={e => updStat(i, 'prefix', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Sufixo</label>
                  <input value={s.suffix} onChange={e => updStat(i, 'suffix', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Label</label>
                  <input value={s.label} onChange={e => updStat(i, 'label', e.target.value)} style={inp} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 14 }}>Galeria (4 imagens)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {data.gallery.map((src, i) => (
              <div key={i}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input value={src} onChange={e => updGallery(i, e.target.value)} style={{ ...inp, flex: 1 }} placeholder="/imagem.jpg" />
                  <button onClick={() => setPicker(`gallery_${i}`)} style={{ padding: '8px 10px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>🖼</button>
                </div>
                {src && <img src={src} alt="" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {picker !== null && (
        <MediaPicker
          onSelect={url => {
            if (picker === 'hero_img') setData(p => ({ ...p, hero_img: url }));
            else if (picker.startsWith('gallery_')) updGallery(Number(picker.split('_')[1]), url);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' as const };

type Cfg = {
  intro_p1: string;
  intro_p2: string;
  hero_img: string;
  esg: { n: string; t: string; d: string; img: string }[];
  certs: { alt: string; label: string; src: string; href: string }[];
  relatorio_titulo: string;
  relatorio_desc: string;
  relatorio_pdf: string;
};

const DEFAULT: Cfg = {
  intro_p1: 'O Grupo Omatapalo caminha rumo a um futuro que redefine os limites da Engenharia e Construção, com um claro foco no investimento em energias renováveis e inovação.',
  intro_p2: 'O contributo para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvido através da promoção e apoio de iniciativas de natureza social e ambiental.',
  hero_img: 'https://omatapalo.com/wp-content/uploads/HABITACAO-CAMBAMBE_08042025-5.jpg',
  esg: [
    { n: '01', t: 'Ambiental',  d: 'Energias renováveis, gestão de resíduos e compensação de carbono em todos os projectos.', img: 'https://omatapalo.com/wp-content/uploads/WhatsApp-Image-2025-06-02-at-19.38.03-1.jpeg' },
    { n: '02', t: 'Social',     d: 'Contribuição para a melhoria da qualidade de vida dos colaboradores, das pessoas e das comunidades.', img: 'https://omatapalo.com/wp-content/uploads/OMT-missao-fazer-sorrir-entrega-brinquedos-natal-2023-2-1-e1758177645954.jpg' },
    { n: '03', t: 'Governança', d: 'Transparência e responsabilidade em todas as operações, alinhadas com o Pacto Global das Nações Unidas.', img: 'https://omatapalo.com/wp-content/uploads/imagem-home.jpg' },
  ],
  certs: [
    { alt: 'ISO 9001',          label: 'Qualidade',         src: '/ISO-9001-2.png',          href: '#' },
    { alt: 'ISO 14001',         label: 'Gestão Ambiental',  src: '/ISO-14001-2.png',         href: '#' },
    { alt: 'ISO 45001',         label: 'Segurança e Saúde', src: '/ISO-45001-2.png',         href: '#' },
    { alt: 'UN Global Compact', label: 'Pacto Global ONU',  src: '/UN-GLOBAL-COMPACT-2.png', href: '#' },
  ],
  relatorio_titulo: 'Relatório de Sustentabilidade 2024',
  relatorio_desc: 'Consulte o nosso Relatório e Contas consolidadas e acompanhe os compromissos e resultados em matéria de sustentabilidade, governação e impacto social.',
  relatorio_pdf: '#',
};

const KEY = 'sustentabilidade_cfg';

export default function SustentabilidadeAdmin() {
  const [cfg, setCfg]     = useState<Cfg>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', KEY).single().then(({ data }) => {
      if (data?.value) { try { setCfg({ ...DEFAULT, ...JSON.parse(data.value) }); } catch {} }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3500); }

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: KEY, value: JSON.stringify(cfg) });
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Guardado!');
  }

  function set(field: keyof Cfg, val: string) { setCfg(p => ({ ...p, [field]: val })); }
  function setEsg(i: number, field: string, val: string) {
    setCfg(p => ({ ...p, esg: p.esg.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));
  }
  function setCert(i: number, field: string, val: string) {
    setCfg(p => ({ ...p, certs: p.certs.map((c, idx) => idx === i ? { ...c, [field]: val } : c) }));
  }

  const section = (title: string) => (
    <div style={{ fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 32, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>
      {title}
    </div>
  );

  return (
    <div style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Sustentabilidade</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Textos e links da página de sustentabilidade</p>
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

      {/* Foto hero */}
      {section('Foto de Destaque')}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
        {cfg.hero_img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cfg.hero_img} alt="Foto de destaque" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }} />
        )}
        <MediaPicker value={cfg.hero_img} onChange={url => set('hero_img', url)} label="Trocar foto" />
      </div>

      {/* Intro */}
      {section('Introdução')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Parágrafo 1</label>
        <textarea value={cfg.intro_p1} onChange={e => set('intro_p1', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Parágrafo 2</label>
        <textarea value={cfg.intro_p2} onChange={e => set('intro_p2', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      {/* ESG */}
      {section('Pilares ESG')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cfg.esg.map((e, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a396e', marginBottom: 12 }}>{e.n} — {e.t}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input value={e.t} onChange={ev => setEsg(i, 't', ev.target.value)} placeholder="Título" style={inp} />
              <textarea value={e.d} onChange={ev => setEsg(i, 'd', ev.target.value)} placeholder="Descrição" rows={2} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
              <input value={e.img} onChange={ev => setEsg(i, 'img', ev.target.value)} placeholder="URL da imagem" style={inp} />
            </div>
          </div>
        ))}
      </div>

      {/* Certificações */}
      {section('Certificações — Links')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cfg.certs.map((c, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ gridColumn: '1/-1', fontWeight: 700, fontSize: 13, color: '#1a396e', marginBottom: 4 }}>{c.alt}</div>
            <input value={c.href} onChange={ev => setCert(i, 'href', ev.target.value)} placeholder="URL (link de download ou página)" style={inp} />
            <input value={c.label} onChange={ev => setCert(i, 'label', ev.target.value)} placeholder="Label" style={inp} />
          </div>
        ))}
      </div>

      {/* Relatório */}
      {section('Relatório de Sustentabilidade')}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input value={cfg.relatorio_titulo} onChange={e => set('relatorio_titulo', e.target.value)} placeholder="Título do documento" style={inp} />
        <textarea value={cfg.relatorio_desc} onChange={e => set('relatorio_desc', e.target.value)} placeholder="Descrição" rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
        <input value={cfg.relatorio_pdf} onChange={e => set('relatorio_pdf', e.target.value)} placeholder="Link do PDF" style={inp} />
      </div>
    </div>
  );
}

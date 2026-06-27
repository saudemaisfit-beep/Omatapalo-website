'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type FieldType = 'text' | 'textarea' | 'url' | 'image';
type Field = { key: string; label: string; type: FieldType; default: string };
type PageSchema = { label: string; fields: Field[] };

const SCHEMAS: Record<string, PageSchema> = {
  home: {
    label: 'Página Inicial',
    fields: [
      { key: 'eyebrow',       label: 'Eyebrow (topo)',         type: 'text',     default: 'Grupo Omatapalo · Desde 2003' },
      { key: 'title_line1',   label: 'Título linha 1',         type: 'text',     default: 'FAZEMOS' },
      { key: 'title_line2',   label: 'Título linha 2 (contorno)', type: 'text',  default: 'ACONTECER' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'Engenharia, Construção e Infra-estruturas. A transformar Angola há mais de duas décadas.' },
      { key: 'cta_primary',      label: 'Botão principal',           type: 'text', default: 'Conhecer o Grupo' },
      { key: 'cta_primary_href', label: 'Link do botão principal',   type: 'text', default: '#grupo' },
      { key: 'cta_secondary', label: 'Botão secundário',        type: 'text',     default: 'Falar Connosco' },
      { key: 'cta_secondary_href', label: 'Link do botão secundário', type: 'text', default: '#contactos' },
      { key: 'stat1_value',   label: 'Estatística 1 — valor',  type: 'text',     default: '23' },
      { key: 'stat1_label',   label: 'Estatística 1 — rótulo', type: 'text',     default: 'Anos de Experiência' },
      { key: 'stat2_value',   label: 'Estatística 2 — valor',  type: 'text',     default: '+15.000' },
      { key: 'stat2_label',   label: 'Estatística 2 — rótulo', type: 'text',     default: 'Colaboradores' },
      { key: 'stat3_value',   label: 'Estatística 3 — valor',  type: 'text',     default: '+1.5M m²' },
      { key: 'stat3_label',   label: 'Estatística 3 — rótulo', type: 'text',     default: 'Área Construída' },
      { key: 'stat4_value',   label: 'Estatística 4 — valor',  type: 'text',     default: '+5.000 km' },
      { key: 'stat4_label',   label: 'Estatística 4 — rótulo', type: 'text',     default: 'de Estrada' },
      { key: 'stat5_value',   label: 'Estatística 5 — valor',  type: 'text',     default: '' },
      { key: 'stat5_label',   label: 'Estatística 5 — rótulo', type: 'text',     default: '' },
      { key: 'stat6_value',   label: 'Estatística 6 — valor',  type: 'text',     default: '' },
      { key: 'stat6_label',   label: 'Estatística 6 — rótulo', type: 'text',     default: '' },
      { key: 'stat7_value',   label: 'Estatística 7 — valor',  type: 'text',     default: '+14' },
      { key: 'stat7_label',   label: 'Estatística 7 — rótulo', type: 'text',     default: 'Hospitais' },
    ],
  },
  omatapalo: {
    label: 'O Grupo',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · O Grupo' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'O Grupo' },
      { key: 'intro_destaque', label: 'Parágrafo destaque (abaixo do hero)', type: 'textarea', default: 'A OMATAPALO é uma empresa nacional que gere um portefólio diversificado de negócios nas áreas de Engenharia e Construção, Obras Públicas, Agroindústria, Imobiliário, Minas, Pesca e Gestão Hoteleira.' },
    ],
  },
  portefolio: {
    label: 'Portefólio',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: '/COMPLEXO HOSPITALAR DOENÇAS CARDIO-PULMONARES CARDEAL D. ALEXANDRE DO NASCIMENTO (2).JPG' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · Portefólio' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'Portefólio' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'Obras que marcam Angola.' },
    ],
  },
  pessoas: {
    label: 'Pessoas',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',                   type: 'image',    default: '/Academia-barra.jpg' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',                     type: 'text',     default: 'Grupo Omatapalo · +15 000 Colaboradores' },
      { key: 'hero_title',    label: 'Título hero',                      type: 'text',     default: 'As nossas Pessoas' },
      { key: 'section_title', label: 'Título secção',                    type: 'text',     default: 'A nossa maior obra são as Pessoas' },
      { key: 'body_p1',       label: 'Parágrafo 1',                      type: 'textarea', default: 'Contando com mais de 15.000 colaboradores directos, a OMATAPALO possui no seu quadro técnico áreas de conhecimento relacionadas com a sua actividade.' },
      { key: 'body_p2',       label: 'Parágrafo 2',                      type: 'textarea', default: 'A empresa assenta a sua actuação em níveis de empenho, diligência na execução, responsabilidade na sua conduta, formando uma equipa pluridisciplinar capaz de conduzir processos, produzir resultados e garantir padrões de qualidade, cumprimento de prazos rigorosos, para uma sociedade que, cada vez mais, exige soluções mais céleres.' },
      { key: 'section_img',   label: 'Imagem da secção (ao lado do texto)', type: 'image', default: '/COLABORADORES OMTP.png' },
    ],
  },
  sustentabilidade: {
    label: 'Sustentabilidade',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · Sustentabilidade' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'Sustentabilidade' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'Comprometidos com o futuro de Angola e do planeta.' },
    ],
  },
  'responsabilidade-social': {
    label: 'R. Social',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: '/DSC_0030.jpg' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · Missão Fazer Sorrir' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'Responsabilidade Social' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'A responsabilidade social começa na nossa casa.' },
    ],
  },
  contactos: {
    label: 'Contactos',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: '/Omatapalo-Contactos-web.jpg' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · Contactos' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'Contactos' },
      { key: 'address',       label: 'Morada',                 type: 'textarea', default: 'Rua Marien Nguabi, Luanda, Angola' },
      { key: 'phone',         label: 'Telefone',               type: 'text',     default: '+244 222 000 000' },
      { key: 'email',         label: 'Email',                  type: 'text',     default: 'geral@omatapalo.com' },
      { key: 'hours',         label: 'Horário',                type: 'text',     default: 'Seg – Sex: 08h – 17h' },
    ],
  },
  'press-kit': {
    label: 'Press Kit',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: '/COMPLEXO HOSPITALAR DOENÇAS CARDIO-PULMONARES CARDEAL D. ALEXANDRE DO NASCIMENTO (2).JPG' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · Press Kit' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'Press Kit' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'Guia de identidade visual do Grupo Omatapalo.' },
    ],
  },
  cdh: {
    label: 'CDH',
    fields: [
      { key: 'hero_img',      label: 'Imagem do Hero',         type: 'image',    default: 'https://images.unsplash.com/photo-1577495508048-486bbc10a1a2?w=1600&q=80' },
      { key: 'hero_eyebrow',  label: 'Eyebrow hero',           type: 'text',     default: 'Grupo Omatapalo · CDH' },
      { key: 'hero_title',    label: 'Título hero',            type: 'text',     default: 'CDH' },
      { key: 'intro',         label: 'Texto introdutório',     type: 'textarea', default: 'Clube Desportivo da Huíla.' },
    ],
  },
};

export default function ConteudoPage() {
  const [activePage, setActivePage] = useState('home');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [msg, setMsg] = useState('');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function uploadImage(fieldKey: string, file: File) {
    setUploading(fieldKey);
    const db = createClient();
    const ext = file.name.split('.').pop();
    const path = `pages/${activePage}-${fieldKey}-${Date.now()}.${ext}`;
    const { data, error } = await db.storage.from('media').upload(path, file, { upsert: true });
    setUploading('');
    if (error) { setMsg('❌ Erro ao carregar: ' + error.message); return; }
    const { data: urlData } = db.storage.from('media').getPublicUrl(data.path);
    setValues(v => ({ ...v, [fieldKey]: urlData.publicUrl }));
  }

  const schema = SCHEMAS[activePage];

  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const f of schema.fields) defaults[f.key] = f.default;
    setValues(defaults);

    createClient()
      .from('site_content')
      .select('field,value')
      .eq('page', activePage)
      .then(({ data }) => {
        if (!data) return;
        setValues(prev => {
          const next = { ...prev };
          for (const row of data) if (row.value !== null) next[row.field] = row.value;
          return next;
        });
      });
  }, [activePage]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setSaving(true);
    const rows = Object.entries(values).map(([field, value]) => ({ page: activePage, field, value }));
    const { error } = await createClient().from('site_content').upsert(rows);
    setSaving(false);
    if (error) {
      setMsg('❌ Erro: ' + error.message);
    } else {
      setMsg('✅ Guardado! As alterações estão activas no site.');
    }
    setTimeout(() => setMsg(''), 4000);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0, minHeight: '100vh', margin: '-24px' }}>

      {/* Sidebar de páginas */}
      <nav style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24px 0' }}>
        <div style={{ padding: '0 16px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>Páginas</div>
        {Object.entries(SCHEMAS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: activePage === key ? '#1a396e' : 'transparent',
              color: activePage === key ? '#fff' : '#374151',
              borderLeft: activePage === key ? '3px solid #fff' : '3px solid transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Editor */}
      <div style={{ padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{schema.label}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Edita os textos desta página. As alterações ficam activas imediatamente.</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1, letterSpacing: '0.06em' }}
          >
            {saving ? 'A guardar…' : 'Guardar alterações'}
          </button>
        </div>

        {msg && (
          <div style={{ padding: '10px 16px', borderRadius: 4, marginBottom: 24, fontSize: 13, fontWeight: 600, background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}` }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {schema.fields.map(field => (
            <div key={field.key} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '18px 20px' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, letterSpacing: '0.04em' }}>
                {field.label}
              </label>
              {field.type === 'image' ? (
                <div>
                  {(values[field.key] || field.default) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values[field.key] || field.default} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, marginBottom: 10, border: '1px solid #e2e8f0' }} />
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={values[field.key] ?? field.default}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      placeholder="URL da imagem ou carrega um ficheiro"
                      style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <button
                      onClick={() => fileRefs.current[field.key]?.click()}
                      disabled={uploading === field.key}
                      style={{ padding: '10px 16px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {uploading === field.key ? 'A carregar…' : '⬆ Carregar foto'}
                    </button>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      ref={el => { fileRefs.current[field.key] = el; }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(field.key, f); }} />
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={values[field.key] ?? field.default}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, color: '#0f172a', lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? field.default}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              )}
              <div style={{ marginTop: 4, fontSize: 11, color: '#94a3b8' }}>Por defeito: {field.default}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

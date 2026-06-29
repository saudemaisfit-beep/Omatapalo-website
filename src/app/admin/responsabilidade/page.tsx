'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const inp: React.CSSProperties = { padding: '8px 11px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

const DEF_STATS = [
  { v: '720k+', l: 'Vidas Tocadas' },
  { v: '500k+', l: 'Sopas Distribuídas' },
  { v: '500k+', l: 'Merendas Escolares' },
  { v: '11',    l: 'Iniciativas Activas' },
];

const DEF_ODS = [
  {
    num: 1, key: 'ods1', color: '#E5243B', label: 'Erradicação da Pobreza',
    totalDirecta: 25234, totalIndirecta: 494962,
    desc: 'Apoio directo a famílias e crianças em situação de vulnerabilidade, através de infraestrutura social, educação e solidariedade.',
    projects: [
      { title: 'Aldeia de Crianças SOS Lubango', location: 'Lubango, Huíla', since: '2015', directa: 54, indirecta: 162, desc: 'A OMATAPALO apadrinha várias casas da Aldeia SOS Lubango com apoio mensal para dezenas de crianças no seu desenvolvimento educativo e psicoemocional.' },
      { title: 'Paróquia N.ª Sra. Muxima do Toco', location: 'Lubango, Huíla', since: '2012', directa: 20180, indirecta: 59960, desc: 'Escolas, dois hospitais equipados, cozinha comunitária e centro de formação profissional para uma comunidade de 20.000 habitantes.' },
      { title: 'Venha Dar a Sua Mão', location: 'Nacional', since: '2014', directa: 5000, indirecta: 15000, desc: 'Campanha anual de recolha e doação de brinquedos, roupa e material escolar para crianças carenciadas em todo o país.' },
      { title: 'Apoio na Luta Contra a Seca', location: 'Nacional', since: '2019', directa: 0, indirecta: 220000, desc: 'Distribuição de dez toneladas de alimentos essenciais a famílias afectadas pela seca em várias províncias.' },
      { title: 'Apoio na Distribuição de Água', location: '4 províncias', since: '2019', directa: 0, indirecta: 200000, desc: 'Abastecimento de água a 200.000 famílias em quatro províncias afectadas pela escassez hídrica.' },
    ],
  },
  {
    num: 2, key: 'ods2', color: '#DDA63A', label: 'Erradicar a Fome',
    totalDirecta: 1000, totalIndirecta: 500000,
    desc: 'Distribuição diária de refeições solidárias e apoio à produção agrícola local para garantir segurança alimentar.',
    projects: [
      { title: 'Campanha Sopas Solidárias', location: 'Luanda (5 zonas)', since: '2021', directa: 1000, indirecta: 500000, desc: 'Mais de 1.000 sopas e pão distribuídos diariamente em Luanda. 500k+ refeições acumuladas em Baixa, Talatona, Viana, Zango e Cacuaco.' },
      { title: 'Apoio às Comunidades Agrícolas', location: 'Fazenda Mumba', since: '2019', directa: 0, indirecta: 0, desc: 'Apoio mecânico e sementes para 150 hectares de cultivo de milho e feijão, beneficiando centenas de famílias rurais.' },
    ],
  },
  {
    num: 3, key: 'ods3', color: '#4C9F38', label: 'Saúde de Qualidade',
    totalDirecta: 400, totalIndirecta: 1190,
    desc: 'Campanhas médicas anuais e doação de sangue para garantir acesso a cuidados de saúde primários em comunidades remotas.',
    projects: [
      { title: 'Campanha Médica do Tchivinguiro', location: 'Humpata, Huíla', since: '2016', directa: 400, indirecta: 0, desc: 'Consultas médicas, medicamentos, alimentação e material escolar para 400 crianças anuais com voluntários do Hospital S. António.' },
      { title: 'Campanha Interna de Doação de Sangue', location: 'Nacional', since: '2017', directa: 0, indirecta: 0, desc: 'Campanhas regulares em parceria com o Instituto Nacional de Sangue (INS), abastecendo hospitais públicos de referência.' },
    ],
  },
  {
    num: 4, key: 'ods4', color: '#C5192D', label: 'Educação de Qualidade',
    totalDirecta: 152000, totalIndirecta: 506000,
    desc: 'Merenda escolar, material didáctico e construção de infraestruturas educativas em comunidades rurais.',
    projects: [
      { title: 'Projecto Merenda Escolar', location: 'Fazenda Mumba', since: '2016', directa: 150000, indirecta: 500000, desc: 'Mais de 150.000 refeições escolares anuais às aldeias de Manengo, Hungulo, Makova, Calundungo e Kwanda. 500k+ acumuladas.' },
      { title: 'Projecto Escola Fazer Sorrir', location: 'Nacional', since: '2018', directa: 2000, indirecta: 6000, desc: 'Construção e equipamento de salas de aula em comunidades rurais com doação de cadernos, lápis, mochilas e livros.' },
    ],
  },
];

const DEF_TEXTS = {
  citacao: 'Para nós, a responsabilidade social começa na nossa casa e nas condições que damos aos nossos Colaboradores. É nesta matriz e nesta filosofia que assenta a nossa capacidade de fazer acontecer.',
  p1: 'Num país onde existe pobreza e desigualdade, a OMATAPALO considera a responsabilidade social de extrema importância. A contribuição para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvida através da promoção e apoio em iniciativas de natureza social nos domínios da beneficência e solidariedade social.',
  p2: 'Nesse sentido, a OMATAPALO abraça 4 dos 17 objectivos fixados pela ONU na Agenda 2030, como vectores para a sua participação activa nas perspetivas económicas, social e ambiental.',
};

const KEY = 'responsabilidade_cfg';

const sec = (t: string) => (
  <div style={{ fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#94a3b8', marginTop: 32, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>{t}</div>
);

export default function ResponsabilidadeAdmin() {
  const [stats, setStats] = useState(DEF_STATS);
  const [texts, setTexts] = useState(DEF_TEXTS);
  const [ods, setOds] = useState(DEF_ODS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', KEY).single().then(({ data }) => {
      if (!data?.value) return;
      try {
        const cfg = JSON.parse(data.value);
        if (cfg.stats) setStats(cfg.stats);
        if (cfg.texts) setTexts(cfg.texts);
        if (cfg.ods)   setOds(cfg.ods);
      } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: KEY, value: JSON.stringify({ stats, texts, ods }) });
    setSaving(false);
    setMsg(error ? '❌ Erro: ' + error.message : '✅ Guardado!');
    setTimeout(() => setMsg(''), 3000);
  }

  function setStat(i: number, f: string, v: string) {
    setStats(p => p.map((s, idx) => idx === i ? { ...s, [f]: v } : s));
  }
  function setOdsField(i: number, f: string, v: string | number) {
    setOds(p => p.map((o, idx) => idx === i ? { ...o, [f]: v } : o));
  }
  function setProj(oi: number, pi: number, f: string, v: string | number) {
    setOds(p => p.map((o, idx) => idx === oi ? { ...o, projects: o.projects.map((pr, pidx) => pidx === pi ? { ...pr, [f]: v } : pr) } : o));
  }
  function addProj(oi: number) {
    setOds(p => p.map((o, idx) => idx === oi ? { ...o, projects: [...o.projects, { title: '', location: '', since: '', directa: 0, indirecta: 0, desc: '' }] } : o));
  }
  function delProj(oi: number, pi: number) {
    setOds(p => p.map((o, idx) => idx === oi ? { ...o, projects: o.projects.filter((_, pidx) => pidx !== pi) } : o));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Responsabilidade Social</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Textos, números e projectos da página RSE</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      {/* Stats */}
      {sec('4 Números de destaque')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={s.v} onChange={e => setStat(i, 'v', e.target.value)} placeholder="Valor (ex: 720k+)" style={inp} />
            <input value={s.l} onChange={e => setStat(i, 'l', e.target.value)} placeholder="Legenda" style={inp} />
          </div>
        ))}
      </div>

      {/* Textos */}
      {sec('Citação e parágrafos')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Citação</label>
          <textarea value={texts.citacao} onChange={e => setTexts(p => ({ ...p, citacao: e.target.value }))} rows={3} style={ta} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo 1</label>
          <textarea value={texts.p1} onChange={e => setTexts(p => ({ ...p, p1: e.target.value }))} rows={3} style={ta} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Parágrafo 2</label>
          <textarea value={texts.p2} onChange={e => setTexts(p => ({ ...p, p2: e.target.value }))} rows={2} style={ta} />
        </div>
      </div>

      {/* ODS */}
      {ods.map((o, oi) => (
        <div key={o.key}>
          {sec(`ODS ${o.num} — ${o.label}`)}
          <div style={{ background: '#fff', border: `2px solid ${o.color}20`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: o.color, padding: '10px 16px', color: '#fff', fontSize: 13, fontWeight: 700 }}>ODS {o.num}</div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={o.label} onChange={e => setOdsField(oi, 'label', e.target.value)} placeholder="Título" style={inp} />
              <textarea value={o.desc} onChange={e => setOdsField(oi, 'desc', e.target.value)} placeholder="Descrição" rows={2} style={ta} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Total Directas</label>
                  <input type="number" value={o.totalDirecta} onChange={e => setOdsField(oi, 'totalDirecta', Number(e.target.value))} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Total Indirectas</label>
                  <input type="number" value={o.totalIndirecta} onChange={e => setOdsField(oi, 'totalIndirecta', Number(e.target.value))} style={inp} />
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginTop: 8 }}>Projectos</div>
              {o.projects.map((p, pi) => (
                <div key={pi} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: o.color }}>Projecto {pi + 1}</div>
                  <input value={p.title} onChange={e => setProj(oi, pi, 'title', e.target.value)} placeholder="Título do projecto" style={inp} />
                  <textarea value={p.desc} onChange={e => setProj(oi, pi, 'desc', e.target.value)} placeholder="Descrição" rows={2} style={ta} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                    <input value={p.location} onChange={e => setProj(oi, pi, 'location', e.target.value)} placeholder="Localização" style={inp} />
                    <input value={p.since} onChange={e => setProj(oi, pi, 'since', e.target.value)} placeholder="Desde (ano)" style={inp} />
                    <input type="number" value={p.directa} onChange={e => setProj(oi, pi, 'directa', Number(e.target.value))} placeholder="Directas" style={inp} />
                    <input type="number" value={p.indirecta} onChange={e => setProj(oi, pi, 'indirecta', Number(e.target.value))} placeholder="Indirectas" style={inp} />
                  </div>
                  <button onClick={() => delProj(oi, pi)} style={{ position: 'absolute', top: 10, right: 10, background: '#fee2e2', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Remover</button>
                </div>
              ))}
              <button onClick={() => addProj(oi)} style={{ padding: '8px', background: '#f8fafc', border: `1.5px dashed ${o.color}60`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: o.color }}>+ Adicionar projecto</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Company = {
  logo: string; name: string; year: string;
  area: string; desc: string; link: string;
};
type Sector = { id: string; label: string; short: string; companies: Company[] };

const DEFAULT_SECTORS: Sector[] = [
  {
    id: 'primario', label: 'Sector Primário', short: '01',
    companies: [
      { logo: '/Mumba-logo.png',  name: 'Fazenda Mumba', year: '2015', area: 'Agro-negócio',          desc: 'Produção agrícola e pecuária.', link: '' },
      { logo: '/OCTOSEA (1).png', name: 'Octosea',       year: '2010', area: 'Pescas',                desc: 'Exploração de recursos haliêuticos.', link: '' },
      { logo: '/ANIMOPER.png',    name: 'Animoper',      year: '2022', area: 'Mineração – Ouro',      desc: 'Mineração e tratamento de metais preciosos.', link: '' },
      { logo: '/logo-MAOMA.png',  name: 'Maoma',         year: '2019', area: 'Mineração – Diamantes', desc: 'Exploração e comercialização de diamantes.', link: '' },
    ],
  },
  {
    id: 'secundario', label: 'Sector Secundário', short: '02',
    companies: [
      { logo: '/Omatapalo-Engenharia-e-Construcao.png', name: 'Omatapalo',  year: '2003', area: 'Engenharia e Construção',  desc: 'Empresa-mãe do grupo.', link: '' },
      { logo: '/METALOSUL. (1).png', name: 'Metalosul',  year: '2009', area: 'Metalomecânica',       desc: 'Fabrico e montagem de estruturas metálicas.', link: '' },
      { logo: '/GraniSul-Logotipo.png', name: 'Granisul', year: '2010', area: 'Extracção de Granito', desc: 'Extracção e transformação de granito.', link: '' },
      { logo: '/DRILL-GO.png',    name: 'DrillGo',    year: '2019', area: 'Geotecnia',              desc: 'Obras subterrâneas e geotecnia.', link: '' },
      { logo: '/SIEMA-1.png',     name: 'Siema',      year: '2012', area: 'Instalações Especiais',  desc: 'Sistemas eléctricos, AVAC e infraestruturas.', link: '' },
      { logo: '/Planasul (1).png', name: 'Planasul',  year: '2003', area: 'Engenharia e Construção', desc: 'Construção civil e obras públicas.', link: '' },
      { logo: '/SelaGrup-Logotipo.png', name: 'Selagrup', year: '2020', area: 'Captação de Água',   desc: 'Furos e redes de distribuição de água.', link: '' },
      { logo: '/Emadel.png',      name: 'Emadel',     year: '2010', area: 'Carpintaria',            desc: 'Soluções em madeira para construção.', link: '' },
      { logo: '/Enerline.png',    name: 'Enerline',   year: '2014', area: 'Energia',                desc: 'Soluções energéticas e energias renováveis.', link: '' },
    ],
  },
  {
    id: 'terciario', label: 'Sector Terciário', short: '03',
    companies: [
      { logo: '/Investimo Ge.png',          name: 'Investimo GE',     year: '2025', area: 'Gestão de Edifícios', desc: 'Gestão técnica e operacional de edifícios.', link: '' },
      { logo: '/investimo.png',             name: 'Investimo',        year: '2014', area: 'Imobiliário',         desc: 'Investimento e promoção imobiliária.', link: '' },
      { logo: '/Logo-Prime-Properties.png', name: 'Prime Properties', year: '2024', area: 'Imobiliário',         desc: 'Gestão e comercialização de activos.', link: '' },
      { logo: '/ONTOUR.png',                name: 'OnTour',           year: '2022', area: 'Turismo',             desc: 'Serviços de turismo e hospitalidade.', link: '' },
      { logo: '/Venture Vanguard.png',      name: 'Venture Vanguard', year: '2024', area: 'Trading',             desc: 'Consultoria e trading de commodities.', link: '' },
      { logo: '/SOTRANS-Logo.png',          name: 'Sotrans',          year: '2014', area: 'Transportes',         desc: 'Transporte de passageiros e logística.', link: '' },
      { logo: '/EMADEL-LAR.png',            name: 'EmadelLar',        year: '',     area: '',                    desc: '', link: '' },
      { logo: '/Okuanjuluka.png',           name: 'Okuajuluka',       year: '',     area: 'Arquitectura de Interiores', desc: '', link: '' },
    ],
  },
];

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0',
  borderRadius: 5, fontSize: 13, outline: 'none', boxSizing: 'border-box', ...extra,
});

export default function NegociosAdminPage() {
  const [sectors, setSectors] = useState<Sector[]>(DEFAULT_SECTORS);
  const [title1, setTitle1] = useState('Empresas');
  const [title2, setTitle2] = useState('do Grupo');
  const [intro, setIntro] = useState('Um ecossistema empresarial diversificado que actua nos principais sectores da economia angolana.');
  const [activeSector, setActiveSector] = useState('primario');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  async function uploadLogo(sectorId: string, compIdx: number, file: File) {
    const key = `${sectorId}-${compIdx}`;
    setUploading(key);
    const db = createClient();
    const ext = file.name.split('.').pop();
    const path = `logos/${sectorId}-${compIdx}-${Date.now()}.${ext}`;
    const { data, error } = await db.storage.from('media').upload(path, file, { upsert: true });
    if (error) { flash('❌ Erro: ' + error.message); setUploading(null); return; }
    const { data: urlData } = db.storage.from('media').getPublicUrl(data.path);
    updateCompany(sectorId, compIdx, 'logo', urlData.publicUrl);
    setUploading(null);
    flash('✅ Logo carregado!');
  }

  useEffect(() => {
    createClient().from('site_content').select('field,value').eq('page', 'negocios').then(({ data }) => {
      if (!data) return;
      for (const row of data) {
        if (row.field === 'sectors') { try { setSectors(JSON.parse(row.value)); } catch {} }
        if (row.field === 'intro') setIntro(row.value);
        if (row.field === 'title1') setTitle1(row.value);
        if (row.field === 'title2') setTitle2(row.value);
      }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  async function save() {
    setSaving(true);
    const db = createClient();
    const [r1, r2, r3, r4] = await Promise.all([
      db.from('site_content').upsert({ page: 'negocios', field: 'sectors', value: JSON.stringify(sectors) }),
      db.from('site_content').upsert({ page: 'negocios', field: 'intro', value: intro }),
      db.from('site_content').upsert({ page: 'negocios', field: 'title1', value: title1 }),
      db.from('site_content').upsert({ page: 'negocios', field: 'title2', value: title2 }),
    ]);
    setSaving(false);
    flash(r1.error || r2.error || r3.error || r4.error ? '❌ Erro ao guardar' : '✅ Guardado!');
  }

  function updateCompany(sectorId: string, compIdx: number, field: keyof Company, value: string) {
    setSectors(prev => prev.map(s =>
      s.id !== sectorId ? s : {
        ...s,
        companies: s.companies.map((c, i) => i !== compIdx ? c : { ...c, [field]: value }),
      }
    ));
  }

  const sector = sectors.find(s => s.id === activeSector)!;

  return (
    <div style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Empresas do Grupo</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>Edita os dados e links de cada empresa por sector.</p>

      {msg && (
        <div style={{ background: msg.startsWith('❌') ? '#fee2e2' : '#dcfce7', border: `1px solid ${msg.startsWith('❌') ? '#fca5a5' : '#bbf7d0'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, fontWeight: 600, color: msg.startsWith('❌') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {/* Títulos */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Título da secção</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Linha 1 (destaque)</label>
            <input value={title1} onChange={e => setTitle1(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Linha 2 (contorno)</label>
            <input value={title2} onChange={e => setTitle2(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      {/* Texto introdutório */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 28 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Texto introdutório da secção</label>
        <textarea
          value={intro}
          onChange={e => setIntro(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #bfdbfe', borderRadius: 6, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#f0f7ff', lineHeight: 1.6 }}
        />
      </div>

      {/* Tabs de sector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {sectors.map(s => (
          <button key={s.id} onClick={() => setActiveSector(s.id)} style={{
            padding: '8px 18px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 12,
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: activeSector === s.id ? '#1a396e' : '#f1f5f9',
            color: activeSector === s.id ? '#fff' : '#374151',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Lista de empresas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sector.companies.map((company, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {company.logo && <img src={company.logo} alt={company.name} style={{ height: 36, maxWidth: 100, objectFit: 'contain' }} />}
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{company.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>NOME</label>
                <input style={inp()} value={company.name} onChange={e => updateCompany(sector.id, i, 'name', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>ÁREA / SECTOR</label>
                <input style={inp()} value={company.area} onChange={e => updateCompany(sector.id, i, 'area', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>ANO DE FUNDAÇÃO</label>
                <input style={inp()} value={company.year} onChange={e => updateCompany(sector.id, i, 'year', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 8 }}>LOGO</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {company.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={company.logo} alt={company.name} style={{ height: 40, maxWidth: 90, objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 4, padding: 4, background: '#f8fafc' }} />
                  )}
                  <label style={{ padding: '7px 14px', background: uploading === `${sector.id}-${i}` ? '#94a3b8' : '#1a396e', color: '#fff', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {uploading === `${sector.id}-${i}` ? 'A carregar…' : '+ Trocar logo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(sector.id, i, f); }} />
                  </label>
                </div>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>DESCRIÇÃO</label>
                <input style={inp()} value={company.desc} onChange={e => updateCompany(sector.id, i, 'desc', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a396e', display: 'block', marginBottom: 4 }}>🔗 LINK DO SITE DA EMPRESA</label>
                <input
                  style={inp({ borderColor: '#bfdbfe', background: '#f0f7ff' })}
                  type="url"
                  placeholder="https://..."
                  value={company.link ?? ''}
                  onChange={e => updateCompany(sector.id, i, 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <button onClick={save} disabled={saving} style={{
          padding: '12px 32px', background: '#1a396e', color: '#fff',
          border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
        }}>{saving ? 'A guardar…' : 'Guardar Alterações'}</button>
      </div>
    </div>
  );
}

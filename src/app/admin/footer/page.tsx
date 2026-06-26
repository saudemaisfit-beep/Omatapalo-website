'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Link = { t: string; href: string };
type Col  = { h: string; links: Link[] };

const DEFAULT_COLS: Col[] = [
  { h: 'O Grupo', links: [
    { t: 'O Grupo e os Negócios',     href: '/omatapalo' },
    { t: 'Omatapalo no Mundo',        href: '/omatapalo#mundo' },
    { t: 'História',                   href: '/omatapalo' },
    { t: 'Conselho de Administração', href: '/omatapalo#conselho' },
  ]},
  { h: 'Atividade', links: [
    { t: 'Portefólio',       href: '/portefolio' },
    { t: 'Sustentabilidade', href: '/sustentabilidade' },
    { t: 'Media',            href: '/media' },
    { t: 'Contactos',        href: '/contactos' },
  ]},
  { h: 'Pessoas', links: [
    { t: 'Pessoas',             href: '/pessoas' },
    { t: 'CDH',                 href: '/cdh' },
    { t: 'Missão Fazer Sorrir', href: '/responsabilidade-social#missao' },
    { t: 'Trabalhar connosco',  href: '/contactos' },
  ]},
];

const DEFAULT_DESC = 'Engenharia, Construção e Infra-estruturas a transformar Angola e o continente africano desde 2003. Fazemos acontecer.';

const inp = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' as const };

export default function FooterAdminPage() {
  const [desc, setDesc]   = useState(DEFAULT_DESC);
  const [cols, setCols]   = useState<Col[]>(DEFAULT_COLS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]     = useState('');

  useEffect(() => {
    createClient().from('site_settings').select('key,value').in('key', ['footer_desc', 'footer_cols']).then(({ data }) => {
      if (!data) return;
      for (const row of data) {
        if (row.key === 'footer_desc') setDesc(row.value);
        if (row.key === 'footer_cols') { try { setCols(JSON.parse(row.value)); } catch {} }
      }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  async function save() {
    setSaving(true);
    const db = createClient();
    const [r1, r2] = await Promise.all([
      db.from('site_settings').upsert({ key: 'footer_desc', value: desc }),
      db.from('site_settings').upsert({ key: 'footer_cols', value: JSON.stringify(cols) }),
    ]);
    setSaving(false);
    flash(r1.error || r2.error ? '❌ Erro ao guardar' : '✅ Footer guardado!');
  }

  function updateColTitle(ci: number, val: string) {
    setCols(prev => prev.map((c, i) => i === ci ? { ...c, h: val } : c));
  }
  function updateLink(ci: number, li: number, field: keyof Link, val: string) {
    setCols(prev => prev.map((c, i) => i === ci
      ? { ...c, links: c.links.map((l, j) => j === li ? { ...l, [field]: val } : l) }
      : c));
  }
  function addLink(ci: number) {
    setCols(prev => prev.map((c, i) => i === ci ? { ...c, links: [...c.links, { t: '', href: '/' }] } : c));
  }
  function removeLink(ci: number, li: number) {
    setCols(prev => prev.map((c, i) => i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c));
  }
  function moveLink(ci: number, li: number, dir: -1 | 1) {
    setCols(prev => prev.map((c, i) => {
      if (i !== ci) return c;
      const arr = [...c.links];
      const j = li + dir;
      if (j < 0 || j >= arr.length) return c;
      [arr[li], arr[j]] = [arr[j], arr[li]];
      return { ...c, links: arr };
    }));
  }

  return (
    <div style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Footer</h1>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14 }}>Edita o texto descritivo e os links das colunas do rodapé.</p>

      {msg && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Descrição */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Texto descritivo</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={3}
          style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      {/* Colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Título da coluna</label>
            <input
              value={col.h}
              onChange={e => updateColTitle(ci, e.target.value)}
              style={{ ...inp, marginBottom: 16 }}
            />

            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Links</label>
            {col.links.map((link, li) => (
              <div key={li} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <input
                    value={link.t}
                    onChange={e => updateLink(ci, li, 't', e.target.value)}
                    placeholder="Texto"
                    style={{ ...inp, fontSize: 12 }}
                  />
                  <input
                    value={link.href}
                    onChange={e => updateLink(ci, li, 'href', e.target.value)}
                    placeholder="URL"
                    style={{ ...inp, fontSize: 12, color: '#64748b' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                  <button onClick={() => moveLink(ci, li, -1)} style={{ padding: '4px 7px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>↑</button>
                  <button onClick={() => moveLink(ci, li,  1)} style={{ padding: '4px 7px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>↓</button>
                </div>
                <button
                  onClick={() => removeLink(ci, li)}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}
                  title="Remover"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => addLink(ci)}
              style={{ width: '100%', marginTop: 4, padding: '7px', background: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: 6, fontSize: 12, color: '#475569', cursor: 'pointer' }}
            >+ Adicionar link</button>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{ padding: '12px 32px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
      >{saving ? 'A guardar…' : 'Guardar Footer'}</button>
    </div>
  );
}

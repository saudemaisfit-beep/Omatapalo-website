'use client';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_COLS = [
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

const SOCIAL_ICONS: Record<string, ReactElement> = {
  linkedin:  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  facebook:  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  youtube:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a396e"/></svg>,
};

const DEFAULT_SOCIALS = {
  linkedin:  'https://www.linkedin.com/company/grupo-omatapalo',
  facebook:  'https://www.facebook.com/grupoomatapalo',
  instagram: 'https://www.instagram.com/grupoomatapalo',
  youtube:   'https://www.youtube.com/@grupoomatapalo',
};

export default function Footer() {
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);
  const [cols, setCols]       = useState(DEFAULT_COLS);
  const [desc, setDesc]       = useState(DEFAULT_DESC);

  useEffect(() => {
    createClient().from('site_settings').select('key,value').in('key', ['social_links', 'footer_cols', 'footer_desc']).then(({ data }) => {
      if (!data) return;
      for (const row of data) {
        if (row.key === 'social_links') { try { setSocials(JSON.parse(row.value)); } catch {} }
        if (row.key === 'footer_cols')  { try { setCols(JSON.parse(row.value)); } catch {} }
        if (row.key === 'footer_desc')  setDesc(row.value);
      }
    });
  }, []);

  return (
    <footer style={{ background: '#1a396e', color: '#fff', paddingBlock: '120px var(--space-6)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr 1fr', gap: 'var(--space-7)' }} className="ftr-grid">
          <div>
            <Image
              src="/logo/LOGO OMT 1.png"
              alt="Omatapalo"
              width={220}
              height={38}
              className="w-auto"
              style={{ marginBottom: 'var(--space-3)', filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.65, color: '#fff', maxWidth: '320px' }}>
              {desc}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: 'var(--space-5)' }}>
              {(Object.entries(socials) as [string, string][]).map(([key, href]) => (
                <a key={key} href={href} aria-label={key} target="_blank" rel="noopener noreferrer" style={{
                  width: '38px', height: '38px', border: '1px solid var(--border-dark)',
                  borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700,
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                }}
                  className="ftr-social"
                >
                  {SOCIAL_ICONS[key]}
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.h}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {c.links.map((l) => (
                  <li key={l.t}>
                    <a href={l.href} style={{ fontSize: 'var(--text-sm)', color: '#fff', transition: 'color 0.2s' }} className="ftr-link">{l.t}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-9)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-dark)', fontSize: 'var(--text-xs)', color: '#fff' }}>
          <span>© 2026 Grupo Omatapalo · Todos os direitos reservados</span>
          <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
            <a href="https://rsbzgeqgfseyeogexkwk.supabase.co/storage/v1/object/public/cms-media/uploads/1782502445398-Politica-Gestao_2023-10-27.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.6, textDecoration: 'none' }} className="ftr-link">Política do Sistema de Gestão Integrado</a>
            {['Termos de Uso', 'Cookies'].map((l) => (
              <span key={l} style={{ color: '#fff', opacity: 0.6 }} className="ftr-link">{l}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ftr-social:hover { background: var(--brand) !important; border-color: var(--brand) !important; color: #fff !important; }
        .ftr-link:hover { color: #fff !important; }
        @media (max-width:880px) { .ftr-grid { grid-template-columns: 1fr 1fr !important; gap: var(--space-7) !important; } }
        @media (max-width:540px) { .ftr-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

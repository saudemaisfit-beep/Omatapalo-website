import Image from 'next/image';

const COLS = [
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

const SOCIALS = [
  { label: 'LinkedIn',  icon: 'in', href: 'https://www.linkedin.com/company/grupo-omatapalo' },
  { label: 'Instagram', icon: '◻', href: 'https://www.instagram.com/grupoomatapalo' },
  { label: 'Facebook',  icon: 'f',  href: 'https://www.facebook.com/grupoomatapalo' },
  { label: 'YouTube',   icon: '▶', href: 'https://www.youtube.com/@grupoomatapalo' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#1a396e', color: '#fff', paddingBlock: 'var(--space-10) var(--space-6)' }}>
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
              Engenharia, Construção e Infra-estruturas a transformar Angola e o continente africano desde 2003. Fazemos acontecer.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: 'var(--space-5)' }}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" style={{
                  width: '38px', height: '38px', border: '1px solid var(--border-dark)',
                  borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700,
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                }}
                  className="ftr-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.h}>
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 'var(--space-4)' }}>{c.h}</h4>
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
            {['Política do Sistema de Gestão Integrado', 'Termos de Uso', 'Cookies'].map((l) => (
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

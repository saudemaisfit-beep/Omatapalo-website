import Image from 'next/image';

const COLS = [
  { h: 'O Grupo', links: ['O Grupo e os Negócios', 'Omatapalo no Mundo', 'História', 'Conselho de Administração'] },
  { h: 'Atividade', links: ['Portefólio', 'Sustentabilidade', 'Media', 'Contactos'] },
  { h: 'Pessoas', links: ['Pessoas', 'CDH', 'Missão Fazer Sorrir', 'Trabalhar connosco'] },
];

const SOCIALS = [
  { label: 'LinkedIn', icon: 'in' },
  { label: 'Instagram', icon: '◻' },
  { label: 'Facebook', icon: 'f' },
  { label: 'YouTube', icon: '▶' },
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
            <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--space-5)' }}>
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="ftr-social" style={{
                  display: 'block', width: '40px', height: '40px',
                  borderRadius: '10px', overflow: 'hidden',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  flexShrink: 0,
                }}>
                  <Image
                    src={`/${s.label.toLowerCase()}.png`}
                    alt={s.label}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', display: 'block', width: '100%', height: '100%' }}
                  />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.h}>
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 'var(--space-4)' }}>{c.h}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 'var(--text-sm)', color: '#fff', transition: 'color 0.2s' }} className="ftr-link">{l}</a>
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
              <a key={l} href="#" style={{ color: '#fff', transition: 'color 0.2s' }} className="ftr-link">{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ftr-social:hover { transform: scale(1.1) !important; opacity: 0.85 !important; }
        .ftr-link:hover { color: #fff !important; }
        @media (max-width:880px) { .ftr-grid { grid-template-columns: 1fr 1fr !important; gap: var(--space-7) !important; } }
        @media (max-width:540px) { .ftr-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

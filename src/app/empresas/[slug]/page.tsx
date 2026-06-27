import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCompany, ALL_COMPANIES } from '@/data/empresas';

export async function generateStaticParams() {
  return ALL_COMPANIES.map(c => ({ slug: c.slug }));
}

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  return (
    <main style={{ background: '#F6F8FB', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8EDF5' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(80px,10vh,120px)', paddingBottom: 'clamp(48px,6vh,80px)' }}>
          <Link href="/o-grupo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none', marginBottom: 40 }}>
            ← O Grupo
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px,4vw,64px)', flexWrap: 'wrap' }}>
            {/* Logo */}
            <div style={{ background: '#F6F8FB', borderRadius: 12, padding: 'clamp(24px,3vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 'clamp(160px,20vw,240px)', height: 'clamp(120px,14vw,180px)', border: '1.5px solid #E8EDF5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {company.logo && <img src={company.logo} alt={company.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 240 }}>
              {company.area && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, background: '#1a396e', borderRadius: 2 }} />
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e' }}>{company.sectorLabel} · {company.area}</span>
                </div>
              )}
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 24px' }}>
                {company.name}
              </h1>
              {company.year && (
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8' }}>
                  Fundada em {company.year}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="wrap" style={{ paddingTop: 'clamp(48px,6vh,80px)', paddingBottom: 'clamp(80px,10vh,120px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) clamp(240px,28vw,360px)', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }}>

          {/* Left: description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 2, background: '#1a396e' }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e' }}>Sobre a empresa</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1rem,1.3vw,1.15rem)', color: '#334155', lineHeight: 1.75, margin: 0 }}>
              {company.desc || 'Informação em breve.'}
            </p>
          </div>

          {/* Right: details card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E8EDF5', padding: 'clamp(24px,2.5vw,36px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {company.area && (
              <div>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Sector de actividade</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#0F1A2E' }}>{company.area}</div>
              </div>
            )}
            {company.year && (
              <div>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Ano de fundação</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#0F1A2E' }}>{company.year}</div>
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Grupo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#0F1A2E' }}>OMT Group</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Sector</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#0F1A2E' }}>{company.sectorLabel}</div>
            </div>

            {/* CTA */}
            {company.link && (
              <a
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: '#1a396e', color: '#fff', textDecoration: 'none',
                  padding: '14px 24px', borderRadius: 8,
                  fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontWeight: 700,
                  transition: 'background 0.2s',
                }}
              >
                Visitar site oficial →
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

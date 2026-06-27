import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCompany, ALL_COMPANIES } from '@/data/empresas';
export async function generateStaticParams() {
  return ALL_COMPANIES.map(c => ({ slug: c.slug }));
}

export const revalidate = 60;

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsbzgeqgfseyeogexkwk.supabase.co';
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYnpnZXFnZnNleWVvZ2V4a3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNTkxOTYsImV4cCI6MjA5NzkzNTE5Nn0.QsQjaOPnUj5GyEk5Qb_l0vLFOZQ96hO_QrQI382wZaE';
  let description = company.desc || '';
  let gallery: string[] = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/empresas?select=full_description,gallery&slug=eq.${slug}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
    );
    const rows = await res.json();
    if (rows?.[0]) {
      if (rows[0].full_description) description = rows[0].full_description;
      if (rows[0].gallery) gallery = rows[0].gallery;
    }
  } catch {}

  const paragraphs = description.split('\n').filter((p: string) => p.trim());

  return (
    <main style={{ background: '#F6F8FB', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8EDF5' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(80px,10vh,120px)', paddingBottom: 'clamp(48px,6vh,80px)' }}>
          <Link href="/o-grupo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none', marginBottom: 40 }}>
            ← O Grupo
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px,4vw,64px)', flexWrap: 'wrap' }}>
            <div style={{ background: '#F6F8FB', borderRadius: 12, padding: 'clamp(24px,3vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 'clamp(160px,20vw,240px)', height: 'clamp(120px,14vw,180px)', border: '1.5px solid #E8EDF5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {company.logo && <img src={company.logo} alt={company.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
            </div>

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

          {/* Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 24, height: 2, background: '#1a396e' }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e' }}>Sobre a empresa</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
              {paragraphs.length > 0
                ? paragraphs.map((p: string, i: number) => (
                    <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.95rem,1.2vw,1.1rem)', color: '#334155', lineHeight: 1.8, margin: 0 }}>{p}</p>
                  ))
                : <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#94a3b8', margin: 0 }}>Informação em breve.</p>
              }
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 24, height: 2, background: '#1a396e' }} />
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e' }}>Galeria</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {gallery.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`${company.name} ${i + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8, border: '1px solid #E8EDF5' }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E8EDF5', padding: 'clamp(24px,2.5vw,36px)', display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 100 }}>
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

            {company.link && (
              <a
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1a396e', color: '#fff', textDecoration: 'none', padding: '14px 24px', borderRadius: 8, fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}
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

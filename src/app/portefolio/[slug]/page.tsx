'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const CAT_LABELS: Record<string, string> = {
  inst: 'Edifícios Institucionais', saude: 'Saúde', ensino: 'Ensino',
  habitacao: 'Habitação e Escritórios', recintos: 'Recintos Desportivos, Culturais e Comerciais',
  agro: 'Agricultura e Indústria', turismo: 'Turismo e Lazer', vias: 'Vias de Comunicação',
  pontes: 'Pontes e Viadutos', infra: 'Infra-estruturas', oilgas: 'Oil & Gas', energia: 'Energia',
};

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => i! < images.length - 1 ? i! + 1 : 0);
      if (e.key === 'ArrowLeft')  setLightbox(i => i! > 0 ? i! - 1 : images.length - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  useEffect(() => {
    createClient()
      .from('portfolio_projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => { setProject(data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <>
      <Nav />
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748b', fontSize: 14 }}>A carregar...</div>
      </main>
      <Footer />
    </>
  );

  if (!project) return (
    <>
      <Nav />
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#e2e8f0' }}>404</div>
        <div style={{ color: '#64748b' }}>Projeto não encontrado.</div>
        <Link href="/portefolio" style={{ color: '#1a396e', fontWeight: 600, textDecoration: 'none' }}>← Voltar ao portfólio</Link>
      </main>
      <Footer />
    </>
  );

  const catLabel = CAT_LABELS[project.category] ?? project.category;
  const images: string[] = project.images ?? [];

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <div style={{ position: 'relative', height: 'clamp(320px, 55vh, 640px)', background: '#07101f', overflow: 'hidden' }}>
          {project.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.cover_image} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,16,31,0.2) 0%, rgba(7,16,31,0.75) 100%)' }} />
          <div className="wrap" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'clamp(32px,6vh,64px)' }}>
            <Link href="/portefolio" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Portfólio
            </Link>
            <div style={{ display: 'inline-block', background: '#1a396e', padding: '4px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', marginBottom: 12 }}>
              {catLabel}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
              {project.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="wrap" style={{ paddingTop: 'clamp(40px,7vh,80px)', paddingBottom: 'clamp(48px,8vh,96px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>

            {/* Left: description + gallery */}
            <div>
              {project.description && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e', marginBottom: 12 }}>Sobre o Projecto</div>
                  <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', color: '#1e293b', lineHeight: 1.8, margin: 0 }}>{project.description}</p>
                </div>
              )}

              {images.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e', marginBottom: 16 }}>Galeria</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {images.map((url: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt={`${project.title} ${i + 1}`}
                        onClick={() => setLightbox(i)}
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4, cursor: 'zoom-in', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lightbox */}
              {lightbox !== null && (
                <div
                  onClick={() => setLightbox(null)}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(7,16,31,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {/* Prev */}
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox(i => i! > 0 ? i! - 1 : images.length - 1); }}
                    style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 28, width: 52, height: 52, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >‹</button>

                  {/* Image */}
                  <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[lightbox]} alt={`${project.title} ${lightbox + 1}`}
                      style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block', borderRadius: 4 }} />
                    <div style={{ textAlign: 'center', marginTop: 12, color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.1em' }}>
                      {lightbox + 1} / {images.length}
                    </div>
                  </div>

                  {/* Next */}
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox(i => i! < images.length - 1 ? i! + 1 : 0); }}
                    style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 28, width: 52, height: 52, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >›</button>

                  {/* Close */}
                  <button
                    onClick={() => setLightbox(null)}
                    style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 20, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >✕</button>
                </div>
              )}
            </div>

            {/* Right: meta */}
            <div style={{ background: '#f6f8fb', borderRadius: 8, padding: 24, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a396e', marginBottom: 16 }}>Ficha Técnica</div>
              {[
                { label: 'Categoria',    value: catLabel },
                { label: 'Dona da Obra', value: project.dona_obra },
                { label: 'Arquitetura',  value: project.arquitetura },
                { label: 'Engenharia',   value: project.engenharia },
                { label: 'Localização',  value: project.location },
                { label: 'Fiscalização', value: project.fiscalizacao },
                { label: 'Ano',          value: project.year },
              ].filter(r => r.value).map(r => (
                <div key={r.label} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{r.value}</div>
                </div>
              ))}
              <Link href="/portefolio" style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '10px', background: '#1a396e', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 6 }}>
                ← Ver todos os projetos
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

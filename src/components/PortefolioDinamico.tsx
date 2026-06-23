'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── Data ─── */
const CATEGORIES = [
  { id: 'todos',      label: 'Todos os Projectos',                        short: '00' },
  { id: 'inst',       label: 'Edifícios Institucionais',                  short: '01' },
  { id: 'saude',      label: 'Saúde',                                     short: '02' },
  { id: 'ensino',     label: 'Ensino',                                    short: '03' },
  { id: 'habitacao',  label: 'Habitação e Escritórios',                   short: '04' },
  { id: 'recintos',   label: 'Recintos Desportivos, Culturais e Comerciais', short: '05' },
  { id: 'agro',       label: 'Agricultura e Indústria',                   short: '06' },
  { id: 'turismo',    label: 'Turismo e Lazer',                           short: '07' },
  { id: 'vias',       label: 'Vias de Comunicação',                       short: '08' },
  { id: 'pontes',     label: 'Pontes e Viadutos',                         short: '09' },
  { id: 'infra',      label: 'Infra-estruturas',                          short: '10' },
  { id: 'oilgas',     label: 'Oil & Gas',                                 short: '11' },
  { id: 'energia',    label: 'Energia',                                   short: '12' },
];

type Project = { id: number; title: string; location: string; year: string; area: string; cat: string; img: string };

const PROJECTS: Project[] = [
  { id: 21, title: 'Ministério das Finanças',             location: 'Luanda',        year: '2022', area: '35 000 m²', cat: 'inst',      img: 'photo-1486325212027-8081e485255e' },
  { id: 22, title: 'Palácio de Justiça do Huambo',        location: 'Huambo',        year: '2021', area: '14 000 m²', cat: 'inst',      img: 'photo-1554435493-93422e8220c8' },
  { id: 23, title: 'Quartel-General das FAA',             location: 'Luanda',        year: '2020', area: '28 000 m²', cat: 'inst',      img: 'photo-1464817739973-0128fe77aaa1' },
  { id: 1,  title: 'Centro Hospitalar de Referência',     location: 'Luanda',        year: '2023', area: '48 000 m²', cat: 'saude',     img: 'photo-1487958449943-2429e8be8625' },
  { id: 2,  title: 'Hospital Geral do Huambo',            location: 'Huambo',        year: '2021', area: '32 000 m²', cat: 'saude',     img: 'photo-1519494026892-80bbd2d6fd0d' },
  { id: 3,  title: 'Escola Secundária do Lubango',        location: 'Lubango',       year: '2022', area: '12 000 m²', cat: 'ensino',    img: 'photo-1580582932707-520aed937b7b' },
  { id: 4,  title: 'Universidade Politécnica',            location: 'Luanda',        year: '2020', area: '28 000 m²', cat: 'ensino',    img: 'photo-1562774053-701939374585' },
  { id: 5,  title: 'Condomínio Talatona',                 location: 'Luanda',        year: '2023', area: '18 000 m²', cat: 'habitacao', img: 'photo-1545324418-cc1a3fa10c00' },
  { id: 6,  title: 'Torre Empresarial Norte',             location: 'Luanda',        year: '2022', area: '22 000 m²', cat: 'habitacao', img: 'photo-1486325212027-8081e485255e' },
  { id: 7,  title: 'Estádio Nacional de Luanda',          location: 'Luanda',        year: '2021', area: '65 000 m²', cat: 'recintos',  img: 'photo-1577223625816-7546f13df25d' },
  { id: 8,  title: 'Centro Cultural do Huambo',           location: 'Huambo',        year: '2023', area: '8 500 m²',  cat: 'recintos',  img: 'photo-1518998053901-5348d3961a04' },
  { id: 9,  title: 'Agro-Indústria do Malanje',           location: 'Malanje',       year: '2022', area: '40 000 m²', cat: 'agro',      img: 'photo-1625246333195-78d9c38ad449' },
  { id: 10, title: 'Hotel Baía do Lobito',                location: 'Benguela',      year: '2023', area: '14 000 m²', cat: 'turismo',   img: 'photo-1551882547-ff40c63fe2e2' },
  { id: 11, title: 'Resort de Cabo Ledo',                 location: 'Luanda Sul',    year: '2021', area: '9 000 m²',  cat: 'turismo',   img: 'photo-1571003123894-1f0594d2b5d9' },
  { id: 12, title: 'Corredor Rodoviário Norte',           location: 'Uíge',          year: '2022', area: '320 km',    cat: 'vias',      img: 'photo-1545459720-aac8509eb02c' },
  { id: 13, title: 'Estrada Nacional EN-230',             location: 'Bié',           year: '2020', area: '180 km',    cat: 'vias',      img: 'photo-1506521781263-d8422e82f27a' },
  { id: 14, title: 'Ponte sobre o Rio Cuanza',            location: 'Malanje',       year: '2023', area: '420 m',     cat: 'pontes',    img: 'photo-1558618666-fcd25c85cd64' },
  { id: 15, title: 'Viaduto da Via Rápida',               location: 'Luanda',        year: '2021', area: '280 m',     cat: 'pontes',    img: 'photo-1477959858617-67f85cf4f1df' },
  { id: 16, title: 'Sistema de Abastecimento de Água',    location: 'Benguela',      year: '2022', area: '—',         cat: 'infra',     img: 'photo-1473341304170-971dccb5ac1e' },
  { id: 17, title: 'Rede de Saneamento Urbano',           location: 'Huambo',        year: '2020', area: '—',         cat: 'infra',     img: 'photo-1504711434969-e33886168f5c' },
  { id: 18, title: 'Terminal de Petróleo de Soyo',        location: 'Zaire',         year: '2021', area: '—',         cat: 'oilgas',    img: 'photo-1578662996442-48f60103fc96' },
  { id: 19, title: 'Central Solar de Biópio',             location: 'Benguela',      year: '2023', area: '66 ha',     cat: 'energia',   img: 'photo-1509391366360-2e959784a276' },
  { id: 20, title: 'Linha de Alta Tensão Luanda–Malanje', location: 'Luanda / Malanje', year: '2022', area: '420 km', cat: 'energia',   img: 'photo-1473341304170-971dccb5ac1e' },
];

/* ─── Project card ─── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const cat = CATEGORIES.find(c => c.id === project.cat);

  const onEnter = useCallback(() => {
    setHovered(true);
    import('gsap').then(({ gsap }) => {
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
    });
  }, []);

  const onLeave = useCallback(() => {
    setHovered(false);
    import('gsap').then(({ gsap }) => {
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: 'power2.out' });
    });
  }, []);

  return (
    <div
      className="pf-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: '#fff',
        border: `1.5px solid ${hovered ? '#1a396e' : '#E8EDF5'}`,
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        transition: 'border-color 0.25s, box-shadow 0.3s',
        boxShadow: hovered
          ? '0 20px 56px rgba(26,57,110,0.14)'
          : '0 2px 8px rgba(26,57,110,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0d1d35' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={`https://images.unsplash.com/${project.img}?w=700&q=75&auto=format&fit=crop`}
          alt={project.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(7,16,31,0.55) 100%)' }} />
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em',
          color: '#fff',
        }}>{String(index + 1).padStart(2, '0')}</div>
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          background: '#1a396e', padding: '4px 10px',
          fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
        }}>{cat?.short}</div>
      </div>

      {/* Info */}
      <div style={{ padding: 'clamp(16px,1.8vw,22px)', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(0.85rem,1.1vw,1rem)',
          color: '#0F1A2E', textTransform: 'uppercase',
          letterSpacing: '-0.02em', lineHeight: 1.15,
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
        }}>{project.title}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
            {project.location}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#dde3ed', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', color: '#94a3b8' }}>{project.year}</span>
          {project.area !== '—' && <>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#dde3ed', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', color: '#94a3b8' }}>{project.area}</span>
          </>}
        </div>

        <div style={{ height: 2, width: hovered ? 28 : 0, background: '#1a396e', transition: 'width 0.35s ease' }} />
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function PortefolioDinamico() {
  const sectionRef  = useRef<HTMLElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const bgNumRef    = useRef<HTMLDivElement>(null);
  const [active, setActive]   = useState('todos');
  const isAnimating = useRef(false);
  const dirRef      = useRef<1 | -1>(1);

  const filtered = active === 'todos' ? PROJECTS : PROJECTS.filter(p => p.cat === active);

  /* entrance */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        gsap.fromTo('.pf-nav-item',
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.pf-card',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
        gsap.to(bgNumRef.current, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
  }, []);

  /* category switch */
  const switchCat = useCallback((id: string) => {
    if (id === active || isAnimating.current) return;
    const activeIdx = CATEGORIES.findIndex(c => c.id === active);
    const newIdx    = CATEGORIES.findIndex(c => c.id === id);
    dirRef.current  = newIdx > activeIdx ? 1 : -1;
    isAnimating.current = true;

    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.pf-card') ?? []);
      gsap.timeline({ onComplete: () => { setActive(id); isAnimating.current = false; } })
        .to(cards, {
          opacity: 0, y: dirRef.current * -20,
          stagger: { each: 0.03, from: dirRef.current === 1 ? 'start' : 'end' },
          duration: 0.25, ease: 'power2.in',
        });
    });
  }, [active]);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.pf-card') ?? []);
      gsap.set(cards, { opacity: 0, y: dirRef.current * 20 });
      gsap.to(cards, {
        opacity: 1, y: 0,
        stagger: { each: 0.05, from: dirRef.current === 1 ? 'start' : 'end' },
        duration: 0.5, ease: 'power3.out',
      });
    });
  }, [active]);

  const activeCat = CATEGORIES.find(c => c.id === active)!;

  return (
    <section ref={sectionRef} style={{ background: '#F6F8FB', paddingTop: 'clamp(56px,8vh,96px)', paddingBottom: 'clamp(72px,10vh,120px)', overflow: 'hidden' }}>
      <div className="wrap">

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>23 Anos de Obra</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
              Portefólio<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>de Obras</span>
            </h2>
            <div style={{ display: 'flex', gap: 'clamp(24px,4vw,48px)', paddingBottom: 4 }}>
              {[
                { n: `+${PROJECTS.length}`, l: 'Projectos' },
                { n: '12',                  l: 'Categorias' },
                { n: '18',                  l: 'Províncias' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,2.2rem)', color: '#0F1A2E', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Split layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(180px,22vw,290px) 1fr', gap: 'clamp(28px,5vw,64px)', alignItems: 'start' }} className="pf-layout">

          {/* LEFT: sticky category nav */}
          <div style={{ position: 'sticky', top: 'clamp(80px,10vh,120px)' }}>
            {CATEGORIES.map((cat, i) => {
              const isAct  = cat.id === active;
              const count  = cat.id === 'todos' ? PROJECTS.length : PROJECTS.filter(p => p.cat === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => switchCat(cat.id)}
                  className="pf-nav-item"
                  style={{
                    all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                    padding: i === 0 ? '0 0 clamp(14px,2vw,20px)' : 'clamp(14px,2vw,20px) 0',
                    borderTop: i === 0 ? 'none' : '1px solid #DDE3ED',
                    opacity: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: 'clamp(1.8rem,3.2vw,3.2rem)', lineHeight: 1, letterSpacing: '-0.06em',
                      color: isAct ? '#0F1A2E' : 'rgba(15,26,46,0.09)',
                      transition: 'color 0.4s', userSelect: 'none', flexShrink: 0,
                    }}>{cat.short}</span>
                    <div style={{ paddingTop: 3 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        fontSize: 'clamp(0.7rem,0.85vw,0.9rem)', textTransform: 'uppercase',
                        letterSpacing: '-0.01em', lineHeight: 1.2,
                        color: isAct ? '#0F1A2E' : '#94a3b8',
                        transition: 'color 0.3s', marginBottom: 5,
                      }}>{cat.label}</div>
                      <div style={{ height: 2, background: '#1a396e', width: isAct ? '100%' : '0%', transition: 'width 0.4s ease', marginBottom: 5 }} />
                      <div style={{ fontFamily: 'var(--font-label)', fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: isAct ? '#1a396e' : '#c4cdd8', transition: 'color 0.3s' }}>
                        {count} {count === 1 ? 'projecto' : 'projectos'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid #DDE3ED' }} />
          </div>

          {/* RIGHT: project grid */}
          <div style={{ position: 'relative' }}>
            <div ref={bgNumRef} aria-hidden style={{
              position: 'absolute', top: -20, right: -16, zIndex: 0,
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(100px,15vw,200px)', lineHeight: 1,
              color: 'rgba(26,57,110,0.05)', letterSpacing: '-0.05em',
              pointerEvents: 'none', userSelect: 'none',
            }}>{activeCat.short}</div>

            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(220px,28%,300px), 1fr))',
                gap: 'clamp(10px,1.4vw,18px)',
                position: 'relative', zIndex: 1,
              }}
            >
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0', fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Nenhum projecto nesta categoria
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pf-layout { grid-template-columns: 1fr !important; }
          .pf-layout > div:first-child { position: static !important; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
          .pf-nav-item { border-top: none !important; flex: 1; min-width: 120px; border: 1px solid #DDE3ED !important; border-radius: 4px; padding: 10px 12px !important; }
        }
      `}</style>
    </section>
  );
}

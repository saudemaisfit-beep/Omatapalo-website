'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type Company = { logo?: string; name: string; year: string; area: string; desc: string };
type Sector  = { id: string; label: string; short: string; companies: Company[] };

const SECTORS: Sector[] = [
  {
    id: 'primario', label: 'Sector Primário', short: '01',
    companies: [
      { logo: '/Mumba-logo.png',  name: 'Fazenda Mumba', year: '2015', area: 'Agro-negócio',          desc: 'Produção agrícola e pecuária. Detentora de 99,8% do capital social.' },
      { logo: '/OCTOSEA.png',     name: 'Octosea',       year: '2010', area: 'Pescas',                desc: 'Exploração de recursos haliêuticos nas águas angolanas.' },
      { logo: '/ANIMOPER.png',    name: 'Animoper',      year: '2022', area: 'Mineração – Ouro',      desc: 'Mineração e tratamento de metais preciosos em Angola.' },
      { logo: '/MAOMA.png',       name: 'Maoma',         year: '2019', area: 'Mineração – Diamantes', desc: 'Exploração e comercialização de diamantes.' },
    ],
  },
  {
    id: 'secundario', label: 'Sector Secundário', short: '02',
    companies: [
      { logo: '/logo/LOGO%20OMT%202.png', name: 'Omatapalo',  year: '2003', area: 'Engenharia e Construção',  desc: 'Empresa-mãe do grupo. Líder nacional em engenharia e infraestrutura.' },
      { logo: '/METALOSUL..png',          name: 'Metalosul',  year: '2009', area: 'Metalomecânica',           desc: 'Fabrico e montagem de estruturas metálicas.' },
      { logo: '/GraniSul-Logotipo.jpg',   name: 'Granisul',   year: '2010', area: 'Extracção de Granito',     desc: 'Extracção e transformação de granito para construção.' },
      { logo: '/DRILL-GO.png',            name: 'DrillGo',    year: '2019', area: 'Geotecnia',                desc: 'Obras subterrâneas e geotecnia de precisão.' },
      { logo: '/logo-SIEMA.png',          name: 'Siema',      year: '2012', area: 'Instalações Especiais',    desc: 'Sistemas eléctricos, AVAC e infraestruturas técnicas.' },
      { logo: '/Planasul.png',            name: 'Planasul',   year: '2003', area: 'Engenharia e Construção',  desc: 'Construção civil e obras públicas em Angola.' },
      { logo: '/SelaGrup-Logotipo.png',   name: 'Selagrup',   year: '2020', area: 'Captação de Água',         desc: 'Furos e redes de distribuição de água.' },
      { logo: '/Emadel.png',              name: 'Emadel',     year: '2010', area: 'Carpintaria',              desc: 'Soluções em madeira para construção e decoração.' },
      { logo: '/EMADEL LAR.png',          name: 'Emadellar',  year: '2012', area: 'Mobiliário',               desc: 'Design e produção de mobiliário de interiores.' },
    ],
  },
  {
    id: 'terciario', label: 'Sector Terciário', short: '03',
    companies: [
      { logo: '/Investimo Ge.png',          name: 'Investimo GE',     year: '2025', area: 'Gestão de Edifícios', desc: 'Gestão técnica e operacional de edifícios.' },
      { logo: '/investimo.png',             name: 'Investimo',        year: '2014', area: 'Imobiliário',         desc: 'Investimento e promoção imobiliária em Angola.' },
      { logo: '/Logo-Prime-Properties.png', name: 'Prime Properties', year: '2024', area: 'Imobiliário',         desc: 'Gestão e comercialização de activos imobiliários premium.' },
      { logo: '/ONTOUR.png',                name: 'OnTour',           year: '2022', area: 'Turismo',             desc: 'Serviços de turismo e hospitalidade em Angola.' },
      { logo: '/Venture Vanguard.jpg',      name: 'Venture Vanguard', year: '2024', area: 'Trading',             desc: 'Consultoria e trading de commodities e serviços.' },
      { logo: '/SOTRANS-Logo.jpg',          name: 'Sotrans',          year: '2014', area: 'Transportes',         desc: 'Transporte de passageiros e logística.' },
      { logo: '/Enerline.png',              name: 'Enerline',         year: '2014', area: 'Energia',             desc: 'Soluções energéticas e energias renováveis.' },
    ],
  },
];

/* ── 3D tilt card ──────────────────────────────────────────── */
function TiltCard({ company, index }: { company: Company; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX =  ((y - cy) / cy) * -12;   // ±12°
    const rotY =  ((x - cx) / cx) *  12;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(26,57,110,0.12) 0%, transparent 70%)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { rotateX: 0, rotateY: 0, translateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
    setHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="neg-card"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        background: '#fff',
        border: `1.5px solid ${hovered ? '#1a396e' : '#E8EDF5'}`,
        borderRadius: 6,
        padding: 'clamp(18px,2vw,26px)',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'border-color .25s, box-shadow .3s',
        boxShadow: hovered
          ? '0 24px 56px rgba(26,57,110,0.18), 0 4px 16px rgba(26,57,110,0.10)'
          : '0 2px 8px rgba(26,57,110,0.04)',
        cursor: 'default',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* glow overlay */}
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, borderRadius: 6, pointerEvents: 'none', transition: 'background .1s' }} />

      {/* floating index chip */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em',
        color: 'rgba(26,57,110,0.2)', userSelect: 'none',
        transform: 'translateZ(8px)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Logo */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', transform: 'translateZ(16px)' }}>
        {company.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.logo} alt={company.name}
            style={{ maxHeight: 40, maxWidth: 110, objectFit: 'contain', objectPosition: 'left center',
              transition: 'transform .3s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: '#1a396e' }}>{company.name}</span>
        )}
      </div>

      {/* Name */}
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.8rem,1vw,0.95rem)', color: '#0F1A2E', letterSpacing: '-0.01em', lineHeight: 1.2, transform: 'translateZ(12px)' }}>
        {company.name}
      </div>

      {/* Desc — slides in on hover */}
      <div style={{
        overflow: 'hidden',
        maxHeight: hovered ? '80px' : '0px',
        opacity: hovered ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
        transform: 'translateZ(8px)',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{company.desc}</p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(8px)' }}>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: hovered ? '#1a396e' : '#94a3b8', transition: 'color .25s' }}>
          {company.area}
        </span>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.1em', color: '#c4cdd8' }}>Est. {company.year}</span>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function Negocios() {
  const sectionRef  = useRef<HTMLElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const bgTextRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isAnimating = useRef(false);
  const dirRef      = useRef<1 | -1>(1);

  /* entrance */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        gsap.fromTo('.neg-left-item',
          { opacity: 0, x: -36 },
          { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
        gsap.fromTo('.neg-card',
          { opacity: 0, y: 48, rotateX: -20 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
        /* bg number parallax */
        gsap.to(bgTextRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
  }, []);

  /* sector switch with 3D flip */
  const switchSector = useCallback((idx: number) => {
    if (idx === active || isAnimating.current) return;
    dirRef.current = idx > active ? 1 : -1;
    isAnimating.current = true;

    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.neg-card') ?? []);
      const bgEl  = bgTextRef.current;

      gsap.timeline({ onComplete: () => { setActive(idx); isAnimating.current = false; } })
        .to(cards, {
          opacity: 0,
          rotateY: dirRef.current * -60,
          z: -120,
          stagger: { each: 0.04, from: dirRef.current === 1 ? 'start' : 'end' },
          duration: 0.35,
          ease: 'power2.in',
        })
        .to(bgEl, { opacity: 0, scale: 0.85, duration: 0.25 }, '<');
    });
  }, [active]);

  /* re-animate cards when sector changes */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.neg-card') ?? []);
      const bgEl  = bgTextRef.current;

      /* reset instantly, then animate in from opposite side */
      gsap.set(cards, { rotateY: dirRef.current * 60, opacity: 0, z: -80 });
      gsap.to(cards, {
        rotateY: 0, opacity: 1, z: 0,
        stagger: { each: 0.06, from: dirRef.current === 1 ? 'start' : 'end' },
        duration: 0.55,
        ease: 'power3.out',
      });
      gsap.fromTo(bgEl,
        { opacity: 0, scale: 1.15 },
        { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }
      );
    });
  }, [active]);

  const sector = SECTORS[active];

  return (
    <section ref={sectionRef} id="negocios" style={{ background: '#F6F8FB', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)', overflow: 'hidden' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>O Grupo e os Negócios</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.95, textTransform: 'uppercase' }}>
              Empresas<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.25)' }}>do Grupo</span>
            </h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#64748b', lineHeight: 1.8, maxWidth: 340 }}>
              Um ecossistema empresarial diversificado que actua nos principais sectores da economia angolana.
            </p>
          </div>
        </div>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(200px,24vw,320px) 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }} className="neg-layout">

          {/* LEFT nav */}
          <div style={{ position: 'sticky', top: 'clamp(80px,10vh,120px)' }}>
            {SECTORS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => switchSector(i)}
                  className="neg-left-item"
                  style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: 'clamp(18px,2.2vw,26px) 0', borderTop: '1px solid #DDE3ED', opacity: 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: 'clamp(2.8rem,4.5vw,5rem)', lineHeight: 1, letterSpacing: '-0.06em',
                      color: isActive ? '#0F1A2E' : 'rgba(15,26,46,0.1)',
                      transition: 'color 0.4s ease',
                      userSelect: 'none',
                    }}>{s.short}</span>
                    <div style={{ paddingTop: 6 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        fontSize: 'clamp(0.8rem,1vw,1rem)', textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: isActive ? '#0F1A2E' : '#94a3b8',
                        transition: 'color 0.3s',
                        marginBottom: 6,
                      }}>{s.label}</div>
                      <div style={{ height: 2, background: '#1a396e', width: isActive ? '100%' : '0%', transition: 'width 0.45s ease', marginBottom: 8 }} />
                      <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? '#1a396e' : '#c4cdd8', transition: 'color 0.3s' }}>
                        {s.companies.length} empresas
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid #DDE3ED' }} />
          </div>

          {/* RIGHT grid — perspective container */}
          <div style={{ position: 'relative', perspective: '1200px' }}>
            {/* parallax bg number */}
            <div ref={bgTextRef} aria-hidden style={{
              position: 'absolute', top: -40, right: -10, zIndex: 0,
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(120px,18vw,260px)', lineHeight: 1,
              color: 'rgba(26,57,110,0.05)', letterSpacing: '-0.05em',
              pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            }}>
              {sector.short}
            </div>

            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px,20%,220px), 1fr))',
                gap: 'clamp(10px,1.4vw,18px)',
                position: 'relative', zIndex: 1,
                transformStyle: 'preserve-3d',
              }}
            >
              {sector.companies.map((c, i) => (
                <TiltCard key={c.name} company={c} index={i} />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .neg-layout { grid-template-columns: 1fr !important; }
          .neg-layout > div:first-child { position: static !important; display: flex; border-top: 1px solid #DDE3ED; overflow-x: auto; }
          .neg-left-item { border-top: none !important; border-right: 1px solid #DDE3ED; flex: 1; min-width: 100px; }
        }
      `}</style>
    </section>
  );
}

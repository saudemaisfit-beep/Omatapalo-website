'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { SECTORS, type Company, type Sector } from '@/data/empresas';

/* ── Company card ──────────────────────────────────────────── */
function TiltCard({ company, index }: { company: Company; index: number }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);

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

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: `1.5px solid ${hovered ? '#1a396e' : '#E8EDF5'}`,
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color .25s, box-shadow .3s',
    boxShadow: hovered ? '0 20px 56px rgba(26,57,110,0.14)' : '0 2px 8px rgba(26,57,110,0.04)',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <Link
      href={`/empresas/${company.slug}`}
      className="neg-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={cardStyle}
    >
      {/* Image area — white bg with coloured logo */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#F6F8FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={company.logo ?? ''}
          alt={company.name}
          style={{ maxHeight: '60%', maxWidth: '65%', objectFit: 'contain' }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', color: 'rgba(26,57,110,0.25)' }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 'clamp(14px,1.6vw,20px)', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(0.8rem,1vw,0.95rem)', color: '#0F1A2E',
          textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.2,
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
        }}>{company.name}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
            {company.area}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a396e' }}>
            Ver mais →
          </span>
        </div>

        <div style={{ height: 2, width: hovered ? 28 : 0, background: '#1a396e', transition: 'width 0.35s ease' }} />
      </div>
    </Link>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function Negocios() {
  const sectionRef  = useRef<HTMLElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const bgTextRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [sectors, setSectors] = useState<Sector[]>(SECTORS);
  const [title1, setTitle1] = useState('Empresas');
  const [title2, setTitle2] = useState('do Grupo');
  const [intro, setIntro] = useState('Um ecossistema empresarial diversificado que actua nos principais sectores da economia angolana.');
  const isAnimating = useRef(false);

  useEffect(() => {
    const db = createClient();
    db.from('site_content').select('field,value').eq('page', 'negocios').then(({ data }) => {
      if (!data) return;
      for (const row of data) {
        if (row.field === 'sectors') { try { setSectors(JSON.parse(row.value)); } catch {} }
        if (row.field === 'intro') setIntro(row.value);
        if (row.field === 'title1') setTitle1(row.value);
        if (row.field === 'title2') setTitle2(row.value);
      }
    });
  }, []);
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

  const sector = sectors[active] ?? sectors[0];

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
              {title1}<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.25)' }}>{title2}</span>
            </h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#64748b', lineHeight: 1.8, maxWidth: 340 }}>
              {intro}
            </p>
          </div>
        </div>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(200px,24vw,320px) 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }} className="neg-layout">

          {/* LEFT nav */}
          <div style={{ position: 'sticky', top: 'clamp(80px,10vh,120px)' }}>
            {sectors.map((s, i) => {
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
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(16px,2vw,28px)',
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

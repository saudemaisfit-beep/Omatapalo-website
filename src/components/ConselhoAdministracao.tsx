'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

/* ─── Data ─── */
type Member = { name: string; role: string; initials: string; featured?: boolean };

const DEFAULT_TIERS: { id: string; short: string; label: string; members: Member[] }[] = [
  {
    id: 'conselho', short: '01', label: 'Conselho de Administração',
    members: [
      { name: 'Pedro Vieira Santos', role: 'Presidente do Conselho de Administração', initials: 'PVS', featured: true },
      { name: 'Marques Antunes',     role: 'Administrador',               initials: 'MA' },
      { name: 'Pedro Vieira Santos', role: 'Administrador',               initials: 'PV' },
      { name: 'Carlos Freitas',      role: 'Administrador Não Executivo', initials: 'CF' },
    ],
  },
  {
    id: 'executiva', short: '02', label: 'Comissão Executiva',
    members: [
      { name: 'Pedro Vieira Santos', role: 'Chief Executive Officer',    initials: 'PVS', featured: true },
      { name: 'Marques Antunes',     role: 'Chief Operating Officer',    initials: 'MA' },
      { name: 'Pedro Vieira Santos', role: 'Chief Financial Officer',    initials: 'PV' },
      { name: 'Almeida e Silva',     role: 'Director Executivo de Produção de Construção Civil',       initials: 'AS' },
      { name: 'Pedro Martins',       role: 'Director Executivo Financeiro',             initials: 'PM' },
      { name: 'Cláudio Barbosa',     role: 'Director Executivo Comercial',              initials: 'CB' },
      { name: 'José Malafaia',       role: 'Director Executivo de Produção de Vias e Infraestruturas', initials: 'JM' },
      { name: 'Arménio Lopes',       role: 'Director Executivo de Produção de Instalações Especiais',  initials: 'AL' },
      { name: 'Joana Guedes',        role: 'Directora Executiva Jurídica',          initials: 'JG' },
      { name: 'Manuel Mamboza',      role: 'Director Executivo de Central de Compras',     initials: 'MM' },
      { name: 'Luís Marques',        role: 'Assessor da Administração',         initials: 'LM' },
    ],
  },
];

/* ─── Card ─── */
function TiltCard({ member, index }: { member: Member; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  8;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { rotateX: 0, rotateY: 0, translateZ: 0, duration: 0.55, ease: 'elastic.out(1,0.5)' });
    });
    setHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="ca-card"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        background: member.featured ? '#1a396e' : '#fff',
        border: `1.5px solid ${member.featured ? '#1a396e' : hovered ? '#1a396e' : '#E8EDF5'}`,
        borderRadius: 6, padding: 'clamp(16px,1.8vw,22px)',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'border-color .25s, box-shadow .3s',
        boxShadow: hovered
          ? '0 20px 48px rgba(26,57,110,0.15)'
          : '0 2px 8px rgba(26,57,110,0.04)',
        cursor: 'default', willChange: 'transform', transformStyle: 'preserve-3d',
        opacity: 0, position: 'relative', overflow: 'hidden',
      }}
    >
      {/* ghost */}
      <div style={{
        position: 'absolute', bottom: -8, right: -4,
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 56,
        color: member.featured ? 'rgba(255,255,255,0.06)' : 'rgba(26,57,110,0.04)',
        letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>{member.initials}</div>

      {/* index chip */}
      <div style={{
        position: 'absolute', top: 12, right: 14,
        fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em',
        color: member.featured ? 'rgba(255,255,255,0.2)' : 'rgba(26,57,110,0.15)',
      }}>{String(index + 1).padStart(2, '0')}</div>

      {/* avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: member.featured ? 'rgba(255,255,255,0.15)' : 'rgba(26,57,110,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'translateZ(12px)',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 10,
          color: member.featured ? '#fff' : '#1a396e',
        }}>{member.initials}</span>
      </div>

      <div style={{ transform: 'translateZ(8px)', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(0.78rem,1vw,0.92rem)', color: member.featured ? '#fff' : '#0F1A2E',
          textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 5,
        }}>{member.name}</div>
        <div style={{
          fontFamily: 'var(--font-label)', fontSize: 8.5,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: member.featured ? 'rgba(255,255,255,0.45)' : '#64748b', lineHeight: 1.55,
        }}>{member.role}</div>
      </div>

      <div style={{
        marginTop: 'auto', paddingTop: 10, borderTop: `1px solid ${member.featured ? 'rgba(255,255,255,0.12)' : '#F1F5F9'}`,
        transform: 'translateZ(6px)',
      }}>
        <div style={{ height: 1.5, width: hovered || member.featured ? 24 : 0, background: member.featured ? 'rgba(255,255,255,0.3)' : '#1a396e', transition: 'width 0.35s ease' }} />
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function ConselhoAdministracao() {
  const sectionRef  = useRef<HTMLElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const [active, setActive]   = useState(0);
  const [TIERS, setTIERS]     = useState(DEFAULT_TIERS);
  const isAnimating = useRef(false);
  const dirRef      = useRef<1 | -1>(1);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'conselho_tiers').single().then(({ data }) => {
      if (data?.value) { try { setTIERS(JSON.parse(data.value)); } catch {} }
    });
  }, []);

  /* entrance */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        gsap.fromTo('.ca-left-item',
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
        gsap.fromTo('.ca-card',
          { opacity: 0, y: 36, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
        gsap.to(bgRef.current, {
          y: -50, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
  }, []);

  /* tier switch */
  const switchTier = useCallback((idx: number) => {
    if (idx === active || isAnimating.current) return;
    dirRef.current = idx > active ? 1 : -1;
    isAnimating.current = true;
    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.ca-card') ?? []);
      gsap.timeline({ onComplete: () => { setActive(idx); isAnimating.current = false; } })
        .to(cards, {
          opacity: 0, rotateY: dirRef.current * -50, z: -80,
          stagger: { each: 0.04, from: dirRef.current === 1 ? 'start' : 'end' },
          duration: 0.3, ease: 'power2.in',
        })
        .to(bgRef.current, { opacity: 0, scale: 0.88, duration: 0.22 }, '<');
    });
  }, [active]);

  /* re-animate on tier change */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.ca-card') ?? []);
      gsap.set(cards, { rotateY: dirRef.current * 45, opacity: 0, z: -60 });
      gsap.to(cards, {
        rotateY: 0, opacity: 1, z: 0,
        stagger: { each: 0.055, from: dirRef.current === 1 ? 'start' : 'end' },
        duration: 0.5, ease: 'power3.out',
      });
      gsap.fromTo(bgRef.current,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    });
  }, [active]);

  const tier = TIERS[active];

  return (
    <section ref={sectionRef} id="conselho" style={{
      background: '#F6F8FB',
      paddingTop: 'clamp(72px,10vh,120px)',
      paddingBottom: 'clamp(72px,10vh,120px)',
      overflow: 'hidden',
    }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>Governança Corporativa</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
              Conselho de<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Administração</span>
            </h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#64748b', lineHeight: 1.8, maxWidth: 320 }}>
              Estrutura de governança que orienta e supervisiona a estratégia do Grupo Omatapalo.
            </p>
          </div>
        </div>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(180px,22vw,300px) 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }} className="ca-layout">

          {/* LEFT nav */}
          <div style={{ position: 'sticky', top: 'clamp(80px,10vh,120px)' }}>
            {TIERS.map((t, i) => {
              const isAct = i === active;
              return (
                <button
                  key={t.id}
                  onClick={() => switchTier(i)}
                  className="ca-left-item"
                  style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: 'clamp(18px,2.2vw,26px) 0', borderTop: '1px solid #DDE3ED', opacity: 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: 'clamp(2.4rem,4vw,4.5rem)', lineHeight: 1, letterSpacing: '-0.06em',
                      color: isAct ? '#0F1A2E' : 'rgba(15,26,46,0.1)',
                      transition: 'color 0.4s ease', userSelect: 'none',
                    }}>{t.short}</span>
                    <div style={{ paddingTop: 5 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        fontSize: 'clamp(0.75rem,0.9vw,0.95rem)', textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: isAct ? '#0F1A2E' : '#94a3b8',
                        transition: 'color 0.3s', marginBottom: 6,
                      }}>{t.label}</div>
                      <div style={{ height: 2, background: '#1a396e', width: isAct ? '100%' : '0%', transition: 'width 0.45s ease', marginBottom: 6 }} />
                      <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: isAct ? '#1a396e' : '#c4cdd8', transition: 'color 0.3s' }}>
                        {t.members.length} membros
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid #DDE3ED' }} />
          </div>

          {/* RIGHT grid */}
          <div style={{ position: 'relative', perspective: '1200px' }}>
            {/* parallax bg number */}
            <div ref={bgRef} aria-hidden style={{
              position: 'absolute', top: -30, right: -10, zIndex: 0,
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(100px,16vw,220px)', lineHeight: 1,
              color: 'rgba(26,57,110,0.05)', letterSpacing: '-0.05em',
              pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            }}>{tier.short}</div>

            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px,18%,200px), 1fr))',
                gap: 'clamp(10px,1.2vw,16px)',
                position: 'relative', zIndex: 1,
                transformStyle: 'preserve-3d',
              }}
            >
              {tier.members.map((m, i) => (
                <TiltCard key={m.initials + m.role} member={m} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ca-layout { grid-template-columns: 1fr !important; }
          .ca-layout > div:first-child { position: static !important; display: flex; border-top: 1px solid #DDE3ED; overflow-x: auto; }
          .ca-left-item { border-top: none !important; border-right: 1px solid #DDE3ED; flex: 1; min-width: 120px; }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useContent } from '@/lib/useContent';

const HOME_DEFAULTS = {
  eyebrow:       'Grupo Omatapalo · Desde 2003',
  title_line1:   'FAZEMOS',
  title_line2:   'ACONTECER',
  intro:         'Engenharia, Construção e Infra-estruturas. A transformar Angola há mais de duas décadas.',
  cta_primary:      'Conhecer o Grupo',
  cta_primary_href: '#grupo',
  cta_secondary: 'Falar Connosco',
  cta_secondary_href: '#contactos',
  stat1_value:   '23',    stat1_label: 'Anos de Experiência',
  stat2_value:   '+15.000', stat2_label: 'Colaboradores',
  stat3_value:   '+1.5M m²', stat3_label: 'Área Construída',
  stat4_value:   '+5.000 km', stat4_label: 'de Estrada',
  stat5_value:   '',          stat5_label: '',
  stat6_value:   '',          stat6_label: '',
  stat7_value:   '+14',       stat7_label: 'Hospitais',
};

const STATS = [
  { value: 23,   prefix: '',  suffix: '',     label: 'Anos de Experiência' },
  { value: 15000, prefix: '+', suffix: '',    label: 'Colaboradores', thousands: true },
  { value: 1.5,  prefix: '+', suffix: 'M m²', label: 'Área Construída', decimals: 1 },
  { value: 5000, prefix: '+', suffix: ' km',  label: 'de Estrada', thousands: true },
];

const TICKER = ['Engenharia', 'Construção', 'Infra-estruturas', 'Mineração', 'Energia', 'Gestão Hoteleira', 'Agro-negócio', 'Imobiliário', 'Transporte', 'Pescas', 'Indústria'];

const SQUARES = [
  { size: 180, x: '72%',  y: '12%', opacity: 0.045, speed: -18, rotate: 22  },
  { size: 60,  x: '88%',  y: '55%', opacity: 0.07,  speed: -28, rotate: 8   },
  { size: 120, x: '60%',  y: '78%', opacity: 0.035, speed: -12, rotate: -15 },
  { size: 32,  x: '15%',  y: '20%', opacity: 0.06,  speed: -22, rotate: 45  },
  { size: 90,  x: '5%',   y: '70%', opacity: 0.03,  speed: -16, rotate: -8  },
  { size: 220, x: '80%',  y: '40%', opacity: 0.02,  speed: -10, rotate: 30  },
];

export default function Hero() {
  const c             = useContent('home', HOME_DEFAULTS);
  const heroRef       = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const leadRef       = useRef<HTMLParagraphElement>(null);
  const actionsRef    = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const squaresRef    = useRef<HTMLDivElement[]>([]);
  const tickerRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        /* ── entrance timeline ── */
        const tl = gsap.timeline({ delay: 0.15 });

        /* FAZEMOS — slide up */
        tl.fromTo('.hero-fazemos',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )
        /* ACONTECER — letters stagger */
        .fromTo('.hero-anim-letter',
          { yPercent: 115, opacity: 0, rotateX: -45, skewX: 8 },
          { yPercent: 0, opacity: 1, rotateX: 0, skewX: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07 },
          '-=0.7'
        )
        /* flash to solid then back to outline */
        .to('.hero-anim-letter',
          { color: '#fff', WebkitTextStroke: '0px', duration: 0.3, ease: 'power2.inOut', stagger: 0.08 },
          '+=0.15'
        )
        .to('.hero-anim-letter',
          { color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.22)', duration: 0.3, ease: 'power2.inOut', stagger: 0.08 },
          '+=0.2'
        )
        /* lead + actions + stats */
        .fromTo(leadRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(actionsRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(statsRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.45'
        )
        /* ticker fades in */
        .fromTo(tickerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );

        /* ── floating squares parallax ── */
        squaresRef.current.forEach((el, i) => {
          if (!el) return;
          const speed = SQUARES[i].speed;
          gsap.to(el, {
            y: `${speed}%`,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

        /* ── bg parallax ── */
        gsap.to(bgRef.current, {
          y: '28%',
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });

        /* ── diagonal transition on scroll ── */
        if (transitionRef.current) {
          gsap.fromTo(transitionRef.current,
            { clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)' },
            {
              clipPath: 'polygon(0% 100%, 100% 20%, 100% 100%)',
              ease: 'none',
              scrollTrigger: { trigger: heroRef.current, start: 'center top', end: 'bottom top', scrub: true },
            }
          );
        }

        /* ── stat counters ── */
        statsRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const target = parseFloat(el.getAttribute('data-count') || '0');
          const isFloat = el.getAttribute('data-float') === '1';
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target, duration: 2.2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate() {
              const isK = el.getAttribute('data-thousands') === '1';
              const raw = isFloat ? proxy.val.toFixed(1) : Math.round(proxy.val).toString();
              el.textContent = isK ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : raw;
            },
          });
        });

        cleanup = () => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
      });
    });

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{ minHeight: '100vh', background: '#1a396e', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      {/* ── Parallax BG ── */}
      <div ref={bgRef} style={{ position: 'absolute', inset: '-8% 0 0 0', willChange: 'transform' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}>
          <source src="/hero-construction.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,57,110,0.5) 0%, rgba(26,57,110,0.2) 35%, rgba(26,57,110,0.65) 70%, rgba(26,57,110,0.98) 100%)' }} />
      </div>



      {/* ── Top spacer (nav clearance) ── */}
      <div style={{ height: 'clamp(120px,16vh,180px)', zIndex: 3 }} />

      {/* ── Main title block — LEFT aligned ── */}
      <div ref={titleRef} style={{ position: 'relative', zIndex: 3, paddingInline: 'var(--gutter)', overflow: 'hidden' }}>
        {/* eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.4)" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
            {c.eyebrow}
          </span>
        </div>

        {/* FAZEMOS */}
        <div style={{ overflow: 'hidden' }}>
          <div className="hero-fazemos" style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(72px,12.5vw,190px)', lineHeight: 0.88,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: '#fff', opacity: 0,
          }}>{c.title_line1}</div>
        </div>

        {/* ACONTECER — outline, letter by letter */}
        <div style={{ overflow: 'hidden', perspective: '600px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(72px,12.5vw,190px)', lineHeight: 0.88,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
            marginTop: '0.06em',
          }}>
            {c.title_line2.split('').map((l, i) => (
              <span key={i} className="hero-anim-letter" style={{ display: 'inline-block', opacity: 0, willChange: 'transform' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom block: lead + CTAs + stats ── */}
      <div style={{ position: 'relative', zIndex: 3, paddingInline: 'var(--gutter)', paddingBottom: 'clamp(0px,2vh,24px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'clamp(24px,4vw,64px)', alignItems: 'flex-end', flexWrap: 'wrap' }} className="hero-bottom">

          {/* lead + buttons */}
          <div>
            <p ref={leadRef} style={{
              maxWidth: '100%', fontSize: 'clamp(12px,0.95vw,15px)', lineHeight: 1.7,
              color: '#fff', marginBottom: 'clamp(24px,3vh,36px)', opacity: 0,
              fontFamily: 'var(--font-sans)',
            }}>
              {c.intro}
            </p>
            <div ref={actionsRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
              <a href={c.cta_primary_href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#1a396e', color: '#fff', textDecoration: 'none',
                fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '0 28px', height: 52, borderRadius: 2,
                transition: 'background .25s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0f2550')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1a396e')}
              >
                {c.cta_primary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href={c.cta_secondary_href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'transparent', color: '#fff', textDecoration: 'none',
                fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '0 28px', height: 52, borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'border-color .25s, background .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {c.cta_secondary}
              </a>
            </div>
          </div>

          {/* stats */}
          {(() => {
            const dynStats = [
              { value: c.stat1_value, label: c.stat1_label },
              { value: c.stat2_value, label: c.stat2_label },
              { value: c.stat3_value, label: c.stat3_label },
              { value: c.stat4_value, label: c.stat4_label },
              { value: c.stat5_value, label: c.stat5_label },
              { value: c.stat6_value, label: c.stat6_label },
              { value: c.stat7_value, label: c.stat7_label },
            ].filter(s => s.value && s.label);
            const cols = dynStats.length;
            return (
              <div ref={statsRef} style={{ opacity: 0, display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 'clamp(16px,3vw,40px)', paddingBottom: 4 }} className="hero-stats">
                {dynStats.map(s => (
                  <div key={s.label} style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 14, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem,2.8vw,2.4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                      {s.value.includes('m²') || s.value.includes('m2')
                        ? <span>{s.value.replace('m²', '').replace('m2', '')}m<sup style={{ fontSize: '0.5em', verticalAlign: 'super' }}>2</sup></span>
                        : <span>{s.value}</span>
                      }
                    </div>
                    <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', color: '#fff', marginTop: 7, textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Ticker strip ── */}
      <div ref={tickerRef} style={{ position: 'relative', zIndex: 3, opacity: 0, borderTop: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: 'clamp(24px,4vh,48px)' }}>
        <div style={{ display: 'flex', animation: 'hero-ticker 28s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(0.65rem,0.9vw,0.85rem)', textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#fff',
              padding: 'clamp(12px,1.8vh,18px) clamp(24px,3vw,48px)',
              display: 'inline-flex', alignItems: 'center', gap: 'clamp(24px,3vw,48px)',
            }}>
              {t}
              <svg width="4" height="4" viewBox="0 0 4 4" fill="none"><rect width="4" height="4" fill="#fff" /></svg>
            </span>
          ))}
        </div>
      </div>

      {/* ── Diagonal transition ── */}
      <div ref={transitionRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 'clamp(100px,14vw,200px)', background: '#ffffff',
        clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* ── Scroll cue ── */}
      <div style={{
        position: 'absolute', right: 'var(--gutter)', bottom: 'clamp(80px,10vh,120px)',
        zIndex: 3, writingMode: 'vertical-rl',
        fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.24em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        Scroll
        <span style={{ width: 1, height: 54, background: 'linear-gradient(rgba(255,255,255,0.3), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes hero-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:.3; transform:scaleY(.7); transform-origin:top; }
          50%      { opacity:1; transform:scaleY(1); }
        }
        @media (max-width: 900px) {
          .hero-bottom { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

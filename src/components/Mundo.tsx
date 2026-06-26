'use client';

import { useEffect, useRef, useState } from 'react';

const COUNTRIES = [
  { name: 'Angola',      code: 'AO', continent: 'África',   sub: 'Sede · Lubango — todas as províncias', x: 53,   y: 63,  anchor: true, labelLeft: true },
  { name: 'Moçambique',  code: 'MZ', continent: 'África',   sub: 'Infraestrutura e construção civil',    x: 59,   y: 66  },
  { name: 'Namíbia',     code: 'NA', continent: 'África',   sub: 'Mineração e obras públicas',           x: 53,   y: 69  },
  { name: 'RDC',         code: 'CD', continent: 'África',   sub: 'República Democrática do Congo',       x: 54,   y: 56  },
  { name: 'Portugal',    code: 'PT', continent: 'Europa',   sub: 'Representação e parcerias europeias',  x: 45,   y: 31,  labelLeft: true },
  { name: 'Espanha',     code: 'ES', continent: 'Europa',   sub: 'Parcerias comerciais e técnicas',      x: 47,   y: 31  },
  { name: 'Reino Unido', code: 'GB', continent: 'Europa',   sub: 'Parcerias estratégicas e financeiras', x: 47,   y: 19  },
  { name: 'EUA',         code: 'US', continent: 'América do Norte', sub: 'Parcerias estratégicas e de investimento', x: 20, y: 31 },
];

export default function Mundo() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hoveredPin, setHoveredPin]     = useState<number | null>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!wrapperRef.current) return;

        /* header elements */
        gsap.fromTo('.mundo-hdr-el',
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );

        /* reveal pins one-by-one as user scrolls through the wrapper */
        const total = COUNTRIES.length;
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: false,
          onUpdate(self) {
            const count = Math.ceil(self.progress * (total + 1));
            setVisibleCount(Math.min(count, total));
          },
        });

        /* map fade in */
        gsap.fromTo('.mundo-map-bg',
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );
      });
    });
  }, []);

  return (
    /* tall wrapper gives scroll room for pin reveals */
    <div ref={wrapperRef} id="mundo" style={{ height: `${100 + COUNTRIES.length * 18}vh`, position: 'relative' }}>
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#1a396e' }}>

        {/* grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)',
          backgroundSize: '60px 60px', zIndex: 0,
        }} />

        {/* ── World map SVG background ── */}
        <div className="mundo-map-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, filter: 'invert(1)' }}
          />
          {/* vignette overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, #1a396e 85%)' }} />
        </div>

        {/* ── Pins on map ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {COUNTRIES.map((c, i) => {
            const visible = i < visibleCount;
            const isHov   = hoveredPin === i;
            return (
              <div
                key={c.code}
                onMouseEnter={() => setHoveredPin(i)}
                onMouseLeave={() => setHoveredPin(null)}
                style={{
                  position: 'absolute',
                  left: `${c.x}%`,
                  top:  `${c.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isHov ? 10 : 3,
                }}
              >
                {/* pulse ring */}
                {visible && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 36, height: 36, borderRadius: '50%',
                    border: `1px solid ${c.anchor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)'}`,
                    animation: 'pin-pulse 2.2s ease-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* dot */}
                <div style={{
                  width: c.anchor ? 10 : 7,
                  height: c.anchor ? 10 : 7,
                  borderRadius: '50%',
                  background: c.anchor ? '#fff' : 'rgba(255,255,255,0.65)',
                  boxShadow: c.anchor ? '0 0 16px rgba(255,255,255,0.6)' : '0 0 8px rgba(255,255,255,0.3)',
                  transition: 'transform .3s ease, box-shadow .3s',
                  transform: visible ? (isHov ? 'scale(1.8)' : 'scale(1)') : 'scale(0)',
                  cursor: 'default',
                }} />

                {/* country name label — appears with pin */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  ...(c as any).labelLeft
                    ? { right: 'calc(100% + 10px)', left: 'auto', textAlign: 'right' }
                    : { left: 'calc(100% + 10px)' },
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  opacity: visible ? 1 : 0,
                  transition: 'opacity .4s ease, transform .4s ease',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'clamp(0.6rem,0.85vw,0.85rem)',
                    textTransform: 'uppercase', letterSpacing: '-0.01em',
                    color: isHov ? '#fff' : 'rgba(255,255,255,0.75)',
                    transition: 'color .25s',
                  }}>{c.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-label)', fontSize: 8,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 2,
                  }}>{c.continent}</div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── UI overlay ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(32px,5vw,64px)' }}>

          {/* top: title + eyebrow */}
          <div style={{ pointerEvents: 'auto' }}>
            <div className="mundo-hdr-el" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.3)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Omatapalo no Mundo</span>
            </div>
            <h2 className="mundo-hdr-el" style={{ opacity: 0, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
              Onde<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>Estamos</span>
            </h2>
          </div>

          {/* bottom: stats + scroll hint */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', pointerEvents: 'auto' }}>
            {/* stats */}
            <div className="mundo-hdr-el" style={{ opacity: 0, display: 'flex', gap: 'clamp(24px,4vw,56px)' }}>
              {[['3', 'Continentes'], ['8', 'Países'], ['23', 'Anos']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,3.5vw,3.5rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* scroll progress indicator */}
            <div className="mundo-hdr-el" style={{ opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>
                {visibleCount}/{COUNTRIES.length} países
              </div>
              <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.3)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#fff', width: `${(visibleCount / COUNTRIES.length) * 100}%`, transition: 'width .3s ease' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#fff" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>Deslize para explorar</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pin-pulse {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

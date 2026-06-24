'use client';

import { useEffect, useRef } from 'react';

type PageHeroProps = {
  title: string;
  imgSrc: string;
  eyebrow?: string;
  position?: string;
  outlineWord?: string;
  imgOpacity?: number;
};

const SQUARES = [
  { size: 64,  x: '72%', y: '18%', opacity: 0.07, rotate: 22,  speed: 0.35 },
  { size: 140, x: '85%', y: '52%', opacity: 0.04, rotate: -14, speed: 0.2  },
  { size: 36,  x: '60%', y: '72%', opacity: 0.09, rotate: 45,  speed: 0.5  },
];

export default function PageHero({ title, imgSrc, eyebrow, position = 'center', outlineWord, imgOpacity = 0.18 }: PageHeroProps) {
  const squaresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        squaresRef.current.forEach((el, i) => {
          if (!el) return;
          const s = SQUARES[i];
          gsap.to(el, {
            y: `-${80 * s.speed}px`,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });

        /* title entrance */
        gsap.fromTo('.ph-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 });
        gsap.fromTo('.ph-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.05 });
      });
    });
  }, []);

  const words = title.trim().split(/\s+/);
  const lastWord = outlineWord ?? words[words.length - 1];
  const firstWords = words.slice(0, -1).join(' ');

  return (
    <section style={{ position: 'relative', height: 'clamp(420px,55vw,640px)', overflow: 'hidden', background: '#07101f' }}>

      {/* Photo layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: position,
          opacity: imgOpacity,
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #07101f 0%, rgba(7,16,31,0.6) 50%, rgba(7,16,31,0.3) 100%)',
      }} />

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Floating squares */}
      {SQUARES.map((s, i) => (
        <div
          key={i}
          ref={el => { if (el) squaresRef.current[i] = el; }}
          style={{
            position: 'absolute',
            left: s.x, top: s.y,
            width: s.size, height: s.size,
            border: `1px solid rgba(255,255,255,${s.opacity * 2})`,
            background: `rgba(26,57,110,${s.opacity})`,
            transform: `rotate(${s.rotate}deg)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(40px,6vw,80px) clamp(24px,6vw,96px)',
      }}>
        <div className="ph-eyebrow" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
            {eyebrow ?? 'Grupo Omatapalo'}
          </span>
        </div>

        <h1 className="ph-title" style={{
          opacity: 0,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '-0.035em',
          fontSize: 'clamp(2.4rem,5.5vw,6rem)', lineHeight: 0.92,
          color: '#fff', margin: 0,
        }}>
          {firstWords && <>{firstWords}<br /></>}
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>
            {lastWord}
          </span>
        </h1>
      </div>
    </section>
  );
}

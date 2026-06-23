'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const GALLERY = [
  '/Formação omatapalo.jpg',
  '/Academia-barra.jpg',
  '/academia-barra1.jpg',
  '/Academia-barra.jpg',
];

const STATS = [
  { value: 45590, label: 'Horas de Formação', prefix: '+ ', suffix: '' },
  { value: 2021, label: 'Ano de Inauguração', prefix: '', suffix: '' },
  { value: 3200, label: 'Colaboradores Formados', prefix: '+ ', suffix: '' },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ value, label, prefix, suffix, active }: { value: number; label: string; prefix: string; suffix: string; active: boolean }) {
  const n = useCountUp(value, 1600, active);
  return (
    <div style={{ textAlign: 'center', padding: '32px 24px', borderLeft: '1px solid rgba(255,255,255,0.08)', flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px,4vw,60px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {prefix}{n.toLocaleString('pt-PT')}{suffix}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff', marginTop: 10 }}>
        {label}
      </div>
    </div>
  );
}

export default function Academia() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [hoveredImg, setHoveredImg] = useState<number | null>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        const elems = sectionRef.current.querySelectorAll('.ac-reveal');
        gsap.fromTo(Array.from(elems), { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true,
            onEnter: () => setActive(true) },
        });

        /* linha decorativa que se expande */
        gsap.fromTo('.ac-line', { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ background: '#1a396e', overflow: 'hidden', position: 'relative' }}>

      {/* Texto de fundo decorativo */}
      <div aria-hidden style={{
        position: 'absolute', top: '8%', right: '-2%',
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(80px,14vw,200px)', color: 'rgba(255,255,255,0.025)',
        letterSpacing: '-0.05em', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>ACADEMIA</div>

      {/* ─── Bloco principal ─── */}
      <div className="wrap" style={{ paddingTop: 'clamp(80px,10vh,120px)', paddingBottom: 'clamp(64px,8vh,96px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(48px,7vw,112px)', alignItems: 'start' }} className="ac-main-grid">

          {/* Esquerda */}
          <div>
            <div className="ac-reveal" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}><rect width="10" height="10" fill="rgba(255,255,255,0.5)" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                  Pessoas &amp; Formação
                </span>
              </div>
              <div style={{ marginBottom: 32 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/LOGO-ACADEMIA-02.png"
                  alt="Academia Omatapalo"
                  style={{ height: 84, width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(15px,1.35vw,18px)', color: '#ffffff', lineHeight: 1.85, margin: '0 0 32px' }}>
                <strong style={{ color: '#fff' }}>ACADEMIA OMATAPALO</strong>, inaugurada em 2021, tem como objetivo primordial a formação de quadros e funcionários do Grupo, com vista ao desenvolvimento e especialização dos seus profissionais.
              </p>
            </div>
          </div>

          {/* Direita: imagem em destaque com badge */}
          <div className="ac-reveal" style={{ opacity: 0, position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '16/10' }}>
            <Image
              src={GALLERY[1]}
              alt="Academia Omatapalo"
              fill
              style={{ objectFit: 'cover', transform: hoveredImg === -1 ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.8s ease' }}
              onMouseEnter={() => setHoveredImg(-1)}
              onMouseLeave={() => setHoveredImg(null)}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,16,31,0.55) 0%, transparent 60%)' }} />
            {/* badge ano */}
            <div style={{
              position: 'absolute', top: 20, left: 20,
              background: '#1a396e', color: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: '13px', letterSpacing: '0.06em',
              padding: '6px 14px', borderRadius: 2,
            }}>
              Desde 2021
            </div>
          </div>
        </div>

        {/* ─── Linha de separação animada ─── */}
        <div className="ac-line" style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '64px 0 0', transformOrigin: 'left', transform: 'scaleX(0)' }} />

        {/* ─── Stats bar ─── */}
        <div className="ac-reveal" style={{ opacity: 0, display: 'flex', marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} active={active} />
          ))}
        </div>
      </div>

      {/* ─── Galeria full-width com hover zoom individual ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
        {GALLERY.map((src, i) => (
          <div
            key={i}
            className="ac-reveal"
            style={{
              opacity: 0,
              position: 'relative',
              aspectRatio: '4/3',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredImg(i)}
            onMouseLeave={() => setHoveredImg(null)}
          >
            <Image
              src={src}
              alt={`Academia Omatapalo ${i + 1}`}
              fill
              style={{
                objectFit: 'cover',
                transform: hoveredImg === i ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.7s ease',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: hoveredImg === i
                ? 'linear-gradient(180deg, transparent 30%, rgba(7,16,31,0.7) 100%)'
                : 'linear-gradient(180deg, transparent 60%, rgba(7,16,31,0.35) 100%)',
              transition: 'background 0.4s ease',
            }} />
            {hoveredImg === i && (
              <div style={{
                position: 'absolute', bottom: 16, left: 16,
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
                opacity: 1, transition: 'opacity 0.3s',
              }}>
                Academia Omatapalo
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ac-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .ac-main-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}

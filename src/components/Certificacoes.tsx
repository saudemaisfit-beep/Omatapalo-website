'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const CERTS = [
  { src: '/ISO-9001-3.png',          label: 'ISO 9001',          sub: 'Sistemas de Gestão da Qualidade',         n: '01', bg: '/ISO-9001-2.png',          ghost: '9001'  },
  { src: '/ISO-14001-3.png',         label: 'ISO 14001',         sub: 'Gestão Ambiental',                        n: '02', bg: '/ISO-14001-2.png',         ghost: '14001' },
  { src: '/ISO-45001-3.png',         label: 'ISO 45001',         sub: 'Saúde e Segurança no Trabalho',           n: '03', bg: '/ISO-45001-2.png',         ghost: '45001' },
  { src: '/UN-GLOBAL-COMPACT-3.png', label: 'UN Global Compact', sub: 'Pacto Global das Nações Unidas',          n: '04', bg: '/UN-GLOBAL-COMPACT-2.png', ghost: 'UN'    },
];

function CertColumn({ cert, index, hovered, onEnter, onLeave }: {
  cert: typeof CERTS[0] & { bg?: string };
  index: number;
  hovered: number | null;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const colRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isHov   = hovered === index;
  const anyHov  = hovered !== null;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = colRef.current;
    const glow = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) *  8;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    if (glow) glow.style.background = `radial-gradient(ellipse at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 65%)`;
  }, []);

  const onOut = useCallback(() => {
    const el = colRef.current;
    if (!el) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.55)', overwrite: 'auto' });
    });
    onLeave();
  }, [onLeave]);

  return (
    <div
      ref={colRef}
      className="cert-col"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onOut}
      style={{
        flex: isHov ? '2.2' : '1',
        transition: 'flex 0.55s cubic-bezier(0.77,0,0.175,1)',
        background: '#fff',
        border: '0.5px solid #dde2f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        willChange: 'flex, transform',
        transformStyle: 'preserve-3d',
        minWidth: 0,
        opacity: anyHov && !isHov ? 0.6 : 1,
      }}
    >
      {/* glow */}
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'background .12s', zIndex: 2 }} />

      {/* certificate image — top portion */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {cert.bg && (
          <Image src={cert.bg} alt="" fill style={{ objectFit: 'cover', objectPosition: 'top left', transition: 'transform 0.6s ease', transform: isHov ? 'scale(1.04)' : 'scale(1)' }} />
        )}
        {/* seal top-left */}
        <div style={{ position: 'absolute', top: 10, left: 12, width: 44, height: 44, zIndex: 1 }}>
          <Image src={cert.src} alt={cert.label} fill style={{ objectFit: 'contain', filter: 'brightness(10)', opacity: 0.85 }} />
        </div>
      </div>

      {/* footer navy */}
      <div style={{ background: '#0d1e52', borderTop: '3px solid #1a396e', padding: '14px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(0.75rem,1.1vw,1rem)',
          color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1,
          textTransform: 'uppercase', marginBottom: 5,
        }}>{cert.label}</div>
        <div style={{
          fontFamily: 'var(--font-label)', fontSize: 8,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.5,
        }}>{cert.sub}</div>
      </div>
    </div>
  );
}

export default function Certificacoes() {
  const sectionRef  = useRef<HTMLElement>(null);
  const colsRef     = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        /* header */
        gsap.fromTo('.cert-hdr',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );

        /* columns stagger from below */
        gsap.fromTo('.cert-col',
          { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: 0.85, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: colsRef.current, start: 'top 85%', once: true },
          }
        );
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="certificacoes" style={{ background: '#07101f', overflow: 'hidden' }}>

      {/* subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="cert-hdr" style={{
          opacity: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
          padding: 'clamp(72px,10vh,120px) 0 clamp(40px,6vw,72px)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.3)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Certificação</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.95, textTransform: 'uppercase' }}>
              Padrões<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>de Excelência</span>
            </h2>
          </div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, maxWidth: 380 }}>
            A segurança e a saúde no trabalho é a pedra angular no Grupo Omatapalo. Comprometemo-nos a contribuir para o desenvolvimento sustentado da engenharia segundo os mais elevados padrões éticos.
          </p>
        </div>

      </div>

      {/* Full-width accordion columns */}
      <div
        ref={colsRef}
        style={{
          display: 'flex',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          height: 'clamp(280px,38vw,520px)',
          perspective: '1000px',
        }}
      >
        {CERTS.map((c, i) => (
          <CertColumn
            key={c.label}
            cert={c}
            index={i}
            hovered={hovered}
            onEnter={() => setHovered(i)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* bottom padding */}
      <div style={{ height: 'clamp(48px,6vh,80px)' }} />

    </section>
  );
}

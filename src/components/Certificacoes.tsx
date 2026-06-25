'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const CERTS = [
  { src: '/ISO-9001-3.png',          label: 'ISO 9001',          sub: 'Sistemas de Gestão da Qualidade',   n: '01', link: '' },
  { src: '/ISO-14001-3.png',         label: 'ISO 14001',         sub: 'Gestão Ambiental',                  n: '02', link: '' },
  { src: '/ISO-45001-3.png',         label: 'ISO 45001',         sub: 'Saúde e Segurança no Trabalho',     n: '03', link: '' },
  { src: '/UN-GLOBAL-COMPACT-3.png', label: 'UN Global Compact', sub: 'Pacto Global das Nações Unidas',   n: '04', link: '' },
];

function CertColumn({ cert, index, hovered, onEnter, onLeave }: {
  cert: (typeof CERTS)[0];
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
        background: isHov ? 'linear-gradient(135deg, #22479a 0%, #0e2554 100%)' : 'linear-gradient(135deg, #172d6e 0%, #0a1a45 100%)',
        borderRight: index < CERTS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
        padding: 'clamp(32px,4vw,56px) clamp(20px,2.5vw,40px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        willChange: 'flex, transform',
        transformStyle: 'preserve-3d',
        minWidth: 0,
      }}
    >
      {/* glow */}
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'background .12s' }} />

      {/* animated accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isHov ? '3px' : '0px',
        background: 'rgba(255,255,255,0.25)',
        transition: 'height 0.4s ease',
      }} />

      {/* seal */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24,
        opacity: isHov ? 1 : anyHov ? 0.15 : 0.6,
        transform: isHov ? 'translateZ(24px) translateY(0px)' : 'translateZ(0px) translateY(12px)',
        transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{
          position: 'relative',
          width: isHov ? 'clamp(80px,8vw,120px)' : 'clamp(56px,5vw,80px)',
          height: isHov ? 'clamp(80px,8vw,120px)' : 'clamp(56px,5vw,80px)',
          transition: 'width 0.5s ease, height 0.5s ease',
          flexShrink: 0,
        }}>
          <Image src={cert.src} alt={cert.label} fill style={{ objectFit: 'contain', filter: 'brightness(1.15)' }} />
        </div>
      </div>

      {/* label + link */}
      <div style={{ transform: 'translateZ(12px)' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(0.9rem,1.3vw,1.4rem)',
          color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1,
          marginBottom: 10, transition: 'font-size 0.3s',
        }}>{cert.label}</div>
        <div style={{
          fontFamily: 'var(--font-label)', fontSize: 9,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#fff', lineHeight: 1.6, transition: 'color 0.3s',
          maxWidth: isHov ? 280 : 120, overflow: 'hidden',
          marginBottom: cert.link ? 16 : 0,
        }}>{cert.sub}</div>

        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#fff', fontSize: 10, fontFamily: 'var(--font-label)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none',
              opacity: isHov ? 1 : 0,
              transform: isHov ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              pointerEvents: isHov ? 'auto' : 'none',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            Ver Certificado
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        )}
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
    <section ref={sectionRef} id="certificacoes" style={{ background: '#1a396e', overflow: 'hidden' }}>

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
            No Grupo Omatapalo, o compromisso com a segurança, a qualidade e a sustentabilidade orienta todas as nossas operações. As nossas certificações reflectem uma cultura de excelência, responsabilidade e confiança.
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

'use client';

import { useEffect, useRef } from 'react';
import type React from 'react';

const CERT_LOGOS = [
  { src: '/ISO-9001-2.png',          alt: 'ISO 9001',         label: 'Qualidade',        href: '#' },
  { src: '/ISO-14001-2.png',         alt: 'ISO 14001',        label: 'Gestão Ambiental', href: '#' },
  { src: '/ISO-45001-2.png',         alt: 'ISO 45001',        label: 'Segurança e Saúde',href: '#' },
  { src: '/UN-GLOBAL-COMPACT-2.png', alt: 'UN Global Compact',label: 'Pacto Global ONU', href: '#' },
];

const ODS = [
  { src: '/ods-08.png', alt: 'ODS 8' },
  { src: '/ods-09.png', alt: 'ODS 9' },
  { src: '/ods-11.png', alt: 'ODS 11' },
  { src: '/ods-13.png', alt: 'ODS 13' },
];

const ESG = [
  {
    n: '01', t: 'Ambiental',
    d: 'Energias renováveis, gestão de resíduos e compensação de carbono em todos os projectos.',
    img: 'https://omatapalo.com/wp-content/uploads/WhatsApp-Image-2025-06-02-at-19.38.03-1.jpeg',
  },
  {
    n: '02', t: 'Social',
    d: 'Contribuição para a melhoria da qualidade de vida dos colaboradores, das pessoas e das comunidades.',
    img: 'https://omatapalo.com/wp-content/uploads/OMT-missao-fazer-sorrir-entrega-brinquedos-natal-2023-2-1-e1758177645954.jpg',
  },
  {
    n: '03', t: 'Governança',
    d: 'Transparência e responsabilidade em todas as operações, alinhadas com o Pacto Global das Nações Unidas.',
    img: 'https://omatapalo.com/wp-content/uploads/imagem-home.jpg',
  },
];

const gridTexture: React.CSSProperties = {
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
};

export default function Sustentabilidade() {
  const s1Ref = useRef<HTMLElement>(null);
  const s2Ref = useRef<HTMLElement>(null);
  const s3Ref = useRef<HTMLElement>(null);
  const s4Ref = useRef<HTMLElement>(null);
  const s5Ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        if (s1Ref.current) {
          gsap.fromTo('.sus-s1-left',  { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s1Ref.current, start: 'top 80%', once: true } });
          gsap.fromTo('.sus-s1-right', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: s1Ref.current, start: 'top 78%', once: true } });
        }
        if (s2Ref.current) {
          gsap.fromTo('.sus-s2-hdr',   { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s2Ref.current, start: 'top 80%', once: true } });
          gsap.fromTo('.sus-esg-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: s2Ref.current, start: 'top 75%', once: true } });
          gsap.to(bgRef.current, { y: -60, ease: 'none', scrollTrigger: { trigger: s2Ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
        if (s3Ref.current) {
          gsap.fromTo('.sus-s3-left',  { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s3Ref.current, start: 'top 80%', once: true } });
          gsap.fromTo('.sus-s3-right', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: s3Ref.current, start: 'top 78%', once: true } });
          gsap.fromTo('.sus-ods-icon', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.sus-ods-row', start: 'top 85%', once: true } });
        }
        if (s4Ref.current) {
          gsap.fromTo('.sus-s4-hdr', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s4Ref.current, start: 'top 80%', once: true } });
          gsap.fromTo('.sus-cert',   { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: s4Ref.current, start: 'top 75%', once: true } });
        }
        if (s5Ref.current) {
          gsap.fromTo('.sus-s5-inner', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s5Ref.current, start: 'top 80%', once: true } });
        }
      });
    });
  }, []);

  return (
    <div id="sustentabilidade" style={{ overflow: 'hidden' }}>

      {/* ── 1. INTRO ── */}
      <section ref={s1Ref} style={{ background: '#F6F8FB', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,96px)', alignItems: 'center' }} className="sus-s1-grid">
            <div className="sus-s1-left" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>Sustentabilidade</span>
              </div>
              <h2 style={{ margin: '0 0 clamp(20px,2.5vw,32px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
                Construir<br />com<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Propósito</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.2vw,17px)', color: '#475569', lineHeight: 1.8, margin: '0 0 clamp(16px,2vw,24px)', maxWidth: 480 }}>
                O Grupo Omatapalo caminha rumo a um futuro que redefine os limites da Engenharia e Construção, com um claro foco no investimento em energias renováveis e inovação.
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.2vw,17px)', color: '#475569', lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                O contributo para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvido através da promoção e apoio de iniciativas de natureza social e ambiental.
              </p>
            </div>

            <div className="sus-s1-right" style={{ opacity: 0, position: 'relative' }}>
              <div aria-hidden style={{ position: 'absolute', top: -20, right: -12, zIndex: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(80px,12vw,160px)', lineHeight: 1, color: 'rgba(26,57,110,0.05)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>ESG</div>
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 4, overflow: 'hidden', background: '#0d1d35', zIndex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://omatapalo.com/wp-content/uploads/HABITACAO-CAMBAMBE_08042025-5.jpg" alt="Sustentabilidade Omatapalo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(7,16,31,0.65) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24, background: '#1a396e', padding: '6px 14px', fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                  Grupo Omatapalo · ESG
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ESG PILLARS ── */}
      <section ref={s2Ref} style={{ background: '#1a396e', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...gridTexture }} />
        <div ref={bgRef} aria-hidden style={{ position: 'absolute', bottom: -40, right: -20, zIndex: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(120px,18vw,260px)', lineHeight: 1, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>03</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sus-s2-hdr" style={{ opacity: 0, marginBottom: 'clamp(40px,6vw,64px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.4)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Áreas de Actuação</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'flex-end' }} className="sus-s2-hdr-grid">
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
                Estratégia<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>ESG</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.1vw,16px)', color: '#fff', lineHeight: 1.8, margin: 0 }}>
                A estratégia do Grupo OMATAPALO envolve um compromisso integral com a Sustentabilidade nas suas dimensões Ambiental, Social e de Governança.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(12px,1.5vw,20px)' }} className="sus-esg-grid">
            {ESG.map(p => (
              <div key={p.n} className="sus-esg-card" style={{ opacity: 0 }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 3, height: 'clamp(280px,28vw,380px)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.t} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, rgba(7,16,31,0.85) 100%)' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, background: '#1a396e', padding: '4px 10px', fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>{p.n}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 24px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem,1.4vw,1.3rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>{p.t}</div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px,0.85vw,13px)', color: '#fff', lineHeight: 1.7, margin: 0 }}>{p.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ODS ── */}
      <section ref={s3Ref} style={{ background: '#F6F8FB', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,96px)', alignItems: 'center' }} className="sus-s3-grid">
            <div className="sus-s3-left" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>Agenda 2030</span>
              </div>
              <h2 style={{ margin: '0 0 clamp(20px,2.5vw,32px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,3.5vw,4rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
                Objectivos de<br />Desenvolvimento<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Sustentável</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: '#475569', lineHeight: 1.8, margin: '0 0 clamp(24px,3vw,36px)' }}>
                A OMATAPALO abraça 4 dos 17 ODS fixados pela ONU na Agenda 2030, e em 2024 tornou-se a primeira empresa angolana de construção civil signatária do <strong style={{ color: '#0F1A2E' }}>Pacto Global das Nações Unidas</strong>.
              </p>

              {/* Goals list */}
              <div style={{ borderTop: '1px solid #DDE3ED', marginBottom: 'clamp(24px,3vw,36px)' }}>
                {['Erradicar a Pobreza', 'Erradicar a Fome', 'Saúde de Qualidade', 'Educação de Qualidade'].map((g, i) => (
                  <div key={g} className="sus-ods-icon" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(12px,1.5vw,16px) 0', borderBottom: '1px solid #DDE3ED' }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', color: '#1a396e', flexShrink: 0, minWidth: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.8rem,1vw,0.95rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#0F1A2E' }}>{g}</span>
                  </div>
                ))}
              </div>

              {/* ODS icons */}
              <div style={{ display: 'flex', gap: 'clamp(12px,1.5vw,20px)', flexWrap: 'wrap' }} className="sus-ods-row">
                {ODS.map(o => (
                  <div key={o.alt} className="sus-ods-icon" style={{ opacity: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.src} alt={o.alt} style={{ width: 'clamp(52px,6vw,72px)', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="sus-s3-right" style={{ opacity: 0, position: 'relative' }}>
              <div aria-hidden style={{ position: 'absolute', top: -20, right: -12, zIndex: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(80px,12vw,160px)', lineHeight: 1, color: 'rgba(26,57,110,0.05)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>ODS</div>
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 4, overflow: 'hidden', background: '#0d1d35', zIndex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://omatapalo.com/wp-content/uploads/3-1-e1757449622367.webp" alt="ODS Omatapalo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(7,16,31,0.6) 100%)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CERTIFICAÇÕES ── */}
      <section ref={s4Ref} style={{ background: '#1a396e', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...gridTexture }} />
        <div aria-hidden style={{ position: 'absolute', top: -20, right: -20, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(100px,15vw,220px)', lineHeight: 1, color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>ISO</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sus-s4-hdr" style={{ opacity: 0, marginBottom: 'clamp(48px,6vw,72px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.4)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Qualidade & Conformidade</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'flex-end' }} className="sus-s4-hdr-grid">
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
                Certificações<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>&amp; Normas</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.1vw,16px)', color: '#fff', lineHeight: 1.8, margin: 0 }}>
                Em 2024 a Omatapalo tornou-se a primeira empresa angolana de construção civil signatária do Pacto Global das Nações Unidas, alinhando a estratégia com os 17 ODS.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(12px,1.5vw,20px)' }} className="sus-cert-grid">
            {CERT_LOGOS.map(c => (
              <a key={c.alt} href={c.href} target="_blank" rel="noopener noreferrer" className="sus-cert" style={{
                opacity: 0, textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3, padding: 'clamp(28px,3.5vw,48px) clamp(20px,2.5vw,32px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                transition: 'background 0.25s, border-color 0.25s', cursor: 'pointer',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.11)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.22)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} style={{ maxHeight: 'clamp(70px,8vw,110px)', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, color: '#fff', letterSpacing: '0.02em', marginBottom: 4 }}>{c.alt}</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>{c.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. RELATÓRIO ── */}
      <section ref={s5Ref} style={{ background: '#07101f', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...gridTexture }} />

        <div className="wrap sus-s5-inner" style={{ opacity: 0, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,96px)', alignItems: 'center' }} className="sus-s5-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.4)" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Transparência</span>
              </div>
              <h2 style={{ margin: '0 0 clamp(16px,2vw,28px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,3.5vw,4rem)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
                Relatório de<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.18)' }}>Sustentabilidade</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: '#fff', lineHeight: 1.8, margin: 0, maxWidth: 440 }}>
                Consulte o nosso Relatório e Contas consolidadas e acompanhe os compromissos e resultados em matéria de sustentabilidade, governação e impacto social.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: 'clamp(32px,4vw,56px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#1a396e', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Documento PDF</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.9rem,1.2vw,1.1rem)', color: '#fff', letterSpacing: '-0.01em' }}>Relatório de Sustentabilidade 2024</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', background: '#1a396e', padding: '14px 24px', borderRadius: 2, alignSelf: 'flex-start' }}>
                Descarregar PDF
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .sus-s1-grid,.sus-s3-grid,.sus-s5-grid { grid-template-columns:1fr !important; }
          .sus-s2-hdr-grid,.sus-s4-hdr-grid { grid-template-columns:1fr !important; }
          .sus-esg-grid { grid-template-columns:1fr 1fr !important; }
          .sus-cert-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          .sus-esg-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

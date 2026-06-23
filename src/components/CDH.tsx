'use client';

import { useEffect, useRef } from 'react';

export default function CDH() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!ref.current) return;
        gsap.fromTo('.cdh-el',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
      });
    });
  }, []);

  return (
    <div ref={ref}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', background: '#0a1a0a', overflow: 'hidden', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        {/* Football background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1400&q=72&auto=format&fit=crop"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.35 }}
        />
        {/* Green tint overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,26,10,0.95) 45%, rgba(10,26,10,0.4))' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', paddingBlock: 'clamp(80px,10vh,120px)' }}>

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="cdh-el" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e63329', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e63329' }}>
                Desporto &amp; Comunidade · CDH
              </span>
            </div>

            {/* Title */}
            <h1 className="cdh-el" style={{
              opacity: 0, margin: 0,
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(2.2rem,5vw,5rem)',
              textTransform: 'uppercase', lineHeight: 0.92,
              letterSpacing: '-0.035em', color: '#fff',
              marginBottom: 28,
            }}>
              Construímos<br />
              mais do que<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.35)' }}>Infra-estruturas.</span>
            </h1>

            {/* Angola flag bar */}
            <div className="cdh-el" style={{ opacity: 0, display: 'flex', gap: 4, marginBottom: 32 }}>
              {['#e63329', '#000', '#f5c518'].map((c) => (
                <span key={c} style={{ width: 36, height: 4, background: c, borderRadius: 2, display: 'inline-block' }} />
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="cdh-el" style={{ opacity: 0 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.1vw,17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: 0 }}>
              Através do apoio ao Clube Desportivo da Huíla, a Omatapalo reafirma o seu compromisso com o desenvolvimento do desporto angolano, investindo na formação de talentos, na promoção de valores positivos e na criação de oportunidades para as futuras gerações. Acreditamos que o desporto é uma poderosa ferramenta de inclusão social, educação e transformação das comunidades.
            </p>
          </div>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <section style={{ background: '#0d1f0d', paddingBlock: 'clamp(64px,8vh,100px)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)' }}>

          {/* Left */}
          <div className="cdh-el" style={{ opacity: 0 }}>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
              Clube Desportivo da Huíla
            </div>
            <h2 style={{
              margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(1.6rem,3vw,3rem)', textTransform: 'uppercase',
              lineHeight: 0.95, letterSpacing: '-0.03em', color: '#fff',
            }}>
              Apoio ao<br />Desenvolvimento<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>Desportivo</span>
            </h2>
          </div>

          {/* Right */}
          <div className="cdh-el" style={{ opacity: 0 }}>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e63329', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, background: '#e63329', display: 'inline-block' }} />
              Impacto da Parceria
            </div>

            <div style={{ borderLeft: '3px solid #e63329', paddingLeft: 20, marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.9rem,1.2vw,1.1rem)', textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>
                Melhoria das Condições de Treino
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.9vw,15px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                Instalações modernas que elevam o nível de preparação dos atletas.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid rgba(255,255,255,0.15)', paddingLeft: 20, marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.9rem,1.2vw,1.1rem)', textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>
                Formação de Jovens Talentos
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.9vw,15px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                Investimento no futuro do desporto angolano através da formação de base.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid rgba(255,255,255,0.15)', paddingLeft: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.9rem,1.2vw,1.1rem)', textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>
                Inclusão Social e Comunidade
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.9vw,15px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                O desporto como veículo de transformação social e orgulho regional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .cdh-el { opacity: 1 !important; }
        }
        @media (max-width: 860px) {
          .wrap > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

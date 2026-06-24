'use client';

import { useEffect, useRef, useState } from 'react';

const NEWS = [
  {
    img: '/EN-230-omatapalo-2.jpg',
    cat: 'Construção', date: '15 Mai 2026',
    title: 'OMATAPALO vence Prémio Forbes de Responsabilidade Social na categoria de Engenharia e Construção',
    excerpt: 'O Grupo Omatapalo foi distinguido pelo seu compromisso com as comunidades e com o desenvolvimento sustentável de Angola.',
    featured: true,
  },
  {
    img: '/Sustentabilidade-omatapalo.png',
    cat: 'Energia', date: '10 Abr 2026',
    title: 'Projecto energético recebe financiamento do Impact Credit Fund',
    excerpt: 'Novo investimento reforça a aposta nas energias renováveis.',
  },
  {
    img: '/DSC_0030.jpg',
    cat: 'Comunidade', date: '02 Mar 2026',
    title: 'Missão Fazer Sorrir leva apoio a lares de acolhimento',
    excerpt: 'Iniciativa solidária chega a mais de 200 crianças em todo o país.',
  },
  {
    img: '/centro-cultural-huambo-omatapalo.png',
    cat: 'Infra-estruturas', date: '18 Fev 2026',
    title: 'Centro Cultural do Huambo abre portas à comunidade angolana',
    excerpt: 'Equipamento cultural reforça o compromisso do Grupo com o desenvolvimento social.',
  },
];

export default function Media() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        /* header */
        gsap.fromTo('.media-hdr',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );

        /* featured card clip-path reveal */
        gsap.fromTo('.media-featured',
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );

        /* side cards slide up */
        gsap.fromTo('.media-side',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );

        /* divider line */
        gsap.fromTo('.media-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'left',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
      });
    });
  }, []);

  const featured = NEWS[0];
  const side = NEWS.slice(1);

  return (
    <section id="media" ref={sectionRef} style={{ background: '#F6F8FB', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)', overflow: 'hidden' }}>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="media-hdr" style={{ opacity: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 'clamp(32px,5vw,56px)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>Media</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
              Últimas<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Novidades</span>
            </h2>
          </div>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', paddingBottom: 4, borderBottom: '1px solid rgba(26,57,110,0.3)', transition: 'border-color .25s', whiteSpace: 'nowrap' }}>
            Ver Todas as Notícias
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <div className="media-divider" style={{ height: 1, background: '#DDE3ED', marginBottom: 'clamp(28px,4vw,48px)' }} />

        {/* ── Grid: featured + side ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'clamp(16px,2.5vw,32px)', alignItems: 'start' }} className="media-grid">

          {/* FEATURED */}
          <a
            href="#"
            className="media-featured"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ display: 'block', textDecoration: 'none', opacity: 0, overflow: 'hidden', borderRadius: 4, position: 'relative', aspectRatio: '4/3', background: '#0d1622' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.img} alt={featured.title} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.7s ease',
              transform: hoveredCard === 0 ? 'scale(1.06)' : 'scale(1)',
            }} />

            {/* gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,16,31,0.92) 0%, rgba(7,16,31,0.3) 50%, transparent 100%)' }} />

            {/* content */}
            <div style={{ position: 'absolute', inset: 0, padding: 'clamp(20px,3vw,36px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: '#1a396e', padding: '4px 10px', borderRadius: 2 }}>{featured.cat}</span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.1em', color: '#fff' }}>{featured.date}</span>
              </div>
              <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.1rem,2vw,1.9rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, textTransform: 'uppercase' }}>
                {featured.title}
              </h3>
              <p style={{
                margin: 0, fontFamily: 'var(--font-sans)', fontSize: 13, color: '#fff', lineHeight: 1.6,
                maxHeight: hoveredCard === 0 ? '80px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease, opacity 0.3s ease',
                opacity: hoveredCard === 0 ? 1 : 0,
              }}>{featured.excerpt}</p>
              {/* read more */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, opacity: hoveredCard === 0 ? 1 : 0, transition: 'opacity .3s', transform: hoveredCard === 0 ? 'translateY(0)' : 'translateY(8px)' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>Ler mais</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </a>

          {/* SIDE CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,20px)' }}>
            {side.map((n, i) => (
              <a
                key={n.title}
                href="#"
                className="media-side"
                onMouseEnter={() => setHoveredCard(i + 1)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ display: 'flex', gap: 'clamp(14px,1.5vw,20px)', textDecoration: 'none', opacity: 0, alignItems: 'stretch', background: '#fff', borderRadius: 4, overflow: 'hidden', border: `1.5px solid ${hoveredCard === i + 1 ? '#1a396e' : '#E8EDF5'}`, transition: 'border-color .25s, box-shadow .3s', boxShadow: hoveredCard === i + 1 ? '0 12px 36px rgba(26,57,110,0.12)' : 'none' }}
              >
                {/* thumbnail */}
                <div style={{ position: 'relative', width: 'clamp(100px,30%,160px)', flexShrink: 0, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.img} alt={n.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease', transform: hoveredCard === i + 1 ? 'scale(1.08)' : 'scale(1)' }} />
                </div>
                {/* text */}
                <div style={{ padding: 'clamp(16px,2vw,22px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: '#1a396e', padding: '3px 8px', borderRadius: 2 }}>{n.cat}</span>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.1em', color: '#94a3b8' }}>{n.date}</span>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.85rem,1.1vw,1rem)', color: '#0F1A2E', letterSpacing: '-0.01em', lineHeight: 1.2, textTransform: 'uppercase' }}>{n.title}</h3>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12, color: '#64748b', lineHeight: 1.55, maxHeight: hoveredCard === i + 1 ? '60px' : '0px', overflow: 'hidden', transition: 'max-height .35s ease, opacity .25s', opacity: hoveredCard === i + 1 ? 1 : 0 }}>{n.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) { .media-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

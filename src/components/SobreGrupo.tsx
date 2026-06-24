'use client';

import { useEffect, useRef, useState } from 'react';

const IMAGES = [
  { src: '/EN-230-omatapalo-2.jpg',              label: 'Estrada Nacional 230 - Saurimo'   },
  { src: '/Salao-Protocolar-1-1.jpg',            label: 'Salão Protocolar - Luanda'             },
  { src: '/centro-cultural-huambo-omatapalo.png',label: 'Centro Cultural Manuel Rui - Huambo'   },
  { src: '/omatapalo-construcao-do-monumento-do-soldado-desconhecido.jpg', label: 'Monumento ao Soldado Desconhecido - Luanda' },
  { src: '/DSC_0030.jpg',                        label: 'Missão Fazer Sorrir'             },
  { src: '/Academia-barra.jpg',                  label: 'Academia Omatapalo'           },
];

const STATS = [
  { target: 23,   suffix: '',        prefix: '',   format: (n: number) => Math.round(n).toString(),                          l: 'Anos'          },
  { target: 15000, suffix: '',       prefix: '+',  format: (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), l: 'Colaboradores' },
  { target: 1.5,  suffix: 'M m²',   prefix: '+',  format: (n: number) => n.toFixed(1).replace('.', ','),                    l: 'Construídos'   },
  { target: 5000, suffix: ' km',     prefix: '+',  format: (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), l: 'de Estrada' },
];

export default function SobreGrupo() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const stripRef     = useRef<HTMLDivElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!wrapperRef.current || !stripRef.current) return;

        /* ── horizontal strip driven by vertical scroll ── */
        const getDistance = () =>
          -(stripRef.current!.scrollWidth - stripRef.current!.parentElement!.offsetWidth);

        gsap.to(stripRef.current, {
          x: getDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        /* ── left text entrance (fires once on first scroll into view) ── */
        gsap.fromTo('.sgc-eyebrow',
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.sgc-word',
          { yPercent: 110, opacity: 0, rotateX: -40 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.sgc-text',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.1,
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.sgc-stat',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true } }
        );

        /* ── counter animation ── */
        document.querySelectorAll<HTMLElement>('[data-counter]').forEach(el => {
          const target = parseFloat(el.getAttribute('data-counter') || '0');
          const fmt = el.getAttribute('data-fmt') || '';
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate() {
              if (fmt === 'decimal') el.textContent = proxy.val.toFixed(1).replace('.', ',');
              else if (fmt === 'thousands') el.textContent = Math.round(proxy.val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              else el.textContent = Math.round(proxy.val).toString();
            },
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      {/* ── scroll distance wrapper (250vh gives room for full strip travel) ── */}
      <div ref={wrapperRef} id="grupo" className="sgc-wrapper" style={{ height: '250vh', position: 'relative' }}>

        {/* ── sticky viewport ── */}
        <div className="sgc-sticky" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', overflow: 'hidden', background: '#ffffff' }}>

          {/* ── LEFT: static text panel ── */}
          <div className="sgc-left" style={{
            flexShrink: 0,
            width: 'clamp(280px, 36vw, 520px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(40px,5vw,80px)',
            borderRight: '1px solid #e5e7eb',
            zIndex: 2,
            background: '#ffffff',
          }}>

            {/* eyebrow */}
            <div className="sgc-eyebrow" style={{ opacity: 1, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}><rect width="10" height="10" fill="#1a396e" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>
                Grupo Omatapalo · Desde 2003
              </span>
            </div>

            {/* title */}
            <div style={{ overflow: 'visible', marginBottom: 28, paddingTop: 8 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.035em', fontSize: 'clamp(1.8rem,3.5vw,5rem)' }}>
                {['Quem', 'Somos'].map((w, i) => (
                  <span key={w} className="sgc-word" style={{
                    display: 'block', opacity: 0,
                    color: i === 0 ? '#1a396e' : 'transparent',
                    WebkitTextStroke: i === 0 ? '0px' : '2px rgba(26,57,110,0.55)',
                  }}>{w}</span>
                ))}
              </h2>
            </div>

            {/* body */}
            <p className="sgc-text" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#0a0f1e', lineHeight: 1.85, marginBottom: 12 }}>
              Somos um grupo empresarial angolano com presença em sectores estratégicos da economia, comprometido com a criação de valor, o desenvolvimento sustentável e o progresso de Angola.
            </p>
            <p className="sgc-text" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#0a0f1e', lineHeight: 1.85, marginBottom: 12 }}>
              Fundado em 2003, o Grupo Omatapalo tem vindo a consolidar uma trajectória de crescimento assente na excelência, na inovação e no impacto positivo.
            </p>
            <p className="sgc-text" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#0a0f1e', lineHeight: 1.85, marginBottom: 32 }}>
              Mais do que construir infra-estruturas, construímos confiança, oportunidades e futuro.
            </p>

            {/* stats 2×2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: 32 }}>
              {STATS.map((s, i) => {
                const fmt = s.suffix === ' km' || s.target === 15000 ? 'thousands' : s.suffix === 'M m²' ? 'decimal' : 'int';
                return (
                  <div key={i} className="sgc-stat" style={{ opacity: 0, borderTop: '1.5px solid #e5e7eb', paddingTop: 14, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem,1.8vw,1.8rem)', color: '#1a396e', letterSpacing: '-0.02em', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                      {s.prefix && <span style={{ fontSize: '0.65em' }}>{s.prefix}</span>}
                      <span
                        data-counter={s.target}
                        data-fmt={fmt}
                      >0</span>
                      <span style={{ fontSize: '0.55em', color: '#1a396e', fontFamily: 'var(--font-sans)', fontWeight: 600, marginLeft: 2 }}>
                        {s.suffix.includes('m²') ? <>M m<sup>2</sup></> : s.suffix}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0a0f1e', marginTop: 6 }}>{s.l}</div>
                  </div>
                );
              })}
            </div>

            {/* cta */}
            <div className="sgc-text" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => setVideoOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#1a396e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform .25s, background .25s',
                }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'scale(1.12)'; d.style.background = '#1a396e'; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = ''; d.style.background = '#1a396e'; }}
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="white"><path d="M1 1l10 6-10 6V1z" /></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: '#0F1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vídeo Institucional</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af' }}>Grupo Omatapalo · 2026</div>
                </div>
              </button>
            </div>

            {/* scroll hint */}
            <div style={{ marginTop: 'auto', paddingTop: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect width="10" height="10" fill="#1a396e" />
              </svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a0f1e' }}>Deslize para explorar</span>
            </div>

          </div>

          {/* ── RIGHT: horizontal image strip ── */}
          <div className="sgc-right" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div ref={stripRef} className="sgc-strip" style={{ display: 'flex', gap: 'clamp(12px,1.5vw,20px)', height: '100%', paddingInline: 'clamp(20px,2.5vw,40px)', alignItems: 'center', willChange: 'transform' }}>
              {IMAGES.map((img, i) => (
                <div key={i} style={{
                  flexShrink: 0,
                  width: 'clamp(260px,28vw,400px)',
                  height: '75%',
                  position: 'relative',
                  overflow: 'hidden',
                  clipPath: 'polygon(7% 0%, 100% 0%, 93% 100%, 0% 100%)',
                  background: '#0d1d35',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = ''; }}
                  />
                  {/* gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(7,16,31,0.7) 100%)', pointerEvents: 'none' }} />
                  {/* label */}
                  <div style={{ position: 'absolute', bottom: 18, left: '10%', fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>
                    {img.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sgc-wrapper { height: auto !important; }
          .sgc-sticky { position: relative !important; height: auto !important; flex-direction: column !important; overflow: visible !important; }
          .sgc-left  { width: 100% !important; border-right: none !important; border-bottom: 1px solid #e5e7eb; padding: 48px 24px !important; }
          .sgc-right { width: 100% !important; height: 320px; overflow: hidden; }
          .sgc-strip { transform: none !important; flex-wrap: nowrap; overflow-x: auto; padding-inline: 24px !important; height: 100% !important; }
          .sgc-eyebrow, .sgc-word, .sgc-text, .sgc-stat { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Video Modal */}
      {videoOpen && (
        <div onClick={() => setVideoOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setVideoOpen(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>✕</button>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 900 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src="https://www.youtube.com/embed/kuVu9thTbIM?autoplay=1&rel=0&modestbranding=1"
                title="Vídeo Institucional Omatapalo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

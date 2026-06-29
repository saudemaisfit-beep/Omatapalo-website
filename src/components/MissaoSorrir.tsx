'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const DEF_MS = {
  youtube_id: 'kuVu9thTbIM',
  citacao: 'Para nós, a responsabilidade social começa na nossa casa e nas condições que damos aos nossos Colaboradores. É nesta matriz e nesta filosofia que assenta a nossa capacidade de fazer acontecer.',
  paragrafo: 'Num país onde existe pobreza e desigualdade, a OMATAPALO considera a responsabilidade social de extrema importância. A contribuição para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvida através da promoção e apoio em iniciativas nos domínios da beneficência e solidariedade social.',
  ods_imgs: ['/ods-08.png', '/ods-09.png', '/ods-11.png', '/ods-13.png'],
};

const CARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    tag: 'Comunidade',
    title: 'Apoio Comunitário e Infantil',
    text: 'Apoio alimentar, educacional, habitacional, sanitário e lúdico a comunidades carenciadas e lares de acolhimento.',
    img: 'photo-1488521787991-ed7bbaae773c',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    tag: 'Campanhas',
    title: 'Doação de Brinquedos',
    text: 'Campanhas em épocas festivas que levam alegria e brinquedos às crianças que mais precisam.',
    img: 'photo-1497486751825-1233686d5d80',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
    ),
    tag: 'Saúde',
    title: 'Doação de Sangue',
    text: 'Campanhas internas recorrentes em parceria com o Instituto Nacional de Sangue (INS).',
    img: 'photo-1469571486292-0ba58a3f068b',
  },
];

const STATS = [
  { v: 30, suffix: '+', l: 'Anos de impacto social' },
  { v: 12, suffix: '', l: 'Projectos activos' },
  { v: 5000, suffix: '+', l: 'Vidas transformadas', display: '5k+' },
  { v: 3, suffix: '', l: 'Programas nacionais' },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = (target / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return val;
}

export default function MissaoSorrir() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [ms, setMs] = useState(DEF_MS);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'missao_sorrir_cfg').single().then(({ data }) => {
      if (data?.value) try { setMs(m => ({ ...m, ...JSON.parse(data.value) })); } catch {}
    });
  }, []);

  const count0 = useCountUp(30, statsVisible);
  const count1 = useCountUp(12, statsVisible);
  const count3 = useCountUp(3, statsVisible);
  const counts = [count0, count1, 5000, count3];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        gsap.fromTo('.ms-word',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: '.ms-hero', start: 'top 82%', once: true } });

        gsap.fromTo('.ms-lead',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.35,
            scrollTrigger: { trigger: '.ms-hero', start: 'top 82%', once: true } });

        gsap.fromTo('.ms-video-hero',
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: '.ms-video-hero', start: 'top 80%', once: true } });

        gsap.fromTo('.ms-card-tab',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
            scrollTrigger: { trigger: '.ms-cards-section', start: 'top 78%', once: true } });

        gsap.fromTo('.ms-split-text',
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ms-split', start: 'top 78%', once: true } });

        gsap.fromTo('.ms-split-video',
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ms-split', start: 'top 78%', once: true } });
      });
    });
  }, []);

  // close lightbox on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <section id="missao" ref={sectionRef} style={{ background: '#07101f', overflow: 'hidden', position: 'relative' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="ms-hero wrap" style={{ paddingTop: 'clamp(80px,10vw,140px)', paddingBottom: 'clamp(56px,7vw,80px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}><rect width="10" height="10" fill="#1a396e" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
            Responsabilidade Social
          </span>
        </div>

        {/* Title + quote — two columns */}
        <div className="ms-lead ms-grid2" style={{ opacity: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,6vw,96px)', alignItems: 'flex-start' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase',
            fontSize: 'clamp(2rem,4vw,4.5rem)', lineHeight: 0.95,
            letterSpacing: '-0.03em', color: '#fff', margin: 0,
          }}>
            Responsabilidade<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Social na</span><br />
            Omatapalo
          </h2>
          <div style={{ paddingTop: 'clamp(8px,1vw,16px)' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem,1.3vw,1.1rem)',
              lineHeight: 1.85, color: '#fff', fontStyle: 'italic',
              margin: '0 0 28px', borderLeft: '2px solid #1a396e', paddingLeft: 24,
            }}>
              "{ms.citacao}"
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,1.05vw,0.975rem)',
              lineHeight: 1.8, color: '#fff', margin: 0,
            }}>
              {ms.paragrafo}
            </p>
          </div>
        </div>

      </div>

      {/* ── VIDEO HERO ───────────────────────────────────── */}
      <div className="ms-video-hero wrap" style={{ paddingBottom: 'clamp(80px,10vw,120px)', opacity: 0 }}>
        <div
          onClick={() => setVideoOpen(true)}
          style={{
            position: 'relative', borderRadius: '16px', overflow: 'hidden',
            height: 'clamp(260px,40vw,520px)', cursor: 'pointer',
            background: 'var(--navy-950)',
          }}
        >
          <Image
            src={`https://i.ytimg.com/vi/${ms.youtube_id}/maxresdefault.jpg`}
            alt="A Sustentabilidade e Responsabilidade Social na Omatapalo"
            fill
            className="object-cover"
            style={{ opacity: 0.65, transition: 'opacity 0.3s, transform 0.5s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.5'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.65'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
          {/* Play button */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '16px',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.12)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.45)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)'; }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--navy-950)" style={{ marginLeft: '4px' }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
            }}>
              A Sustentabilidade e RSE na Omatapalo
            </span>
          </div>

          {/* Bottom left tag */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px',
            fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#fff',
          }}>
            Grupo Omatapalo · 2026
          </div>
        </div>
      </div>



      {/* ── ODS INTRO ───────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#07101f' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(64px,8vw,96px)', paddingBottom: 'clamp(64px,8vw,96px)' }}>
          <div className="ms-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,6vw,96px)', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}><rect width="10" height="10" fill="#1a396e" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>ODS</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem,2.8vw,3rem)', lineHeight: 1.0, letterSpacing: '-0.03em', color: '#fff', textTransform: 'uppercase', margin: '0 0 24px' }}>
                Objectivos Globais de Desenvolvimento Sustentável
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,1.1vw,1rem)', lineHeight: 1.8, color: '#fff', margin: 0 }}>
                A OMATAPALO abraça <strong style={{ color: 'rgba(255,255,255,0.85)' }}>4 dos 17 objectivos</strong> fixados pela ONU na Agenda 2030, como vectores para a sua participação activa nas perspetivas económicas, social e ambiental.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {ms.ods_imgs.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`ODS ${i + 8}`} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VIDEO LIGHTBOX ──────────────────────────────── */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setVideoOpen(false)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'none', border: 'none', color: '#fff',
              fontSize: '28px', cursor: 'pointer', lineHeight: 1,
            }}
          >
            ✕
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}
          >
            <iframe
              style={{ width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${ms.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
              title="A Sustentabilidade e Responsabilidade Social na Omatapalo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .ms-grid2 { grid-template-columns: 1fr !important; }
          .ms-cards-section .wrap > div:last-child { grid-template-columns: 1fr !important; }
          .ms-split > .wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

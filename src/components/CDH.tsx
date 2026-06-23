'use client';

import { useEffect, useRef } from 'react';

const GALLERY = [
  '/CDH TREINO 1.jpg',
  '/CDH TREINO 2.jpg',
  '/CDH TREINO 3.jpg',
  '/CDH TREINO 4.jpg',
  '/CDH TREINO 5.jpg',
  '/CDH TREINO 6.jpg',
];

const IMPACT = [
  { title: 'Melhoria das Condições de Treino',       desc: 'Instalações modernas que elevam o nível de preparação dos atletas.' },
  { title: 'Desenvolvimento de Jovens Talentos',     desc: 'Formação de uma nova geração de futebolistas angolanos com visão de futuro.' },
  { title: 'Fortalecimento do Desporto na Huíla',   desc: 'Contribuição directa para o crescimento do ecossistema desportivo provincial.' },
  { title: 'Promoção de Valores',                    desc: 'Disciplina, trabalho em equipa e inclusão social como pilares do projecto.' },
];

export default function CDH() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!ref.current) return;
        ref.current.querySelectorAll('.cdh-el').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
      });
    });
  }, []);

  return (
    <div ref={ref}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', background: '#0a1a0a', overflow: 'hidden', minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1400&q=72&auto=format&fit=crop"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,26,10,0.95) 45%, rgba(10,26,10,0.4))' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', paddingBlock: 'clamp(80px,10vh,120px)' }}>
          <div>
            <div className="cdh-el" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e63329', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e63329' }}>
                Desporto &amp; Comunidade · CDH
              </span>
            </div>
            <h1 className="cdh-el" style={{
              opacity: 0, margin: '0 0 28px',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(2.2rem,5vw,5rem)', textTransform: 'uppercase',
              lineHeight: 0.92, letterSpacing: '-0.035em', color: '#fff',
            }}>
              Construímos<br />mais do que<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.35)' }}>Infra-estruturas.</span>
            </h1>
            <div className="cdh-el" style={{ opacity: 0, display: 'flex', gap: 4 }}>
              {['#e63329', '#000', '#f5c518'].map((c) => (
                <span key={c} style={{ width: 36, height: 4, background: c, borderRadius: 2, display: 'inline-block' }} />
              ))}
            </div>
          </div>

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
          <div>
            <div className="cdh-el" style={{ opacity: 0, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
              Clube Desportivo da Huíla
            </div>
            <h2 className="cdh-el" style={{
              opacity: 0, margin: '0 0 28px',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(1.6rem,3vw,3rem)', textTransform: 'uppercase',
              lineHeight: 0.95, letterSpacing: '-0.03em', color: '#fff',
            }}>
              Apoio ao<br />Desenvolvimento<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>Desportivo</span>
            </h2>
            <p className="cdh-el" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.95vw,15px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: '0 0 20px' }}>
              Enquanto patrocinador do Clube Desportivo da Huíla, a Omatapalo desempenha um papel activo na valorização do desporto nacional e no fortalecimento do futebol na Região Sul de Angola.
            </p>
            <p className="cdh-el" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.95vw,15px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: '0 0 20px' }}>
              Um dos marcos desta parceria foi o apoio à construção do <strong style={{ color: '#fff' }}>Complexo de Treino General do Exército Francisco Ferreira Furtado</strong>, uma infra-estrutura moderna concebida para proporcionar melhores condições de preparação aos atletas, promover a excelência desportiva e contribuir para o crescimento sustentável do clube e da modalidade na província da Huíla.
            </p>
            <p className="cdh-el" style={{ opacity: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,0.95vw,15px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: 0 }}>
              Este investimento reflecte a visão da Omatapalo de gerar impacto positivo duradouro, apoiando iniciativas que promovem o desenvolvimento humano, social e desportivo das comunidades angolanas.
            </p>
          </div>

          {/* Right — Impact items */}
          <div>
            <div className="cdh-el" style={{ opacity: 0, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e63329', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, background: '#e63329', display: 'inline-block' }} />
              Impacto da Parceria
            </div>
            {IMPACT.map((item, i) => (
              <div key={i} className="cdh-el" style={{ opacity: 0, borderLeft: `3px solid ${i === 0 ? '#e63329' : 'rgba(255,255,255,0.12)'}`, paddingLeft: 20, marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.85rem,1.1vw,1rem)', textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>
                  {item.title}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.85vw,14px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ background: '#0a1a0a', paddingTop: 0, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 280px)', gap: 2 }}>
          {GALLERY.map((src, i) => (
            <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = ''; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,26,10,0.25)', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>

        {/* Stat overlay */}
        <div style={{ position: 'absolute', bottom: 32, left: 'clamp(24px,5vw,80px)', zIndex: 10 }}>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Formação Desportiva</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>+200</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem,2vw,1.8rem)', color: '#fff', letterSpacing: '-0.02em' }}>Atletas</div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .cdh-grid-2 { grid-template-columns: 1fr !important; }
          .cdh-gallery { grid-template-columns: 1fr 1fr !important; grid-template-rows: repeat(3, 220px) !important; }
        }
        @media (max-width: 540px) {
          .cdh-gallery { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

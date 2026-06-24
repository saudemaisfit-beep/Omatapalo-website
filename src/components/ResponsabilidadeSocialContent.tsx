'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type React from 'react';

/* ── DATA ──────────────────────────────────────────────────────── */

const ODS = [
  {
    num: 1, key: 'ods1', color: '#1a396e',
    label: 'Erradicação da Pobreza', logo: '/responsabilidade-1.png',
    totalDirecta: 25234, totalIndirecta: 494962,
    desc: 'Apoio directo a famílias e crianças em situação de vulnerabilidade, através de infraestrutura social, educação e solidariedade.',
    projects: [
      { title: 'Aldeia de Crianças SOS Lubango',    location: 'Lubango, Huíla', since: '2015', directa: 54,    indirecta: 162,   desc: 'A OMATAPALO apadrinha várias casas da Aldeia SOS Lubango com apoio mensal para dezenas de crianças no seu desenvolvimento educativo e psicoemocional.' },
      { title: 'Paróquia N.ª Sra. Muxima do Toco',  location: 'Lubango, Huíla', since: '2012', directa: 20180, indirecta: 59960, desc: 'Escolas, dois hospitais equipados, cozinha comunitária e centro de formação profissional para uma comunidade de 20.000 habitantes.' },
      { title: 'Venha Dar a Sua Mão',               location: 'Nacional',        since: '2014', directa: 5000,  indirecta: 15000, desc: 'Campanha anual de recolha e doação de brinquedos, roupa e material escolar para crianças carenciadas em todo o país.' },
      { title: 'Apoio na Luta Contra a Seca',       location: 'Nacional',        since: '2019', directa: null,  indirecta: 220000,desc: 'Distribuição de dez toneladas de alimentos essenciais a famílias afectadas pela seca em várias províncias.' },
      { title: 'Apoio na Distribuição de Água',     location: '4 províncias',    since: '2019', directa: null,  indirecta: 200000,desc: 'Abastecimento de água a 200.000 famílias em quatro províncias afectadas pela escassez hídrica.' },
    ],
  },
  {
    num: 2, key: 'ods2', color: '#DDA63A',
    label: 'Erradicar a Fome', logo: '/responsabilidade-2.png',
    totalDirecta: 1000, totalIndirecta: 500000,
    desc: 'Distribuição diária de refeições solidárias e apoio à produção agrícola local para garantir segurança alimentar.',
    projects: [
      { title: 'Campanha Sopas Solidárias',          location: 'Luanda (5 zonas)', since: '2021', directa: 1000, indirecta: 500000, desc: 'Mais de 1.000 sopas e pão distribuídos diariamente em Luanda. 500k+ refeições acumuladas em Baixa, Talatona, Viana, Zango e Cacuaco.' },
      { title: 'Apoio às Comunidades Agrícolas',     location: 'Fazenda Mumba',    since: '2019', directa: null, indirecta: null,   desc: 'Apoio mecânico e sementes para 150 hectares de cultivo de milho e feijão, beneficiando centenas de famílias rurais.' },
    ],
  },
  {
    num: 3, key: 'ods3', color: '#4C9F38',
    label: 'Saúde de Qualidade', logo: '/responsabilidade-3.png',
    totalDirecta: 400, totalIndirecta: null,
    desc: 'Campanhas médicas anuais e doação de sangue para garantir acesso a cuidados de saúde primários em comunidades remotas.',
    projects: [
      { title: 'Campanha Médica do Tchivinguiro',      location: 'Humpata, Huíla', since: '2016', directa: 400, indirecta: null, desc: 'Consultas médicas, medicamentos, alimentação e material escolar para 400 crianças anuais com voluntários do Hospital S. António.' },
      { title: 'Campanha Interna de Doação de Sangue', location: 'Nacional',       since: '2017', directa: null,indirecta: null, desc: 'Campanhas regulares em parceria com o Instituto Nacional de Sangue (INS), abastecendo hospitais públicos de referência.' },
    ],
  },
  {
    num: 4, key: 'ods4', color: '#C5192D',
    label: 'Educação de Qualidade', logo: '/responsabilidade-4.png',
    totalDirecta: 152000, totalIndirecta: 506000,
    desc: 'Merenda escolar, material didáctico e construção de infraestruturas educativas em comunidades rurais.',
    projects: [
      { title: 'Projecto Merenda Escolar',    location: 'Fazenda Mumba', since: '2016', directa: 150000, indirecta: 500000, desc: 'Mais de 150.000 refeições escolares anuais às aldeias de Manengo, Hungulo, Makova, Calundungo e Kwanda. 500k+ acumuladas.' },
      { title: 'Projecto Escola Fazer Sorrir',location: 'Nacional',      since: '2018', directa: 2000,   indirecta: 6000,   desc: 'Construção e equipamento de salas de aula em comunidades rurais com doação de cadernos, lápis, mochilas e livros.' },
    ],
  },
];

function fmtNum(n: number | null | undefined): string {
  if (!n) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'k+';
  return n.toLocaleString('pt-PT');
}

const gridTex: React.CSSProperties = {
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
  backgroundSize: '60px 60px',
};

export default function ResponsabilidadeSocialContent() {
  const [active, setActive]       = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [lbIdx, setLbIdx]         = useState<number | null>(null);
  const projectsRef               = useRef<HTMLDivElement>(null);
  const activeOds = ODS.find(o => o.key === active) ?? null;

  const selectOds = useCallback((key: string) => {
    setActive(prev => {
      const next = prev === key ? null : key;
      if (next) setTimeout(() => projectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return next;
    });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo('.rsa-hero > *', { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: '.rsa-hero', start: 'top 80%', once: true } });
        gsap.fromTo('.rsa-stat',     { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.rsa-stats', start: 'top 82%', once: true } });
        gsap.fromTo('.rsa-tile',     { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.rsa-tiles', start: 'top 82%', once: true } });
      });
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo('.rsa-proj', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out' });
    });
  }, [active]);

  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: '#f6f8fb', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(72px,10vh,112px)', paddingBottom: 'clamp(60px,8vh,88px)' }}>
        <div aria-hidden style={{ position: 'absolute', right: -16, bottom: -20, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(100px,18vw,260px)', color: 'rgba(26,57,110,0.05)', lineHeight: 1, letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>MFS</div>

        <div className="wrap rsa-hero" style={{ position: 'relative', zIndex: 1 }}>
          {/* eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(20px,3vh,32px)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="#1a396e" /></svg>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>Responsabilidade Social · Grupo Omatapalo</span>
          </div>

          {/* Título full-width */}
          <h2 style={{ margin: '0 0 clamp(24px,4vh,40px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.4rem,5vw,5.5rem)', color: '#07101f', letterSpacing: '-0.05em', lineHeight: 0.83, textTransform: 'uppercase' }}>
            Missão Fazer<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2.5px rgba(7,16,31,0.15)' }}>Sorrir</span>
          </h2>

          {/* vídeo + citação lado a lado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px,2.5vw,32px)', alignItems: 'stretch', marginBottom: 'clamp(20px,3vw,36px)' }} className="rsa-hero-mid">
            {/* vídeo */}
            <div onClick={() => setVideoOpen(true)} style={{ position: 'relative', overflow: 'hidden', borderRadius: 3, minHeight: 'clamp(140px,18vw,240px)', cursor: 'pointer', background: '#0d1d35' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.ytimg.com/vi/kuVu9thTbIM/maxresdefault.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(7,16,31,0.1) 0%,rgba(7,16,31,0.65) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.95)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#07101f" style={{ marginLeft: 3 }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>RSE na Omatapalo</span>
              </div>
            </div>
            {/* citação */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
              <div>
                <div style={{ fontSize: 'clamp(2rem,3vw,3.5rem)', color: 'rgba(26,57,110,0.2)', fontFamily: 'Georgia, serif', lineHeight: 0.8, marginBottom: 10 }}>"</div>
                <blockquote style={{ margin: 0, padding: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.15vw,18px)', color: '#07101f', lineHeight: 1.75, fontStyle: 'italic' }}>
                  Para nós, a responsabilidade social começa na nossa casa e nas condições que damos aos nossos Colaboradores. É nesta matriz e nesta filosofia que assenta a nossa capacidade de fazer acontecer.
                </blockquote>
              </div>
              <div style={{ borderTop: '1px solid rgba(7,16,31,0.1)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.9vw,14px)', color: '#222936', lineHeight: 1.8 }}>
                  Num país onde existe pobreza e desigualdade, a OMATAPALO considera a responsabilidade social de extrema importância. A contribuição para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvida através da promoção e apoio em iniciativas de natureza social nos domínios da beneficência e solidariedade social.
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.9vw,14px)', color: '#222936', lineHeight: 1.8 }}>
                  Nesse sentido, a OMATAPALO abraça 4 dos 17 objectivos fixados pela ONU na Agenda 2030, como vectores para a sua participação activa nas perspetivas económicas, social e ambiental.
                </p>
              </div>
            </div>
          </div>

          {/* Faixa de 4 stats com cores ODS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(7,16,31,0.1)', paddingTop: 'clamp(16px,2.5vw,24px)' }}>
            {[
              { v: '720k+', l: 'Vidas Tocadas',      c: '#07101f', bc: 'rgba(26,57,110,0.5)'  },
              { v: '500k+', l: 'Sopas Distribuídas', c: '#DDA63A', bc: 'rgba(221,166,58,0.25)' },
              { v: '500k+', l: 'Merendas Escolares', c: '#4C9F38', bc: 'rgba(76,159,56,0.25)'  },
              { v: '11',    l: 'Iniciativas Activas',c: '#C5192D', bc: 'rgba(197,25,45,0.25)'  },
            ].map((s, i) => (
              <div key={i} style={{ paddingLeft: i > 0 ? 'clamp(16px,2.5vw,32px)' : 0, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,2.8rem)', color: s.c, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 5 }}>{s.v}</div>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#07101f' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── ODS TILES 2×2 ───────────────────────────────────────── */}
      <section style={{ background: '#F6F8FB', padding: 'clamp(56px,8vh,96px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(32px,4vw,48px)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="#1a396e" /></svg>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8' }}>Agenda 2030 · Seleccione um objectivo</span>
          </div>

          <div className="rsa-tiles" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px,2vw,20px)', marginBottom: active ? 'clamp(8px,1vw,16px)' : 0 }}>
            {ODS.map(o => {
              const isActive = active === o.key;
              return (
                <button
                  key={o.key}
                  className="rsa-tile"
                  onClick={() => selectOds(o.key)}
                  style={{
                    opacity: 0, appearance: 'none', textAlign: 'left', cursor: 'pointer',
                    background: isActive ? o.color : '#fff',
                    border: `1.5px solid ${isActive ? o.color : '#E8EDF3'}`,
                    borderRadius: 3,
                    padding: 'clamp(20px,3vw,32px)',
                    transition: 'background 0.25s, border-color 0.25s',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div aria-hidden style={{ position: 'absolute', right: -6, bottom: -10, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px,8vw,100px)', lineHeight: 1, color: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(26,57,110,0.04)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none' }}>
                    {String(o.num).padStart(2, '0')}
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(14px,2vw,20px)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.logo} alt={o.label} style={{ width: 'clamp(36px,4vw,52px)', height: 'clamp(36px,4vw,52px)', objectFit: 'cover', borderRadius: 6 }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? 'rgba(255,255,255,0.55)' : '#94A3B8', marginBottom: 4 }}>ODS {o.num}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.85rem,1.4vw,1.15rem)', color: isActive ? '#fff' : '#0F1A2E', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.05 }}>{o.label}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)', color: isActive ? 'rgba(255,255,255,0.65)' : '#475569', lineHeight: 1.75, margin: '0 0 clamp(14px,2vw,20px)' }}>{o.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 'clamp(16px,2.5vw,28px)' }}>
                        {o.totalDirecta > 0 && (
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem,1.5vw,1.4rem)', color: isActive ? '#fff' : o.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtNum(o.totalDirecta)}</div>
                            <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: isActive ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginTop: 3 }}>directas</div>
                          </div>
                        )}
                        {o.totalIndirecta && (
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem,1.5vw,1.4rem)', color: isActive ? 'rgba(255,255,255,0.55)' : '#94A3B8', letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtNum(o.totalIndirecta)}</div>
                            <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: isActive ? 'rgba(255,255,255,0.35)' : '#CBD5E1', marginTop: 3 }}>indirectas</div>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: isActive ? 'rgba(255,255,255,0.55)' : o.color }}>
                        {o.projects.length} projecto{o.projects.length > 1 ? 's' : ''}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* PROJECT PANEL */}
          {activeOds && (
            <div ref={projectsRef} style={{ background: '#fff', border: `1.5px solid ${activeOds.color}`, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ background: activeOds.color, padding: 'clamp(18px,2.5vw,28px) clamp(18px,3vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px,10vw,140px)', color: 'rgba(255,255,255,0.07)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{String(activeOds.num).padStart(2,'0')}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>ODS {activeOds.num} · Agenda 2030</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.1rem,2vw,2rem)', color: '#fff', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 0.95 }}>{activeOds.label}</div>
                </div>
                <button onClick={() => setActive(null)} style={{ appearance: 'none', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 2, width: 32, height: 32, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, position: 'relative' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {activeOds.projects.map((p, j) => (
                <div key={j} className="rsa-proj" style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 'clamp(14px,2.5vw,32px)', alignItems: 'center', padding: 'clamp(18px,2.5vw,28px) clamp(18px,3vw,32px)', borderTop: j > 0 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.7rem', color: activeOds.color, opacity: 0.6 }}>{String(j + 1).padStart(2, '0')}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.85rem,1.2vw,1.05rem)', color: '#0F1A2E', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.1 }}>{p.title}</div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.9vw,14px)', color: '#07101f', lineHeight: 1.75, margin: '0 0 6px', maxWidth: '70ch' }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#07101f' }}>{p.location}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#07101f' }}>Desde {p.since}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.directa && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem,1.5vw,1.4rem)', color: '#1a396e', letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtNum(p.directa)}</div>
                        <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#07101f', marginTop: 2 }}>directas</div>
                      </div>
                    )}
                    {p.indirecta && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.8rem,1.1vw,1rem)', color: '#1a396e', letterSpacing: '-0.03em', lineHeight: 1 }}>{fmtNum(p.indirecta)}</div>
                        <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#07101f', marginTop: 2 }}>indirectas</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DESPORTO / CDH — Opção C ────────────────────────────── */}
      <section style={{ background: '#07101f', position: 'relative', overflow: 'hidden' }}>

        {/* ── Hero CDH: foto full-bleed + overlay + cores CDH ── */}
        <div style={{ position: 'relative', minHeight: 'clamp(380px,52vw,600px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {/* foto de fundo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&q=75&auto=format&fit=crop" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          {/* overlay escuro verde */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(5,18,5,0.93) 0%, rgba(5,18,5,0.85) 45%, rgba(5,18,5,0.4) 100%)' }} />
          {/* logo CDH fantasma */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cdh.png" alt="" aria-hidden style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', height: 'clamp(260px,42vw,520px)', width: 'auto', opacity: 0.07, pointerEvents: 'none', userSelect: 'none' }} />

          <div className="wrap" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'center', paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 'clamp(48px,6vw,80px)' }}>
            <div>
              {/* badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(20px,2.8vw,32px)', background: 'rgba(200,16,46,0.18)', border: '1px solid rgba(200,16,46,0.35)', borderRadius: 2, padding: '7px 16px' }}>
                <div style={{ width: 7, height: 7, background: '#C8102E', borderRadius: '50%' }} />
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Desporto &amp; Comunidade · CDH</span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.4rem,5vw,6rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.87, textTransform: 'uppercase' }}>
                Construímos<br />mais do que<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.25)' }}>infra-estruturas.</span>
              </h2>
              {/* barras CDH */}
              <div style={{ display: 'flex', gap: 0, marginTop: 'clamp(18px,2.5vw,28px)', overflow: 'hidden', borderRadius: 2, width: 72, height: 4 }}>
                <div style={{ flex: 1, background: '#006633' }} />
                <div style={{ flex: 1, background: '#C8102E' }} />
                <div style={{ flex: 1, background: '#FFD700' }} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.05vw,16px)', color: '#fff', lineHeight: 1.9, margin: '0 0 clamp(20px,3vw,32px)', maxWidth: '44ch' }}>
                Através do apoio ao Clube Desportivo da Huíla, a Omatapalo reafirma o seu compromisso com o desenvolvimento do desporto angolano, investindo na formação de talentos, na promoção de valores positivos e na criação de oportunidades para as futuras gerações. Acreditamos que o desporto é uma poderosa ferramenta de inclusão social, educação e transformação das comunidades.
              </p>
            </div>
          </div>
        </div>

        {/* ── Conteúdo parceria CDH ── */}
        <div style={{ background: '#0d1a0d', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="wrap" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,72px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }} >

            {/* Esq: parceria + complexo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="rgba(255,255,255,0.3)" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Clube Desportivo da Huíla</span>
              </div>
              <h3 style={{ margin: '0 0 clamp(12px,1.5vw,18px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.2vw,2.4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95, textTransform: 'uppercase' }}>
                Apoio ao Desenvolvimento<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}>Desportivo</span>
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: '0 0 clamp(16px,2vw,22px)' }}>
                Enquanto patrocinadora do Clube Desportivo da Huíla, a Omatapalo desempenha um papel activo na valorização do desporto nacional e no fortalecimento do futebol na Região Sul de Angola.
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: '0 0 clamp(16px,2vw,22px)' }}>
                Um dos marcos desta parceria foi o apoio à construção do <strong style={{ color: '#fff', fontWeight: 700 }}>Complexo de Treino General de Exército Francisco Pereira Furtado</strong>, uma infra-estrutura moderna concebida para proporcionar melhores condições de preparação aos atletas, promover a excelência desportiva e contribuir para o crescimento sustentável do clube e da modalidade na província da Huíla.
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: 0 }}>
                Este investimento reflecte a visão da Omatapalo de gerar impacto positivo duradouro, apoiando iniciativas que promovem o desenvolvimento humano, social e desportivo das comunidades angolanas.
              </p>
            </div>

            {/* Dir: impacto */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="rgba(200,16,46,0.7)" /></svg>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Impacto da Parceria</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                {[
                  { cor: '#C8102E', titulo: 'Melhoria das condições de treino', desc: 'Instalações modernas que elevam o nível de preparação dos atletas.' },
                  { cor: '#006633', titulo: 'Desenvolvimento de jovens talentos', desc: 'Formação de uma nova geração de futebolistas angolanos com visão de futuro.' },
                  { cor: '#FFD700', titulo: 'Fortalecimento do desporto na Huíla', desc: 'Contribuição directa para o crescimento do ecossistema desportivo provincial.' },
                  { cor: '#C8102E', titulo: 'Promoção de valores', desc: 'Disciplina, trabalho em equipa e inclusão social como pilares do projecto.' },
                ].map(item => (
                  <div key={item.titulo} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 'clamp(14px,1.8vw,22px) 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 4, flexShrink: 0, alignSelf: 'stretch', background: item.cor, borderRadius: 1, minHeight: 48 }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(14px,1.1vw,17px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 6 }}>{item.titulo}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.9vw,14px)', color: '#fff', lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Galeria A: grid com lightbox ── */}
        {(() => {
          const photos = [
            { src: '/cdh-treino-1.jpg', thumb: '/cdh-treino-1.jpg', label: 'Formação Desportiva', big: true },
            { src: '/cdh-treino-2.jpg', thumb: '/cdh-treino-2.jpg', label: 'Treino' },
            { src: '/cdh-treino-3.jpg', thumb: '/cdh-treino-3.jpg', label: 'Plantel' },
            { src: '/cdh-treino-4.jpg', thumb: '/cdh-treino-4.jpg', label: 'Competição' },
            { src: '/cdh-treino-5.jpg', thumb: '/cdh-treino-5.jpg', label: 'CDH' },
          ];
          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 3 }} className="rsa-cdh-mosaic">
                {photos.map((p, i) => (
                  <div
                    key={i}
                    className="cdh-photo-cell"
                    style={{ gridRow: i === 0 ? '1 / 3' : undefined, position: 'relative', overflow: 'hidden', minHeight: i === 0 ? 'clamp(320px,38vw,520px)' : 'clamp(160px,19vw,260px)', cursor: 'pointer' }}
                    onClick={() => setLbIdx(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.thumb} alt={p.label} className="cdh-photo-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s ease, opacity 0.3s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,16,31,0.32)', transition: 'opacity 0.3s' }} className="cdh-photo-overlay" />
                    <div className="cdh-photo-plus" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(0)', width: 44, height: 44, background: 'rgba(255,255,255,0.92)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease', pointerEvents: 'none' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a396e" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                    <div className="cdh-photo-label" style={{ position: 'absolute', bottom: 'clamp(8px,1.2vw,14px)', left: 'clamp(8px,1.2vw,14px)', fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>{p.label}</div>
                    {i === 0 && (
                      <div style={{ position: 'absolute', bottom: 'clamp(14px,2vw,22px)', left: 'clamp(14px,2vw,22px)' }}>
                        <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>Formação desportiva</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.2vw,2.4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>+200<br />Atletas</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {lbIdx !== null && (
                <div onClick={() => setLbIdx(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                  <button onClick={() => setLbIdx(null)} style={{ position: 'absolute', top: 20, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
                  <button onClick={e => { e.stopPropagation(); setLbIdx((lbIdx - 1 + photos.length) % photos.length); }} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                  <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, maxHeight: '80vh', width: '100%', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[lbIdx].src} alt={photos[lbIdx].label} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 2 }} />
                    <div style={{ marginTop: 12, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', textAlign: 'center' }}>
                      {photos[lbIdx].label} · {lbIdx + 1}/{photos.length}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setLbIdx((lbIdx + 1) % photos.length); }} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                </div>
              )}
            </>
          );
        })()}

        {/* ── 4 métricas CDH ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#0a1a0a' }} className="rsa-cdh-cards">
          {[
            { v: '180', label: 'Atletas federados', desc: 'Atletas registados e em competição federada', accent: '#C8102E' },
            { v: '125', label: 'Em formação', desc: 'Jovens talentos nas camadas de formação do clube', accent: '#006633' },
            { v: '60', label: 'Atletas seniores', desc: 'Equipa sénior em competição de alto nível', accent: '#FFD700' },
            { v: 'CDH', label: 'Clube Desportivo da Huíla', desc: 'Parceria da Omatapalo com o emblema da Huíla', accent: '#C8102E' },
          ].map((item, i) => (
            <div key={item.label} style={{ padding: 'clamp(22px,2.8vw,36px) clamp(18px,2.2vw,28px)', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined, borderTop: '3px solid ' + item.accent }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem,2.8vw,3.2rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 10 }}>{item.v}</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.8vw,12px)', color: '#fff', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO LIGHTBOX ──────────────────────────────────────── */}
      {videoOpen && (
        <div onClick={() => setVideoOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setVideoOpen(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 900, aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden' }}>
            <iframe style={{ width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/kuVu9thTbIM?autoplay=1&rel=0&modestbranding=1" title="RSE Omatapalo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:900px) {
          .rsa-hero-grid,.rsa-cdh-grid { grid-template-columns:1fr !important; }
          .rsa-cta-grid { grid-template-columns:1fr !important; }
          .rsa-stats { grid-template-columns:repeat(3,1fr) !important; }
          .rsa-tiles { grid-template-columns:1fr !important; }
          .rsa-cdh-mosaic { grid-template-columns:1fr 1fr !important; }
          .rsa-cdh-cards { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:560px) {
          .rsa-stats { grid-template-columns:repeat(2,1fr) !important; }
          .rsa-cdh-mosaic { grid-template-columns:1fr !important; }
        }
        .cdh-photo-cell:hover .cdh-photo-img { transform: scale(1.06); opacity: 0.75; }
        .cdh-photo-cell:hover .cdh-photo-overlay { opacity: 0.6; }
        .cdh-photo-cell:hover .cdh-photo-plus { transform: translate(-50%,-50%) scale(1) !important; }
        .cdh-photo-cell:hover .cdh-photo-label { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

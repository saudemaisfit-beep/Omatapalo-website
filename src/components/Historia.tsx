'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Evento = { year: string; title: string; desc: string };

const DEFAULT_eventos: Evento[] = [
  { year: '2003', title: 'Fundação OMATAPALO', desc: 'A OMATAPALO - Engenharia e Construção, SA é fundada na cidade de Lubango, província do Huíla, fruto de uma união de esforços e vontade entre a empresa portuguesa de construção civil Carlos José Fernandes e Cª., com mais de 70 anos de experiência, e a CNS Norte.' },
  { year: '2004', title: 'Início de Actividade', desc: 'Ano em que a OMATAPALO inicia efectivamente a sua actividade em Angola, a partir da qual conheceu um forte crescimento e expansão nas suas áreas de actuação no sector de obras públicas e privadas.' },
  { year: '2005', title: 'Expansão para o Namibe', desc: 'O forte crescimento nas suas áreas de actuação levou à expansão para o Namibe, onde a OMATAPALO possui reservas permanentes de materiais, maquinaria, peças, combustível e outros elementos integrantes do processo de produção.' },
  { year: '2008', title: 'Construção da Sede', desc: 'Início da construção da Sede da OMATAPALO, no Lubango, com estaleiros, parques de máquinas e condomínio vocacionado para a habitação dos colaboradores.' },
  { year: '2009', title: 'OMATAPALO + SOCOLIL', desc: 'A OMATAPALO associou-se ao Grupo SOCOLIL, projectando a empresa para outro patamar de relacionamento e partilhando sinergias de um grupo empresarial consolidado.' },
  { year: '2010', title: 'Internacionalização', desc: 'Criação da OMATAPALO Namíbia — primeiro passo para a internacionalização — e fundação da EMADEL Carpintaria. Abertura da Delegação do Huambo.' },
  { year: '2011–12', title: 'Novas Delegações', desc: 'Abertura das delegações de Benguela, Bié, Cuando Cubango, Cuanza Sul e Malanje, consolidando a presença em todo o território nacional.' },
  { year: '2013', title: 'Grandes Obras Públicas', desc: 'Construção do Aeroporto do Namibe e três pavilhões multidesportivos em Luanda, Namibe e Malanje.' },
  { year: '2014', title: 'Diversificação do Grupo', desc: 'Entrada no imobiliário com a INVESTIMO e na energia com a ENERLINE. Expansão para a Lunda Norte e criação do Departamento Internacional.' },
  { year: '2015–16', title: 'Expansão Internacional', desc: 'Construção de grandes infraestruturas comerciais em Luanda, novo estaleiro na capital e Centralidade Nosso Zimbo no Lubango e Namibe.' },
  { year: '2017', title: 'Consolidação', desc: 'Infraestruturas integradas no Lubango, Monumento do Soldado Desconhecido em Luanda e Centralidade Nosso Zimbo de Benguela.' },
  { year: '2018', title: 'Obras Públicas', desc: 'Nova Circular do Lubango, Hospital Militar Principal em Luanda, Nova Sede do Lubango, Hospital Central e subestações do Projecto de Laúca.' },
  { year: '2019', title: 'Novos Projectos', desc: 'Construção da subestação da Bita, Barragem Calucuve no Cunene e Topside Namibe.' },
  { year: '2020', title: 'Grandes Obras', desc: 'Estrada Nacional 230 — EN230 (Malanje/Saurimo), Cefojor Huambo fase 2 e Reabilitação da Maternidade Irene Neto no Lubango.' },
  { year: '2021', title: 'Infraestruturas e Cultura', desc: 'EMADEL e METALOSUL em Luanda, Casa do Kwanza.' },
  { year: '2022', title: 'Energias Renováveis', desc: 'Hospital Pediátrico do Huambo, Nova Sede da Africell e Aproveitamento Hidroeléctrico Caculo Cabaça.' },
  { year: '2023', title: '20.º Aniversário', desc: 'Electrificação Rural do Sul de Angola, Parques Solares e Infraestruturas de acesso ao novo Aeroporto Internacional de Luanda.' },
  { year: '2024', title: 'Expansão e Sustentabilidade', desc: 'Adesão ao Pacto Global das Nações Unidas, inauguração do Flow Hotel em Benguela e Prémio FIB 2024 pelo segundo ano consecutivo.' },
  { year: '2025', title: 'Reconhecimento', desc: 'Inauguração da Casa do Kwanza pelo Presidente da República, abertura do Mumba Lodge e inauguração da Segunda Circular A3 que liga o novo Aeroporto ao Zango 8000, Complexo Hospitalar Pedro Maria Tonha "Pedalé", Estrada Nacional 230.' },
];

const VISIBLE = 3;

export default function Historia() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex]   = useState(0);
  const [active, setActive] = useState(0);
  const [eventos, setEventos] = useState<Evento[]>(DEFAULT_eventos);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'historia_eventos').single().then(({ data }) => {
      if (data?.value) { try { setEventos(JSON.parse(data.value)); } catch {} }
    });
  }, []);

  const max  = eventos.length - VISIBLE;
  const prev = () => { const ni = Math.max(0, index - 1); setIndex(ni); setActive(ni); };
  const next = () => { const ni = Math.min(max, index + 1); setIndex(ni); setActive(ni); };

  const visible = eventos.slice(index, index + VISIBLE);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        gsap.fromTo('.hist-hdr',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.hist-cards-wrap',
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        );
      });
    });
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      gsap.fromTo('.hist-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
      );
    });
  }, [index]);

  return (
    <section ref={sectionRef} id="historia" style={{ background: '#F6F8FB', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)', overflow: 'hidden' }}>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="hist-hdr" style={{ opacity: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(36px,5vw,56px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>História</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,4.5rem)', color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase' }}>
              22 Marcos<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Históricos</span>
            </h2>
          </div>

          {/* Counter + Nav */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginRight: 8 }}>
              {String(index + 1).padStart(2, '0')} — {String(Math.min(index + VISIBLE, eventos.length)).padStart(2, '0')} / {String(eventos.length).padStart(2, '0')}
            </span>
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Anterior"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: `1px solid ${index === 0 ? '#e2e8f0' : '#1a396e'}`,
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: index === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={index === 0 ? '#cbd5e1' : '#1a396e'} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              onClick={next}
              disabled={index >= max}
              aria-label="Próximo"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: 'none',
                background: index >= max ? '#f1f5f9' : '#1a396e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: index >= max ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={index >= max ? '#cbd5e1' : '#fff'} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="hist-cards-wrap" style={{ opacity: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,1.5vw,20px)' }} className="hist-grid">
            {visible.map((e, i) => {
              const isActive = active === index + i;
              return (
                <div
                  key={e.year}
                  className="hist-card"
                  onClick={() => setActive(index + i)}
                  style={{
                    background: '#fff',
                    border: `${isActive ? '1.5px' : '0.5px'} solid ${isActive ? '#1a396e' : '#e2e8f0'}`,
                    borderRadius: 6,
                    padding: 'clamp(20px,2.5vw,32px)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxShadow: isActive ? '0 12px 40px rgba(26,57,110,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
                    opacity: 0,
                  }}
                >
                  {/* Ghost year */}
                  <div style={{
                    position: 'absolute', top: -8, right: -4,
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'clamp(56px,7vw,88px)',
                    color: `rgba(26,57,110,${isActive ? 0.06 : 0.03})`,
                    letterSpacing: '-0.05em', lineHeight: 1,
                    pointerEvents: 'none', userSelect: 'none',
                    transition: 'color 0.3s',
                  }}>{e.year}</div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-label)', fontSize: 10,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: isActive ? '#1a396e' : '#94a3b8',
                      fontWeight: 700, marginBottom: 12,
                      transition: 'color 0.3s',
                    }}>{e.year}</div>

                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: 'clamp(0.9rem,1.3vw,1.15rem)',
                      color: isActive ? '#0F1A2E' : '#334155',
                      letterSpacing: '-0.02em', lineHeight: 1.15,
                      textTransform: 'uppercase',
                      marginBottom: 'clamp(12px,1.5vh,20px)',
                      transition: 'color 0.3s',
                    }}>{e.title}</div>

                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(12px,0.85vw,13px)',
                      color: isActive ? '#475569' : '#94a3b8',
                      lineHeight: 1.75, margin: 0,
                      transition: 'color 0.3s',
                    }}>{e.desc}</p>

                    <div style={{
                      marginTop: 'clamp(16px,2vh,24px)',
                      width: isActive ? 32 : 0,
                      height: 2,
                      background: '#1a396e',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 'clamp(20px,3vh,32px)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, height: 2, background: '#e2e8f0', borderRadius: 1, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((index + VISIBLE) / eventos.length) * 100}%`,
                background: '#1a396e',
                borderRadius: 1,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', whiteSpace: 'nowrap' }}>
              {Math.round(((index + VISIBLE) / eventos.length) * 100)}%
            </span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) { .hist-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .hist-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

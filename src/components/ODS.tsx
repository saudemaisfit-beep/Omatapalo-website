'use client';

import { useEffect, useRef } from 'react';

const ODS_ITEMS = [
  {
    num: '08',
    color: '#A21942',
    title: 'Trabalho Digno e\nCrescimento Económico',
    desc: 'Promover o crescimento económico sustentado, emprego pleno e trabalho digno para todos.',
  },
  {
    num: '09',
    color: '#F36D25',
    title: 'Indústria, Inovação\ne Infraestrutura',
    desc: 'Construir infraestruturas resilientes, promover a industrialização inclusiva e fomentar a inovação.',
  },
  {
    num: '11',
    color: '#F99D26',
    title: 'Cidades e Comunidades\nSustentáveis',
    desc: 'Tornar as cidades e comunidades humanas inclusivas, seguras, resilientes e sustentáveis.',
  },
  {
    num: '13',
    color: '#3F7E44',
    title: 'Acção Climática',
    desc: 'Tomar medidas urgentes para combater as alterações climáticas e os seus impactos.',
  },
];

type Props = {
  selectedODS?: string | null;
  onSelect?: (num: string) => void;
};

export default function ODS({ selectedODS = null, onSelect = () => {} }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        gsap.fromTo('.ods-header',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });

        gsap.fromTo('.ods-card',
          { opacity: 0, y: 60, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12,
            scrollTrigger: { trigger: '.ods-grid', start: 'top 82%', once: true } });

        gsap.fromTo('.ods-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } });

        gsap.fromTo('.ods-num',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.3,
            scrollTrigger: { trigger: '.ods-grid', start: 'top 82%', once: true } });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>

      <div className="ods-divider" style={{ height: '3px', background: 'var(--navy-950)', transformOrigin: 'left', transform: 'scaleX(0)' }} />

      <div className="wrap" style={{ padding: 'clamp(72px,9vw,120px) 0' }}>

        <div className="ods-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start', marginBottom: 'clamp(56px,7vw,96px)', opacity: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ width: '28px', height: '2px', background: 'var(--navy-950)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy-600)' }}>
                Agenda 2030 · ONU
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase',
              fontSize: 'clamp(1.8rem,3.2vw,3rem)', lineHeight: 0.95,
              letterSpacing: '-0.03em', color: 'var(--navy-950)', margin: 0,
            }}>
              Objectivos Globais<br />
              <em style={{ fontStyle: 'normal', color: 'var(--navy-600)' }}>de Desenvolvimento</em><br />
              Sustentável
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '4px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem,1.3vw,1.05rem)', lineHeight: 1.75, color: 'var(--navy-700)', margin: 0 }}>
              Num país onde existe pobreza e desigualdade, a OMATAPALO considera a responsabilidade social de extrema importância. A contribuição para a melhoria da qualidade de vida das pessoas e comunidades é desenvolvida através da promoção e apoio em iniciativas de natureza social nos domínios da beneficência e solidariedade social.
            </p>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,1.2vw,1rem)', lineHeight: 1.7, color: 'var(--navy-700)', margin: '0 0 clamp(32px,4vw,48px)' }}>
          Nesse sentido, a OMATAPALO abraça <strong style={{ color: 'var(--navy-950)' }}>4 dos 17 objectivos</strong> fixados pela ONU na Agenda 2030, como vectores para a sua participação activa nas perspectivas económica, social e ambiental.
          {selectedODS && (
            <> · <button onClick={() => onSelect(selectedODS)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy-500)', fontFamily: 'var(--font-body)', fontSize: 'inherit', textDecoration: 'underline' }}>
              ver todos os projectos
            </button></>
          )}
        </p>

        <div className="ods-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
          {ODS_ITEMS.map((o) => {
            const isSelected = selectedODS === o.num;
            return (
              <div
                key={o.num}
                className="ods-card"
                onClick={() => onSelect(o.num)}
                style={{
                  opacity: 0, borderRadius: '12px', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  cursor: 'pointer',
                  outline: isSelected ? `3px solid ${o.color}` : '1px solid rgba(0,0,0,0.06)',
                  outlineOffset: isSelected ? '2px' : '0px',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, outline 0.2s ease',
                  transform: isSelected ? 'translateY(-4px)' : '',
                  boxShadow: isSelected ? `0 16px 40px ${o.color}33` : '',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 48px ${o.color}22`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }
                }}
              >
                <div style={{ background: o.color, padding: 'clamp(28px,3.5vw,44px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="ods-num" style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(4rem,6vw,6rem)',
                      color: '#fff', lineHeight: 1, letterSpacing: '-0.04em', opacity: 0,
                    }}>
                      {o.num}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: '#fff', textAlign: 'right',
                    }}>
                      ODS
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase',
                    fontSize: 'clamp(0.85rem,1.2vw,1rem)', color: '#fff',
                    letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0, whiteSpace: 'pre-line',
                  }}>
                    {o.title}
                  </h3>
                </div>

                <div style={{ padding: 'clamp(20px,2.5vw,32px)', flex: 1, background: '#fff' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--navy-600)', margin: 0 }}>
                    {o.desc}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: o.color }} />
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: o.color }}>
                        A filtrar
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ height: '3px', background: o.color }} />
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '20px', height: '1px', background: 'var(--navy-300)' }} />
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--navy-400)' }}>
            Alinhados com os Objectivos de Desenvolvimento Sustentável das Nações Unidas — Agenda 2030
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ods-header { grid-template-columns: 1fr !important; }
          .ods-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .ods-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

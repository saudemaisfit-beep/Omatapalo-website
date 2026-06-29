'use client';

import { useEffect, useRef, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const DEFAULTS = {
  body_p1: 'Contando com mais de 15.000 colaboradores directos, a OMATAPALO possui no seu quadro técnico áreas de conhecimento relacionadas com a sua actividade.',
  body_p2: 'A empresa assenta a sua actuação em níveis de empenho, diligência na execução, responsabilidade na sua conduta, formando uma equipa pluridisciplinar capaz de conduzir processos, produzir resultados e garantir padrões de qualidade, cumprimento de prazos rigorosos, para uma sociedade que, cada vez mais, exige soluções mais céleres.',
  section_img: '/COLABORADORES ARMAZÉM (53) 1 (1).JPG',
  cta_link: '#contactos',
};

export default function Pessoas() {
  const sectionRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    createClient()
      .from('site_content')
      .select('field,value')
      .eq('page', 'pessoas')
      .in('field', ['body_p1', 'body_p2', 'section_img', 'cta_link'])
      .then(({ data }) => {
        if (data?.length) {
          const map: Record<string, string> = {};
          data.forEach(({ field, value }) => { map[field] = value; });
          setContent(prev => ({ ...prev, ...map }));
        }
      });
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        const elems = sectionRef.current.querySelectorAll('.reveal-p');
        gsap.fromTo(Array.from(elems), { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
      });
    });
  }, []);

  return (
    <section id="pessoas" className="section section--sunken" ref={sectionRef}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-9)', alignItems: 'center' }} className="split-grid">
          <div className="reveal-p" style={{ opacity: 0 }}>
            <div className="eyebrow">Pessoas</div>
            <h2 style={{
              margin: 'var(--space-4) 0 0',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(2rem,4vw,4.5rem)',
              color: '#0F1A2E', letterSpacing: '-0.035em', lineHeight: 0.92,
              textTransform: 'uppercase',
            }}>
              A nossa maior<br />obra são as<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,57,110,0.22)' }}>Pessoas</span>
            </h2>
            <p className="shead__lead" style={{ marginTop: 'var(--space-4)', color: '#1a1a1a' }}>
              {content.body_p1}
              <br /><br />
              {content.body_p2}
            </p>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <a href={content.cta_link} className="btn btn-ghost">
                Trabalhar connosco
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>

          <div className="reveal-p" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--gray-100)', opacity: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.section_img}
              alt="Equipa Omatapalo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:920px) { .split-grid { grid-template-columns: 1fr !important; gap: var(--space-7) !important; } }
      `}</style>
    </section>
  );
}

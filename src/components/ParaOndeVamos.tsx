'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const DEF = {
  titulo: 'Energias Renováveis.',
  corpo: 'A aposta nas Energias Renováveis representa um compromisso ambicioso, que inclui uma aceleração sem precedentes do nosso crescimento no sector, suportado pela nossa história de sucesso enquanto líderes da inovação. Não se trata apenas de levar energia às comunidades, mas sim de contribuir para que estas possam ter vidas mais sustentáveis, no presente e no futuro. Estamos a implementar medidas concretas para proteger o futuro da humanidade, começando com o objectivo de nos tornarmos numa empresa 100% verde. Comprometemo-nos a entregar energia limpa, e continuaremos a expandir o nosso portefólio nesse sentido.',
};

export default function ParaOndeVamos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = useState(DEF);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'para_onde_vamos_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        gsap.fromTo(sectionRef.current.querySelector('.pov-content'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="para-onde-vamos"
      style={{ background: '#F5F4F0', paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}
    >
      <div className="wrap">
        <div
          className="pov-content"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,6vw,100px)',
            alignItems: 'start',
            opacity: 0,
          }}
        >
          <div>
            <div className="eyebrow" style={{ justifyContent: 'flex-start', marginBottom: 'clamp(20px,3vh,32px)' }}>
              Para Onde Vamos
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(32px,5vw,64px)', color: 'var(--navy-950)',
              letterSpacing: '-0.03em', lineHeight: 0.95,
              textTransform: 'uppercase',
            }}>
              {data.titulo}
            </h2>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(15px,1.4vw,18px)',
            color: 'var(--navy-400)',
            lineHeight: 1.75,
            paddingTop: 'clamp(16px,2vh,28px)',
          }}>
            {data.corpo}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #para-onde-vamos .pov-content { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useReveal } from './useReveal';
import { createClient } from '@/lib/supabase/client';

const DEF = {
  headline: 'Mais de três décadas a construir Angola.',
  highlight: 'construir Angola',
  body: 'Das estradas que ligam províncias aos hospitais que salvam vidas — somos um grupo angolano de engenharia e construção, com braços operacionais na agroindústria, imobiliário, energia, hotelaria e indústria. Fazemos acontecer.',
};

export default function Manifesto() {
  const ref = useReveal<HTMLDivElement>();
  const [data, setData] = useState(DEF);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'manifesto_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  const parts = data.headline.split(data.highlight);

  return (
    <section id="grupo" className="section" style={{ paddingBlock: 'clamp(4rem,7vw,7rem)' }}>
      <div className="wrap" ref={ref}>
        <div className="eyebrow">O Grupo Omatapalo</div>
        <div
          className="manifesto-row"
          style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'var(--space-9)', alignItems: 'end', marginTop: 'var(--space-7)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '-0.015em', lineHeight: 1.04,
            fontSize: 'var(--text-display-lg)', color: 'var(--text-strong)', maxWidth: '16ch', margin: 0,
          }}>
            {parts[0]}<em style={{ fontStyle: 'normal', color: 'var(--brand)' }}>{data.highlight}</em>{parts[1] ?? ''}
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.65, color: 'var(--text-body)' }}>
            {data.body}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width:880px) {
          .manifesto-row { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
        }
      `}</style>
    </section>
  );
}

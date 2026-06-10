'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GeoIcon, GeoSquare } from './GeoDecor';

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(value); return; }
    const dur = 1800, start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  const fmt = count >= 1_000_000
    ? (count / 1_000_000).toFixed(1).replace('.', ',') + 'M'
    : count.toLocaleString('pt-PT');
  return <span ref={ref}>{prefix}{fmt}{suffix}</span>;
}

const big = [
  { v: 15000, s: '+', l: 'Colaboradores', sub: 'em Angola e em África' },
  { v: 1500000, s: ' m²', l: 'Área Construída', sub: 'edifícios e infraestrutura' },
  { v: 5000, s: '+ km', l: 'de Estrada', sub: 'pavimentada em Angola' },
];

const small = [
  { v: 8,    p: '+', l: 'Estações de Tratamento de Água' },
  { v: 2000, p: '+', l: 'Documentos de Gestão e Controlo' },
  { v: 12,   p: '+', l: 'Infraestruturas de Comunicação' },
  { v: 6,    p: '+', l: 'Energias Renováveis Integradas' },
  { v: 2000, p: '',  l: 'Habitações entregues' },
  { v: 600,  p: '',  l: 'Profissionais com formação superior' },
];

export default function FazemosAcontecer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} id="fazemos" aria-labelledby="fazemos-h" className="section bg-white relative overflow-hidden">

      {/* Geo decoration — top right */}
      <div className="absolute top-12 right-16 hidden xl:block pointer-events-none" aria-hidden="true">
        <GeoIcon size={100} color="var(--navy)" animated delay={0.3}
          className="opacity-[0.04]" />
      </div>
      <GeoSquare
        size={200} color="var(--navy)" rotate={45} delay={0.5}
        className="absolute -bottom-24 -right-24 opacity-[0.03] hidden xl:block pointer-events-none"
      />

      <div className="wrap relative z-10">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="max-w-2xl mb-20">
          <div className="eyebrow">
            <span className="eyebrow-bar" aria-hidden="true" />
            <span className="eyebrow-text">Os nossos números</span>
          </div>
          <h2 id="fazemos-h" className="t-h1 text-[var(--navy)]">Fazemos Acontecer</h2>
        </motion.div>

        {/* Big 3 stats */}
        <div role="list" aria-label="Principais indicadores" className="grid grid-cols-1 sm:grid-cols-3 gap-16 md:gap-20 mb-24">
          {big.map((s, i) => (
            <motion.div
              key={s.l}
              role="listitem"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              {/* Geo accent — small icon top-right of each stat */}
              {i === 0 && (
                <div className="absolute -top-2 right-0 opacity-10 hidden sm:block" aria-hidden="true">
                  <GeoIcon size={32} color="var(--navy)" />
                </div>
              )}
              <div className="font-black text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                <Counter value={s.v} suffix={s.s} />
              </div>
              <div className="font-bold text-[var(--text-1)] text-xl mb-1">{s.l}</div>
              <div className="t-sm text-[var(--text-3)]">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Divider with geo mark */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-px bg-[var(--surface-2)] mb-16 origin-left"
          aria-hidden="true"
        />

        {/* Secondary stats */}
        <div role="list" aria-label="Indicadores secundários" className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
          {small.map((s, i) => (
            <motion.div
              key={s.l}
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="group"
            >
              <div className="w-8 h-0.5 bg-[var(--surface-2)] group-hover:bg-[var(--navy)] transition-colors duration-300 mb-4" aria-hidden="true" />
              <div className="font-black text-[var(--navy)] text-3xl mb-2 group-hover:opacity-70 transition-opacity duration-250">
                <Counter value={s.v} prefix={s.p} />
              </div>
              <div className="t-sm text-[var(--text-3)] leading-snug">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Certs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center gap-6 mt-20 pt-16 border-t border-[var(--surface-2)]"
        >
          <span className="t-label text-[var(--text-3)]">Certificações:</span>
          {['ISO 9001', 'ISO 14001', 'ISO 45001', 'OHSAS 18001'].map(c => (
            <span key={c} className="font-bold text-[var(--navy)] t-sm px-4 py-2 border border-[var(--surface-2)]">{c}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

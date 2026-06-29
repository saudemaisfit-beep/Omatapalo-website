'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { GeoIcon } from './GeoDecor';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_ITEMS = [
  { v: 55, l: 'Estaleiros de Obras Activos' },
  { v: 8,  l: 'Centros de Betão' },
  { v: 1,  l: 'Plataforma de Produção de Cuba' },
  { v: 1,  l: 'Fábrica de Conexões' },
  { v: 3,  l: 'Fábricas de Cabo' },
  { v: 7,  l: 'Contratos de Betuminosos' },
  { v: 7,  l: 'Fábricas de Artefatos de Cimento' },
  { v: 6,  l: 'Instalações de Metalomecânica' },
  { v: 2,  l: 'Indústrias de Carpintaria' },
  { v: 1,  l: 'Laboratório de Ensaio de Materiais' },
];

function N({ v }: { v: number }) {
  const [c, setC] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setC(v); return; }
    const dur = 1400, t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setC(Math.round((1 - Math.pow(1 - p, 3)) * v));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, v]);
  return <span ref={ref} className="tabular-nums">{c}</span>;
}

export default function OQueProduzimos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'o_que_produzimos_cfg').single().then(({ data }) => {
      if (data?.value) try { setItems(JSON.parse(data.value)); } catch {}
    });
  }, []);

  return (
    <section ref={ref} id="producao" aria-labelledby="producao-h" className="relative overflow-hidden">

      {/* Full bleed image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1800&q=65&auto=format&fit=crop"
          alt="" fill className="object-cover" sizes="100vw" unoptimized
        />
        <div className="absolute inset-0 bg-[var(--navy-dark)]/92" />
      </div>

      {/* Geo decorations */}
      <div className="absolute bottom-12 right-16 hidden xl:block pointer-events-none" aria-hidden="true">
        <GeoIcon size={140} color="white" animated delay={0.6} className="opacity-[0.04]" />
      </div>

      <div className="relative z-10 section">
        <div className="wrap">

          {/* Heading */}
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
              <div className="eyebrow mb-6">
                <span className="eyebrow-bar" style={{ background: 'rgba(255,255,255,.25)' }} aria-hidden="true" />
                <span className="eyebrow-text" style={{ color: 'rgba(255,255,255,.45)' }}>Capacidade de Produção</span>
              </div>
              <h2 id="producao-h" className="t-h1 text-white">
                O Que Produzimos
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
              className="t-body-lg text-white/55 max-w-md"
            >
              Os Centros Industriais desenvolvem-se em torno da exploração de Pedreiras, Centros de Betão Hidráulico e Betuminoso.
            </motion.p>
          </div>

          {/* Stats grid — hover fills navy */}
          <div role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/[0.06]">
            {items.map((s, i) => (
              <motion.div
                key={s.l}
                role="listitem"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04 }}
                className="px-7 py-9 bg-[var(--navy-dark)]/70 group hover:bg-white/10 transition-colors duration-300"
              >
                {/* Tiny geo mark on first cell */}
                {i === 0 && (
                  <div className="mb-3 opacity-20" aria-hidden="true">
                    <GeoIcon size={16} color="white" />
                  </div>
                )}
                <div className="font-black text-white text-4xl leading-none mb-3">
                  <N v={s.v} />
                </div>
                <div className="t-sm text-white/45 group-hover:text-white/75 transition-colors duration-300 leading-snug">
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
            className="mt-14 flex justify-start"
          >
            <button className="btn btn-ghost-white">Conhecer Toda a Capacidade →</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

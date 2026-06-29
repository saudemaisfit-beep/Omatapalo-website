'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { GeoIcon } from './GeoDecor';

const DEF = {
  linha1: 'CONSTRUÍMOS',
  linha2: 'O SEU FUTURO',
  corpo: 'Com mais de 30 anos de história e 15.000 profissionais dedicados, estamos prontos para o seu próximo grande projecto.',
  btn1: 'Iniciar Projecto →',
  btn2: 'Ver Portfólio',
};

export default function ConstruimosFuturo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [data, setData] = useState(DEF);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'construimos_futuro_cfg').single().then(({ data: d }) => {
      if (d?.value) try { setData({ ...DEF, ...JSON.parse(d.value) }); } catch {}
    });
  }, []);

  const go = (id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} aria-label="Chamada para acção" className="relative overflow-hidden min-h-[600px] flex items-center bg-[var(--navy-dark)]">

      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=70&auto=format&fit=crop"
          alt="" fill className="object-cover" sizes="100vw" unoptimized
        />
        <div className="absolute inset-0 bg-[var(--navy-dark)]/88" />
      </div>

      {/* Geo decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={inView ? { opacity: 0.05, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <GeoIcon size={400} color="white" />
        </motion.div>
      </div>

      {/* Animated squares */}
      <motion.div
        initial={{ opacity: 0, rotate: 45 }}
        animate={inView ? { opacity: 0.04, rotate: 45 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-16 left-16 hidden lg:block pointer-events-none"
        style={{ width: 80, height: 80, border: '1px solid white' }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, rotate: 45 }}
        animate={inView ? { opacity: 0.03, rotate: 45 } : {}}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-16 right-16 hidden lg:block pointer-events-none"
        style={{ width: 60, height: 60, border: '1px solid white' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full py-24 md:py-36">
        {/* Geo icon above headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-10"
          aria-hidden="true"
        >
          <GeoIcon size={40} color="white" className="opacity-50" />
        </motion.div>

        <div className="text-center px-6">
          <div className="overflow-hidden mb-2">
            <motion.div
              initial={{ y: '100%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="t-hero text-white leading-none">{data.linha1}</h2>
            </motion.div>
          </div>
          <div className="overflow-hidden mb-14">
            <motion.div
              initial={{ y: '100%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="t-hero leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)', color: 'transparent' }}>
                {data.linha2}
              </h2>
            </motion.div>
          </div>

          {/* Thin line with geo dot */}
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-px bg-white/10 max-w-xl mx-auto mb-12 origin-center"
            aria-hidden="true"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55 }}
            className="t-body-xl text-white/55 max-w-lg mx-auto mb-10"
          >
            {data.corpo}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => go('#contactos')} className="btn btn-primary">{data.btn1}</button>
            <button onClick={() => go('#portfolio')} className="btn btn-ghost-white">{data.btn2}</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

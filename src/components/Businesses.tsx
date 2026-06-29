'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_BUSINESSES = [
  {
    num: '01', title: 'Engenharia & Construção',
    desc: 'Projetos de grande escala: edifícios, pontes, infraestruturas industriais e habitacionais. O coração e a identidade do Grupo.',
    img: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800&q=80&auto=format&fit=crop',
    tag: 'Core Business',
  },
  {
    num: '02', title: 'Obras Públicas',
    desc: 'Mais de 5.000 km de estradas pavimentadas. Barragens, pontes e infraestrutura crítica para o desenvolvimento nacional.',
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80&auto=format&fit=crop',
    tag: 'Infra-estruturas',
  },
  {
    num: '03', title: 'Imobiliário',
    desc: 'Prime Properties — desenvolvimento urbano premium com mais de 1.500.000 m² de espaço construído em Angola.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop',
    tag: 'Prime Properties',
  },
  {
    num: '04', title: 'Agroindústria',
    desc: 'Produção agrícola integrada, processamento e distribuição alimentar para garantir a soberania alimentar de Angola.',
    img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&auto=format&fit=crop',
    tag: 'Agro',
  },
  {
    num: '05', title: 'Minas & Recursos',
    desc: 'Drill Go — exploração responsável de recursos naturais com tecnologia de ponta e rigoroso foco ambiental.',
    img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80&auto=format&fit=crop',
    tag: 'Drill Go',
  },
  {
    num: '06', title: 'Pesca Industrial',
    desc: 'Pescaria Mormolo — frota moderna e infraestrutura de processamento para o mercado angolano e exportação.',
    img: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80&auto=format&fit=crop',
    tag: 'Mormolo',
  },
  {
    num: '07', title: 'Gestão Hoteleira',
    desc: 'Flow Hotel — hospitalidade de referência em Angola. Experiências únicas que acompanham o crescimento turístico.',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop',
    tag: 'Flow Hotel',
  },
  {
    num: '08', title: 'Indústria & Energia',
    desc: 'Metalosul e Investimo — fabrico de estruturas metálicas, energias renováveis e soluções industriais avançadas.',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop',
    tag: 'Energia',
  },
];

export default function Businesses() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [businesses, setBusinesses] = useState(DEFAULT_BUSINESSES);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'businesses_cfg').single().then(({ data }) => {
      if (data?.value) try { setBusinesses(JSON.parse(data.value)); } catch {}
    });
  }, []);

  return (
    <section id="negocios" ref={ref} className="section bg-[var(--dark)]">
      <div className="wrap">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-4 mb-6">
              <span className="divider-line" />
              <span className="label-sm text-[var(--brand-orange)]">Áreas de Negócio</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }} className="display-lg text-white">
              Um Grupo.<br /><span className="orange-gradient">Oito Forças.</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-[var(--gray-2)] text-base leading-relaxed lg:max-w-sm">
            Diversificação estratégica que garante solidez, resilência e capacidade de resposta
            às necessidades de Angola e do continente africano.
          </motion.p>
        </div>

        {/* ── Interactive split layout ── */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-0 border border-white/[0.06] overflow-hidden">
          {/* Left: list */}
          <div className="divide-y divide-white/[0.06]">
            {businesses.map((b, i) => (
              <motion.button
                key={b.num}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.04 }}
                onClick={() => setActive(i)}
                className={`w-full text-left px-7 py-5 flex items-center justify-between gap-4 transition-all duration-300 group cursor-none ${
                  active === i
                    ? 'bg-[var(--brand-navy)] border-l-4 border-[var(--brand-orange)]'
                    : 'bg-[var(--dark-3)] border-l-4 border-transparent hover:bg-[var(--dark-2)] hover:border-[var(--brand-orange)]/30'
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className={`font-mono text-xs font-bold transition-colors ${active === i ? 'text-[var(--brand-orange)]' : 'text-white/20 group-hover:text-white/40'}`}>
                    {b.num}
                  </span>
                  <div>
                    <div className={`text-sm font-bold transition-colors ${active === i ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                      {b.title}
                    </div>
                    <div className={`label-sm mt-0.5 transition-colors ${active === i ? 'text-[var(--brand-orange)]' : 'text-white/20'}`}>
                      {b.tag}
                    </div>
                  </div>
                </div>
                <span className={`transition-all duration-300 text-[var(--brand-orange)] ${active === i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>→</span>
              </motion.button>
            ))}
          </div>

          {/* Right: image+description */}
          <div className="relative min-h-[500px] lg:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={businesses[active].img}
                  alt={businesses[active].title}
                  fill className="object-cover"
                  sizes="(max-width:1024px) 100vw, 60vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-[#070B12]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B12]/30 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[var(--dark)]/80 backdrop-blur-sm border border-white/10 p-6"
                  >
                    <div className="label-sm text-[var(--brand-orange)] mb-2">{businesses[active].tag}</div>
                    <h3 className="text-white text-xl font-black mb-3">{businesses[active].title}</h3>
                    <p className="text-[var(--gray-2)] text-sm leading-relaxed">{businesses[active].desc}</p>
                    <button className="btn-primary mt-4 py-2.5 px-5 text-[0.65rem]">
                      Saber Mais →
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

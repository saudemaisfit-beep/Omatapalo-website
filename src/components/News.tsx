'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const FALLBACK = [
  {
    created_at: '2025-05-15', category: 'Construção',
    title: 'OMATAPALO vence Prémio FORTES de Responsabilidade Social na categoria de Engenharia e Construção',
    cover_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80&auto=format&fit=crop',
    excerpt: 'Reconhecimento pelo compromisso exemplar com o desenvolvimento social e ambiental nas comunidades onde opera.',
    slug: '',
  },
  {
    created_at: '2025-04-10', category: 'Energia',
    title: 'Projecto Energético do Grupo recebe financiamento do Impact Credit Fund',
    cover_image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&q=80&auto=format&fit=crop',
    excerpt: 'Investimento de $4 milhões para actividades da IEsolar OMATAPALO LU avança o portfólio de energias renováveis.',
    slug: '',
  },
  {
    created_at: '2025-03-02', category: 'Imobiliário',
    title: 'EMAEL reforça presença digital no sector da Madeira e Imobiliário',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80&auto=format&fit=crop',
    excerpt: 'Nova plataforma digital ao serviço de clientes e parceiros no sector da madeira e imobiliário angolano.',
    slug: '',
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function News() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    createClient()
      .from('posts')
      .select('title, slug, excerpt, cover_image, category, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setNews(data && data.length > 0 ? data : FALLBACK);
      });
  }, []);

  const items = news.length > 0 ? news : FALLBACK;

  return (
    <section ref={ref} id="media" aria-labelledby="media-h" className="section bg-[var(--surface)]">
      <div className="wrap">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="eyebrow mb-5">
              <span className="eyebrow-bar" aria-hidden="true" />
              <span className="eyebrow-text">Notícias</span>
            </motion.div>
            <motion.h2 id="media-h" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-h2 text-[var(--navy)]">
              Últimas Novidades
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
            <button className="btn btn-navy" aria-label="Ver todas as notícias">Ver Todas →</button>
          </motion.div>
        </div>

        {/* Cards */}
        <div role="list" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((n, i) => (
            <motion.article
              key={n.title}
              role="listitem"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white overflow-hidden hover:shadow-xl transition-shadow duration-400"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={n.cover_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80&auto=format&fit=crop'}
                  alt={`Imagem: ${n.title}`}
                  fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw" unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--orange)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350" aria-hidden="true" />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="tag tag-orange">{n.category}</span>
                  <time className="t-xs text-[var(--text-3)]">{fmtDate(n.created_at)}</time>
                </div>
                <h3 className="font-black text-[var(--navy)] text-xl leading-snug mb-4 line-clamp-3 group-hover:text-[var(--orange)] transition-colors duration-250">
                  {n.title}
                </h3>
                <p className="t-sm text-[var(--text-3)] line-clamp-3 mb-6">{n.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[var(--orange)] font-bold t-sm group-hover:gap-3 transition-all duration-250" aria-hidden="true">
                  Ler artigo <span>→</span>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

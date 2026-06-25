'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const FALLBACK = [
  { id: 'f1', cover_image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=72&auto=format&fit=crop', category: 'Saúde',           title: 'Centro Hospitalar de Referência',  location: 'Luanda',   year: 2023, description: '' },
  { id: 'f2', cover_image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=900&q=72&auto=format&fit=crop',  category: 'Vias de Comunicação', title: 'Corredor Rodoviário Norte',        location: 'Uíge',     year: 2022, description: '' },
  { id: 'f3', cover_image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=72&auto=format&fit=crop', category: 'Energia',          title: 'Parque Solar 66 ha',               location: 'Huíla',    year: 2024, description: '' },
  { id: 'f4', cover_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=72&auto=format&fit=crop', category: 'Habitação',         title: 'Complexo Habitacional',            location: 'Luanda',   year: 2023, description: '' },
  { id: 'f5', cover_image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=72&auto=format&fit=crop', category: 'Infra-estruturas', title: 'Estação de Tratamento de Água',    location: 'Benguela', year: 2022, description: '' },
  { id: 'f6', cover_image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=72&auto=format&fit=crop', category: 'Pontes e Viadutos', title: 'Ponte Sobre o Kwanza',            location: 'Kwanza Sul', year: 2021, description: '' },
];

const CAT_LABELS: Record<string, string> = {
  inst: 'Edifícios Institucionais', saude: 'Saúde', ensino: 'Ensino',
  habitacao: 'Habitação', recintos: 'Recintos', agro: 'Agricultura e Indústria',
  turismo: 'Turismo', vias: 'Vias de Comunicação', pontes: 'Pontes e Viadutos',
  infra: 'Infra-estruturas', oilgas: 'Oil & Gas', energia: 'Energia',
};

function label(cat: string) { return CAT_LABELS[cat] ?? cat; }

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    createClient()
      .from('portfolio_projects')
      .select('id, title, slug, category, location, year, cover_image, description')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setProjects(data && data.length >= 3 ? data : FALLBACK));
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        const elems = sectionRef.current.querySelectorAll('.reveal-pf');
        gsap.fromTo(Array.from(elems), { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
      });
    });
  }, [projects]);

  if (projects.length === 0) return null;

  const feature = projects[0];
  const rest = projects.slice(1);

  return (
    <section id="portefolio" className="section" ref={sectionRef}>
      <div className="wrap">
        <div className="head-row reveal-pf" style={{ opacity: 0 }}>
          <div className="shead">
            <div className="eyebrow">Portefólio</div>
            <h2 className="shead__title">Obra feita</h2>
            <p className="shead__lead">Projectos que mudam a paisagem e a vida de quem os usa.</p>
          </div>
          <Link href="/portefolio" className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }}>
            Ver todo o portefólio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        {/* Feature + grid */}
        <div className="pf-feature-grid reveal-pf" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)', opacity: 0 }}>
          <Link href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
            <Image src={feature.cover_image || FALLBACK[0].cover_image} alt={feature.title} fill className="object-cover pf-img" unoptimized />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 35%,rgba(7,16,31,0.92) 100%)' }} />
            <div className="absolute left-0 right-0 bottom-0 z-[2] p-6">
              <span className="tag tag--dark" style={{ marginBottom: 'var(--space-3)' }}>{label(feature.category)}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h3)', color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.05, margin: '0 0 6px' }}>{feature.title}</h3>
              <div style={{ fontSize: '13px', color: 'var(--navy-100)', display: 'flex', gap: '14px' }}>
                {feature.location && <span>{feature.location}</span>}
                {feature.year && <span>{feature.year}</span>}
              </div>
            </div>
          </Link>

          <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
            {rest.slice(0, 2).map((p) => (
              <Link key={p.id} href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
                <Image src={p.cover_image || FALLBACK[1].cover_image} alt={p.title} fill className="object-cover pf-img" unoptimized />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 35%,rgba(7,16,31,0.88) 100%)' }} />
                <div className="absolute left-0 right-0 bottom-0 z-[2] p-5">
                  <span className="tag tag--dark" style={{ marginBottom: 'var(--space-3)' }}>{label(p.category)}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h4)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.05, margin: '0 0 6px' }}>{p.title}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--navy-100)', display: 'flex', gap: '14px' }}>
                    {p.location && <span>{p.location}</span>}
                    {p.year && <span>{p.year}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        {rest.length > 2 && (
          <div className="reveal-pf" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-6)', opacity: 0 }}>
            {rest.slice(2).map(p => (
              <Link key={p.id} href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
                <Image src={p.cover_image || FALLBACK[3].cover_image} alt={p.title} fill className="object-cover pf-img" unoptimized />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 40%,rgba(7,16,31,0.88) 100%)' }} />
                <div className="absolute left-0 right-0 bottom-0 z-[2] p-4">
                  <span className="tag tag--dark" style={{ marginBottom: '8px' }}>{label(p.category)}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-sm)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 4px' }}>{p.title}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--navy-100)', display: 'flex', gap: '10px' }}>
                    {p.location && <span>{p.location}</span>}
                    {p.year && <span>{p.year}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="reveal-pf" style={{ textAlign: 'center', marginTop: 'var(--space-9)', opacity: 0 }}>
          <Link href="/portefolio" className="btn btn-primary">
            Ver todos os projectos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </div>

      <style>{`
        .pf-img { transition: transform 0.8s var(--ease-out); }
        .pf-card:hover .pf-img { transform: scale(1.06); }
        @media (max-width:820px) {
          .pf-feature-grid { grid-template-columns: 1fr !important; }
          .pf-feature-grid > a { aspect-ratio: 3/2 !important; }
        }
        @media (max-width:640px) {
          .pf-bottom-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

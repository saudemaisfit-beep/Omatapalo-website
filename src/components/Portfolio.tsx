'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PROJECTS = [
  { img: 'photo-1487958449943-2429e8be8625', cat: 'Edifícios', title: 'Centro Hospitalar de Referência', meta: ['Luanda', '2023', '48 000 m²'], feature: true },
  { img: 'photo-1545459720-aac8509eb02c', cat: 'Infra-estruturas', title: 'Corredor Rodoviário Norte', meta: ['Uíge', '320 km'] },
  { img: 'photo-1473341304170-971dccb5ac1e', cat: 'Energia', title: 'Parque Solar 66 ha', meta: ['Huíla', '2024'] },
  { img: 'photo-1504307651254-35680f356dfd', cat: 'Edifícios', title: 'Complexo Habitacional', meta: ['Luanda', '2 000 Hab.'] },
  { img: 'photo-1581094794329-c8112a89af12', cat: 'Água', title: 'Estação de Tratamento de Água', meta: ['Benguela', '2022'] },
  { img: 'photo-1590674899484-d5640e854abe', cat: 'Infra-estruturas', title: 'Ponte Sobre o Kwanza', meta: ['Kwanza Sul', '280 m'] },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  const feature = PROJECTS[0];
  const rest = PROJECTS.slice(1);

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
          {/* Feature card */}
          <Link href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
            <Image src={`https://images.unsplash.com/${feature.img}?w=1200&q=72&auto=format&fit=crop`} alt={feature.title} fill className="object-cover pf-img" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 35%,rgba(7,16,31,0.92) 100%)' }} />
            <div className="absolute left-0 right-0 bottom-0 z-[2] p-6">
              <span className="tag tag--dark" style={{ marginBottom: 'var(--space-3)' }}>{feature.cat}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h3)', color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.05, margin: '0 0 6px' }}>{feature.title}</h3>
              <div style={{ fontSize: '13px', color: 'var(--navy-100)', display: 'flex', gap: '14px' }}>
                {feature.meta.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </Link>

          {/* Right: 2×2 grid */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
            {/* Top: single wide */}
            <Link href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
              <Image src={`https://images.unsplash.com/${rest[0].img}?w=900&q=72&auto=format&fit=crop`} alt={rest[0].title} fill className="object-cover pf-img" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 35%,rgba(7,16,31,0.88) 100%)' }} />
              <div className="absolute left-0 right-0 bottom-0 z-[2] p-5">
                <span className="tag tag--dark" style={{ marginBottom: 'var(--space-3)' }}>{rest[0].cat}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h4)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.05, margin: '0 0 6px' }}>{rest[0].title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--navy-100)', display: 'flex', gap: '14px' }}>
                  {rest[0].meta.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </Link>

            {/* Bottom: single */}
            <Link href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
              <Image src={`https://images.unsplash.com/${rest[1].img}?w=900&q=72&auto=format&fit=crop`} alt={rest[1].title} fill className="object-cover pf-img" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 35%,rgba(7,16,31,0.88) 100%)' }} />
              <div className="absolute left-0 right-0 bottom-0 z-[2] p-5">
                <span className="tag tag--dark" style={{ marginBottom: 'var(--space-3)' }}>{rest[1].cat}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h4)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.05, margin: '0 0 6px' }}>{rest[1].title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--navy-100)', display: 'flex', gap: '14px' }}>
                  {rest[1].meta.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom row: 3 cards */}
        <div className="reveal-pf" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-6)', opacity: 0 }}>
          {rest.slice(2).map(p => (
            <Link key={p.img} href="/portefolio" className="pf-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--navy-900)', display: 'block', textDecoration: 'none' }}>
              <Image src={`https://images.unsplash.com/${p.img}?w=800&q=72&auto=format&fit=crop`} alt={p.title} fill className="object-cover pf-img" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,16,31,0) 40%,rgba(7,16,31,0.88) 100%)' }} />
              <div className="absolute left-0 right-0 bottom-0 z-[2] p-4">
                <span className="tag tag--dark" style={{ marginBottom: '8px' }}>{p.cat}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-sm)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 4px' }}>{p.title}</h3>
                <div style={{ fontSize: '12px', color: 'var(--navy-100)', display: 'flex', gap: '10px' }}>
                  {p.meta.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA bottom */}
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

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const NAV = [
  { t: 'O Grupo', href: '/omatapalo', sub: [
    { t: 'Omatapalo no Mundo', href: '/omatapalo#mundo' },
    { t: 'História', href: '/omatapalo' },
    { t: 'Conselho de Administração', href: '/omatapalo#conselho' },
  ]},
  { t: 'Portefólio', href: '/portefolio' },
  { t: 'Pessoas', href: '/pessoas' },
  { t: 'Sustentabilidade', href: '/sustentabilidade' },
  { t: 'Responsabilidade Social', href: '/responsabilidade-social', sub: [
    { t: 'Missão Fazer Sorrir', href: '/responsabilidade-social#missao' },
    { t: 'CDH', href: '/cdh' },
  ]},
  { t: 'Media', href: '#media' },
];

const ALL_PAGES = [
  { t: 'O Grupo', href: '#top' },
  { t: 'Omatapalo no Mundo', href: '/omatapalo#mundo' },
  { t: 'História', href: '/omatapalo' },
  { t: 'Conselho de Administração', href: '/omatapalo#conselho' },
  { t: 'Portefólio', href: '/portefolio' },
  { t: 'Pessoas', href: '/pessoas' },
  { t: 'CDH', href: '/cdh' },
  { t: 'Media', href: '#media' },
  { t: 'Sustentabilidade', href: '/sustentabilidade' },
  { t: 'Responsabilidade Social', href: '/responsabilidade-social' },
  { t: 'Missão Fazer Sorrir', href: '/responsabilidade-social#missao' },
  { t: 'Contactos', href: '/contactos' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* GSAP entrance */
  useEffect(() => {
    let gsap: typeof import('gsap').gsap | null = null;
    import('gsap').then(({ gsap: g }) => {
      gsap = g;
      if (headerRef.current) {
        g.fromTo(headerRef.current,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 }
        );
      }
    });
    return () => {};
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        id="top"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/10' : ''}`}
        style={{
          background: scrolled
            ? '#1a396e'
            : 'linear-gradient(180deg, rgba(7,16,31,0.55), rgba(7,16,31,0))',
          backdropFilter: scrolled ? 'none' : 'none',
          WebkitBackdropFilter: 'none',
          opacity: 0,
        }}
      >
        <div className="wrap flex items-center gap-6 h-20">
          <a href="/" aria-label="Omatapalo — início">
            <Image
              src="/logo/LOGO OMT 1.png"
              alt="Omatapalo"
              width={320}
              height={139}
              className="w-[140px] h-auto transition-opacity duration-300"
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 ml-auto h-full">
            {NAV.map((n) => (
              <div key={n.t} className="relative h-full flex items-center group">
                <a
                  href={n.href}
                  className="flex items-center gap-1 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors duration-200 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-sans)', color: '#ffffff' }}
                >
                  {n.t}
                  {n.sub && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:rotate-180">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </a>
                {/* Underline */}
                <span className="absolute bottom-[18px] left-0 w-0 h-[2px] bg-[var(--navy-300)] group-hover:w-full transition-all duration-300" />

                {n.sub && (
                  <div className="absolute top-full left-[-16px] min-w-[248px] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200"
                    style={{
                      background: 'rgba(7,16,31,0.45)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px',
                    }}>
                    {n.sub.map((s) => (
                      <a key={s.t} href={s.href}
                        className="block px-3.5 py-2.5 rounded text-[12px] font-semibold uppercase tracking-[0.08em] hover:bg-white/[0.07] transition-colors duration-150"
                        style={{ fontFamily: 'var(--font-sans)', color: '#ffffff' }}>
                        {s.t}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="/contactos"
              className="btn btn-ghost-white ml-2"
              style={{ height: '40px', paddingInline: '20px', fontSize: '13px' }}>
              Contactos
            </a>
          </nav>

          {/* Burger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className="lg:hidden ml-auto text-white p-2"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-[90] flex flex-col overflow-y-auto transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'var(--navy-950)', padding: 'clamp(20px,5vw,40px)' }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-12">
          <span className="text-white font-black uppercase" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '-0.02em' }}>OMATAPALO</span>
          <button onClick={() => setOpen(false)} aria-label="Fechar" className="text-white p-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col">
          {ALL_PAGES.map((p, i) => (
            <a
              key={p.t}
              href={p.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/10 hover:pl-2.5 transition-all duration-200 group"
            >
              <span
                className="font-black uppercase text-white group-hover:text-[var(--navy-200)] transition-colors"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4.4vw,34px)', letterSpacing: '-0.02em' }}>
                {p.t}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--navy-400)' }}>
                {String(i).padStart(2, '0')}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

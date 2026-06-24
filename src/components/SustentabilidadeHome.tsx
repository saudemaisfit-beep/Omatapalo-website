'use client';

import { useEffect, useRef } from 'react';

const PILLARS = [
  {
    n: '01', t: 'Ambiente',
    d: 'Energias renováveis, gestão de resíduos e compensação de carbono em todos os projectos.',
    stat: 60, statSuffix: ' ha', statLabel: 'inovação verde',
  },
  {
    n: '02', t: 'Social',
    d: 'Academia Omatapalo, apoio às comunidades e programas de saúde para os colaboradores.',
    stat: 3200, statSuffix: '+', statLabel: 'colaboradores formados',
  },
  {
    n: '03', t: 'Governança',
    d: 'Transparência, ética empresarial e adesão ao Pacto Global das Nações Unidas.',
    stat: 2008, statSuffix: '', statLabel: 'membro do Pacto Global',
  },
];

export default function SustentabilidadeHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const spinRef    = useRef<HTMLDivElement>(null);
  const ring1Ref   = useRef<SVGCircleElement>(null);
  const ring2Ref   = useRef<SVGCircleElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;

        /* entrance stagger */
        gsap.fromTo('.sus-reveal',
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
        );

        /* grow on entry */
        gsap.fromTo(imageRef.current,
          { scale: 0.2, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: 1.6,
            } }
        );

        /* scroll-driven rotation — down=CW, up=CCW */
        gsap.to(spinRef.current, {
          rotate: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        /* SVG rings draw in */
        const r1 = ring1Ref.current;
        const r2 = ring2Ref.current;
        if (r1 && r2) {
          const c1 = 2 * Math.PI * 160;
          const c2 = 2 * Math.PI * 190;
          gsap.fromTo(r1,
            { strokeDasharray: `0 ${c1}`, opacity: 0 },
            { strokeDasharray: `${c1 * 0.18} ${c1 * 0.82}`, opacity: 1, duration: 1.4, ease: 'power2.out',
              scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
          );
          gsap.fromTo(r2,
            { strokeDasharray: `0 ${c2}`, opacity: 0 },
            { strokeDasharray: `${c2 * 0.06} ${c2 * 0.94}`, opacity: 1, duration: 1.6, ease: 'power2.out', delay: 0.2,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
          );
        }

        /* count-up stats */
        sectionRef.current.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const target = parseFloat(el.getAttribute('data-count') || '0');
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target, duration: 2.2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate() {
              el.textContent = target < 100
                ? Math.round(proxy.val).toString()
                : Math.round(proxy.val).toLocaleString('pt-PT');
            },
          });
        });
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: '#07101f', overflow: 'hidden', position: 'relative',
        paddingTop: 'clamp(72px,10vh,120px)', paddingBottom: 'clamp(72px,10vh,120px)' }}
    >
      {/* radial glow behind image */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)',
        background: 'radial-gradient(circle, rgba(26,57,110,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* eyebrow */}
        <div className="sus-reveal" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(40px,6vw,72px)' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="rgba(255,255,255,0.3)" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
            Sustentabilidade
          </span>
        </div>

        {/* ── 3-column layout: text | image | pillars ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr clamp(280px,38vw,520px) 1fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'center' }} className="sus-3col">

          {/* LEFT: title + description */}
          <div className="sus-reveal" style={{ opacity: 0 }}>
            <h2 style={{
              margin: '0 0 clamp(20px,3vh,32px)', fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(1.8rem,3.2vw,4rem)', color: '#fff',
              letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase',
            }}>
              Construir<br />hoje,<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.22)' }}>preservar<br />amanhã</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: 0 }}>
              Acreditamos que o desenvolvimento só é verdadeiramente sustentável quando gera valor para as pessoas, para a economia e para o ambiente. É por isso que investimos continuamente em soluções energéticas renováveis e em práticas responsáveis que promovem um crescimento mais equilibrado e duradouro.
            </p>
          </div>

          {/* CENTRE: large rotating image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>

            {/* SVG rings */}
            <svg style={{ position: 'absolute', width: '130%', height: '130%', top: '-15%', left: '-15%', pointerEvents: 'none' }}
              viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <g style={{ animation: 'ring-cw 14s linear infinite', transformOrigin: '200px 200px' }}>
                <circle ref={ring1Ref} cx="200" cy="200" r="160"
                  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g style={{ animation: 'ring-ccw 22s linear infinite', transformOrigin: '200px 200px' }}>
                <circle ref={ring2Ref} cx="200" cy="200" r="190"
                  fill="none" stroke="rgba(26,57,110,0.7)" strokeWidth="1" strokeLinecap="round" />
              </g>
              {/* orbit dots */}
              <circle style={{ animation: 'ring-cw 14s linear infinite', transformOrigin: '200px 200px' }}
                cx="200" cy="40" r="4.5" fill="rgba(255,255,255,0.45)" />
              <circle style={{ animation: 'ring-ccw 22s linear infinite', transformOrigin: '200px 200px' }}
                cx="200" cy="10" r="3" fill="rgba(26,57,110,0.9)" />
            </svg>

            {/* outer grow wrapper */}
            <div ref={imageRef} style={{
              width: '100%', aspectRatio: '1',
              borderRadius: '50%',
              position: 'relative', zIndex: 1,
              boxShadow: '0 0 100px rgba(26,57,110,0.5), 0 0 200px rgba(26,57,110,0.2)',
            }}>
              {/* inner scroll-rotation div */}
              <div ref={spinRef} style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Sustentabilidade-omatapalo.png"
                  alt="Sustentabilidade Omatapalo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: pillars */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PILLARS.map((p, i) => (
              <div key={p.n} className="sus-reveal" style={{
                opacity: 0,
                paddingTop: 24, paddingBottom: 24,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: i === PILLARS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                {/* stat number */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'clamp(1.8rem,3vw,3.2rem)', color: '#fff',
                    letterSpacing: '-0.04em', lineHeight: 1,
                    display: 'flex', alignItems: 'baseline', gap: 4,
                  }}>
                    <span data-count={p.stat}>0</span>
                    <span style={{ fontSize: '0.4em', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                      {p.statSuffix}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', marginTop: 4 }}>
                    {p.statLabel}
                  </div>
                </div>

                <div style={{ paddingLeft: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.8rem,1vw,0.95rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {p.t}
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#fff', lineHeight: 1.65, margin: 0 }}>
                    {p.d}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes ring-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes ring-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @media (max-width: 900px) {
          .sus-3col { grid-template-columns: 1fr !important; }
          .sus-3col > div:nth-child(2) { order: -1; max-width: 320px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

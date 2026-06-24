'use client';

import { useEffect, useRef, useState } from 'react';

const ITEMS = [
  { value: 14,   label: 'Hospitais',          img: '/inauguracao.jpg'                      },
  { value: 5000, label: 'Estradas',            img: '/EN-230-omatapalo-2.jpg', thousands: true, suffix: 'km' },
  { value: 4,    label: 'Portos',             img: '/TOPSIDE NAMIBE.JPG'                   },
  { value: 6,    label: 'Linhas Alta Tensão', img: '/omatapalo-electrificacao.jpg'          },
  { value: 6,    label: 'Construções Esp.',   img: '/MINISTÉRIO DO PLANEAMENTO.JPG'        },
  { value: 10,   label: 'Escolas',            img: '/colegio-paula-frassinetti.jpg'        },
  { value: 2,    label: 'Aeroportos',         img: '/aeroporto-namibe.jpg'                 },
  { value: 3500, label: 'Equipamentos',       img: '/GRUA.jpg', thousands: true            },
  { value: 3,    label: 'Barragens',          img: '/barragem-calucuve.jpg'                },
  { value: 8,    label: 'ETAR',               img: '/etar-huila.jpg'                       },
  { value: 7,    label: 'Unidades Hoteleiras', img: '/FLOW HOTEL LUANDA AEROPORTO.jpeg'    },
  { value: 14,   label: 'Centrais Solares',   img: '/parquesolar.jpg'                      },
];

export default function GrandesNumeros() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!wrapperRef.current || !stripRef.current) return;

        /* header entrance */
        gsap.fromTo('.gn-header',
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 85%', once: true } }
        );

        /* horizontal strip */
        gsap.to(stripRef.current, {
          x: () => -(stripRef.current!.scrollWidth - window.innerWidth + 80),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        /* counters */
        wrapperRef.current.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const target = parseFloat(el.getAttribute('data-count') || '0');
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target, duration: 2.4, ease: 'power2.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', once: true },
            onUpdate() {
              const isK = el.getAttribute('data-thousands') === '1';
              el.textContent = isK
                ? Math.round(proxy.val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : Math.round(proxy.val).toString();
            },
          });
        });
      });
    });
  }, []);

  return (
    <>

      <div ref={wrapperRef} id="grandes-numeros" style={{ height: '250vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: '#1a396e', display: 'flex', flexDirection: 'column',
        }}>

          {/* subtle grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          {/* ── header ── */}
          <div className="gn-header" style={{ opacity: 0, flexShrink: 0, padding: 'clamp(48px,6vw,80px) clamp(32px,5vw,80px) 0', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <rect width="10" height="10" fill="#1a396e" />
              </svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                O Que Construímos
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <h2 style={{
                margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(2.4rem,5vw,5.5rem)', textTransform: 'uppercase',
                lineHeight: 0.9, letterSpacing: '-0.035em', color: '#fff',
              }}>
                Grandes<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>Números</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.8, maxWidth: 340, margin: 0, paddingBottom: 4 }}>
                Duas décadas de obras que marcaram Angola — saúde, educação, energia e infra-estrutura.
              </p>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: 'clamp(24px,3vw,40px) 0 0' }} />
          </div>

          {/* ── horizontal strip ── */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div
              ref={stripRef}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                paddingInline: 'clamp(32px,5vw,80px)',
                willChange: 'transform',
                height: '100%',
              }}
            >
              {ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    flexShrink: 0,
                    width: 'clamp(180px,18vw,260px)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: 'clamp(12px,1.5vw,20px)',
                    paddingRight: 'clamp(12px,1.5vw,20px)',
                    borderRight: i < ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    cursor: 'default',
                    overflow: 'hidden',
                  }}
                >
                  {/* background image revealed on hover */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt=""
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: hovered === i ? 1 : 0,
                      transition: 'opacity 0.4s ease, transform 0.6s ease',
                      transform: hovered === i ? 'scale(1)' : 'scale(1.08)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* dark overlay so text stays readable */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(7,16,31,0.6)',
                    opacity: hovered === i ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                  }} />

                  {/* content — sits above image */}
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

                    {/* big number */}
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: (item as any).thousands ? 'clamp(1.8rem,3.2vw,4rem)' : 'clamp(2rem,3.8vw,5rem)', color: '#fff',
                      letterSpacing: '-0.04em', lineHeight: 1,
                      display: 'flex', alignItems: 'baseline', justifyContent: 'center',
                      transition: 'transform .3s ease',
                      transform: hovered === i ? 'translateY(-4px)' : 'none',
                    }}>
                      <span style={{ fontSize: '0.35em', color: '#fff', fontWeight: 400, fontFamily: 'var(--font-sans)', marginRight: 2, marginBottom: 6 }}>+</span>
                      <span data-count={item.value} data-thousands={(item as any).thousands ? '1' : '0'}>
                        {(item as any).thousands
                          ? item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                          : item.value}
                      </span>
                      {(item as any).suffix && (
                        <span style={{ fontSize: '0.3em', color: '#fff', fontWeight: 400, fontFamily: 'var(--font-sans)', marginLeft: 4, marginBottom: 8 }}>{(item as any).suffix}</span>
                      )}
                    </div>

                    {/* label */}
                    <div style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', marginTop: 12, lineHeight: 1.5 }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

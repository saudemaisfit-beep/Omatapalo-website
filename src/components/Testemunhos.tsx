'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_ITEMS = [
  { quote: 'Sinto que contribuo não só para uma estrada ou um edifício, mas para o desenvolvimento da comunidade onde vivo. O Grupo Omatapalo dá-nos orgulho e motivação para fazer sempre mais e melhor.', name: 'Zulmira da Costa', role: 'Responsável de Apoio Administrativo', photo: 'https://omatapalo.com/wp-content/uploads/27.jpg' },
  { quote: 'Fui promovido depois de participar num programa interno de capacitação. Sinto que aqui há oportunidades reais de crescer e fazer a diferença.', name: 'Edmar Manuel', role: 'Director Executivo Administrativo', photo: 'https://omatapalo.com/wp-content/uploads/29.jpg' },
  { quote: 'Na obra onde trabalho, vejo diariamente como se preocupam com a nossa segurança e conforto. As formações que recebemos ajudaram-me a crescer, tanto na parte técnica, como pessoal.', name: 'João Freitas', role: 'Técnico de Segurança, Benguela', photo: 'https://omatapalo.com/wp-content/uploads/26.jpg' },
  { quote: 'Participei em acções de reflorestação promovidas pela empresa. Não é só construir, é também preservar. Isso dá sentido ao nosso trabalho.', name: 'José Avelino', role: 'Motorista, Malanje', photo: 'https://omatapalo.com/wp-content/uploads/28.jpg' },
];

const DURATION = 6000;

export default function Testemunhos() {
  const [ITEMS, setITEMS] = useState(DEFAULT_ITEMS);
  const [active, setActive] = useState(0);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'testemunhos_cfg').single().then(({ data }) => {
      if (data?.value) try { setITEMS(JSON.parse(data.value)); } catch {}
    });
  }, []);
  const [prev, setPrev] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  const goTo = (i: number) => {
    if (i === active || animating) return;
    setPrev(active);
    setAnimating(true);
    setActive(i);
    setProgress(0);
    startRef.current = Date.now();
    setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
  };

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        const next = (active + 1) % ITEMS.length;
        setPrev(active);
        setAnimating(true);
        setActive(next);
        setProgress(0);
        startRef.current = Date.now();
        setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, animating]);

  return (
    <section style={{ background: '#fff', paddingTop: 'clamp(80px,10vh,128px)', paddingBottom: 'clamp(80px,10vh,128px)', overflow: 'hidden' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(40px,6vw,64px)' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#1a396e" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a396e' }}>
            Vozes da nossa equipa
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(40px,6vw,88px)', alignItems: 'center' }} className="testi-grid">

          {/* Fotos empilhadas */}
          <div style={{ position: 'relative', aspectRatio: '3/4' }}>
            {ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? 'scale(1)' : i === prev ? 'scale(1.04)' : 'scale(0.97)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  zIndex: i === active ? 2 : i === prev ? 1 : 0,
                }}
              >
                <Image src={item.photo} alt={item.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(7,16,31,0.75) 100%)' }} />
                {/* Nome sobreposto na foto */}
                <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(18px,2vw,26px)', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#fff', marginTop: 4 }}>
                    {item.role}
                  </div>
                </div>
              </div>
            ))}

            {/* Contador de slides — canto superior direito */}
            <div style={{
              position: 'absolute', top: 20, right: 20, zIndex: 10,
              background: 'rgba(7,16,31,0.55)', backdropFilter: 'blur(6px)',
              borderRadius: '2px', padding: '6px 12px',
              fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', letterSpacing: '0.06em',
            }}>
              {String(active + 1).padStart(2, '0')} / {String(ITEMS.length).padStart(2, '0')}
            </div>
          </div>

          {/* Citação */}
          <div>
            {/* Aspas grandes */}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '96px', lineHeight: 0.8, color: '#1a396e', opacity: 0.1, marginBottom: 8, userSelect: 'none' }}>"</div>

            <div style={{ position: 'relative', minHeight: '180px' }}>
              {ITEMS.map((item, i) => (
                <p
                  key={i}
                  style={{
                    position: i === active ? 'relative' : 'absolute',
                    top: 0, left: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(17px,1.6vw,22px)',
                    color: '#1e293b',
                    lineHeight: 1.75,
                    fontStyle: 'italic',
                    margin: 0,
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? 'translateY(0)' : i === prev ? 'translateY(-12px)' : 'translateY(16px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    pointerEvents: i === active ? 'auto' : 'none',
                  }}
                >
                  {item.quote}
                </p>
              ))}
            </div>

            {/* Barra de progresso + navegação */}
            <div style={{ marginTop: 48 }}>
              {/* Progress bar */}
              <div style={{ height: 2, background: '#e2e8f0', borderRadius: 1, marginBottom: 28, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: '#1a396e',
                  width: `${progress * 100}%`,
                  transition: 'width 0.1s linear',
                }} />
              </div>

              {/* Thumbnails / dots */}
              <div style={{ display: 'flex', gap: 12 }}>
                {ITEMS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      position: 'relative',
                      width: 52, height: 52, padding: 0, border: 'none', cursor: 'pointer',
                      borderRadius: '2px', overflow: 'hidden',
                      outline: i === active ? '2px solid #1a396e' : '2px solid transparent',
                      outlineOffset: '2px',
                      transition: 'outline-color 0.2s, opacity 0.2s',
                      opacity: i === active ? 1 : 0.45,
                      flexShrink: 0,
                    }}
                    aria-label={item.name}
                  >
                    <Image src={item.photo} alt={item.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .testi-grid { grid-template-columns: 1fr !important; }
          .testi-grid > div:first-child { aspect-ratio: 4/3 !important; }
        }
      `}</style>
    </section>
  );
}

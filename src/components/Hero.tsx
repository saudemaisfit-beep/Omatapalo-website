'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { end: 30,      suffix: '+',    label: 'Anos de Experiência' },
  { end: 15000,   suffix: '+',    label: 'Colaboradores' },
  { end: 1500000, suffix: ' m²',  label: 'Área Construída' },
  { end: 5000,    suffix: '+ km', label: 'de Estrada' },
];

function AnimatedNumber({ end, suffix }: { end: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen.current) {
        seen.current = true;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(end); return; }
        const dur = 2000, t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, [end]);
  const fmt = val >= 1_000_000 ? (val/1_000_000).toFixed(1).replace('.',',')+' M'
    : val >= 1_000 ? val.toLocaleString('pt-PT') : String(val);
  return <span ref={ref} className="tabular-nums">{fmt}{suffix}</span>;
}

/* Geometric logo mark — animated SVG based on the brand icon */
function GeoMark({ size = 120, opacity = 0.12, delay = 0 }: { size?: number; opacity?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity, scale: 1, rotate: 0 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Outer frame — top-left L */}
        <path d="M8 8 L8 72 L22 72 L22 22 L72 22 L72 8 Z" fill="white" />
        {/* Outer frame — bottom-right L */}
        <path d="M92 92 L92 28 L78 28 L78 78 L28 78 L28 92 Z" fill="white" />
        {/* Inner square */}
        <rect x="40" y="40" width="20" height="20" fill="white" />
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const fadeOut    = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const geoScale   = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  const go = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

  return (
    <section
      ref={ref}
      aria-label="Grupo Omatapalo — Fazemos Acontecer"
      className="relative h-screen min-h-[680px] overflow-hidden bg-[var(--navy-dark)]"
    >
      {/* ── Video background ── */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 origin-center" aria-hidden="true">
        <video
          ref={videoRef} autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
          poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=60&auto=format&fit=crop"
        >
          <source src="/hero-construction.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-dark)] via-[var(--navy-dark)]/60 to-[var(--navy-dark)]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-dark)]/75 via-[var(--navy-dark)]/25 to-transparent" />
      </motion.div>

      {/* ── Geometric decorations ── */}
      <motion.div style={{ scale: geoScale }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large mark — top right */}
        <div className="absolute top-16 right-16 hidden lg:block">
          <GeoMark size={180} opacity={0.07} delay={1.0} />
        </div>
        {/* Medium mark — bottom right area */}
        <div className="absolute bottom-32 right-32 hidden xl:block">
          <GeoMark size={80} opacity={0.05} delay={1.2} />
        </div>
        {/* Animated rotating outline square */}
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.04, rotate: 45 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute top-1/2 right-20 -translate-y-1/2 hidden lg:block"
          style={{ width: 260, height: 260, border: '1px solid white' }}
        />
        <motion.div
          initial={{ opacity: 0, rotate: 45 }}
          animate={{ opacity: 0.03, rotate: 45 }}
          transition={{ duration: 2, delay: 1.0 }}
          className="absolute top-1/2 right-20 -translate-y-1/2 hidden lg:block"
          style={{ width: 200, height: 200, border: '1px solid white', marginLeft: 30, marginTop: 30 }}
        />
      </motion.div>

      {/* ── Left accent — vertical line with geo mark ── */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20 z-10" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        aria-hidden="true"
      >
        <div style={{ width: 3, height: 60, background: 'var(--navy)' }} />
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY, opacity: fadeOut }}
        className="absolute inset-0 z-10 flex flex-col justify-end wrap pb-10 md:pb-14"
      >
        {/* Spacer for fixed nav */}
        <div className="flex-1" />

        {/* Headline + eyebrow grouped together */}
        <div className="flex flex-col">
          {/* Eyebrow — directly above headline */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="eyebrow mb-5"
          >
            <span className="eyebrow-bar" style={{ background: 'rgba(255,255,255,0.4)' }} aria-hidden="true" />
            <span className="eyebrow-text" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Grupo Omatapalo · Angola · Desde 1994
            </span>
          </motion.div>
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.05, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="t-hero text-white"
            >
              FAZEMOS
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.div
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.05, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="t-hero block" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.22)', color: 'transparent' }}>
                ACONTECER
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="t-body-lg max-w-md mb-10"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Engenharia, Construção e Infraestrutura —<br />
            a transformar Angola há mais de três décadas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            <button onClick={() => go('#portfolio')} className="btn btn-primary">Ver Portfólio</button>
            <button onClick={() => go('#contactos')} className="btn btn-ghost-white">Falar Connosco</button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
        >
          <div className="h-px bg-white/10 mb-8" aria-hidden="true" />
          <div role="list" aria-label="Indicadores do Grupo Omatapalo" className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                role="listitem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45 + i * 0.08 }}
                className={`flex flex-col py-4 ${i < stats.length - 1 ? 'pr-8 md:border-r md:border-white/10' : ''} ${i > 0 ? 'md:px-8' : ''}`}
              >
                <span className="font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.8rem)', letterSpacing: '-0.03em' }}>
                  <AnimatedNumber end={s.end} suffix={s.suffix} />
                </span>
                <span className="t-label leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Mute button ── */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
        aria-label={muted ? 'Ativar som' : 'Desativar som'}
        className="absolute bottom-10 left-8 z-20 hidden md:flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          {muted
            ? <path d="M23 9l-6 6M17 9l6 6" strokeLinecap="round" />
            : <><path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" /></>
          }
        </svg>
        <span className="t-label" style={{ color: 'inherit' }}>{muted ? 'Som off' : 'Som on'}</span>
      </motion.button>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
        className="absolute bottom-10 right-10 z-10 hidden lg:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <motion.div
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 52, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', transformOrigin: 'top' }}
        />
        <span className="t-label" style={{ color: 'rgba(255,255,255,0.2)', writingMode: 'vertical-rl' }}>scroll</span>
      </motion.div>
    </section>
  );
}

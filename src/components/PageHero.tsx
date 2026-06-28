'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type PageHeroProps = {
  title: string;
  imgSrc: string;
  eyebrow?: string;
  position?: string;
  outlineWord?: string;
  imgOpacity?: number;
  page?: string;
};

export default function PageHero({ title, imgSrc, eyebrow, position = 'center', outlineWord, imgOpacity = 0.18, page }: PageHeroProps) {
  const [dynamicImg, setDynamicImg] = useState(imgSrc);

  useEffect(() => {
    if (!page) return;
    createClient().from('site_content').select('value').eq('page', page).eq('field', 'hero_img').single()
      .then(({ data }) => { if (data?.value) setDynamicImg(data.value); });
  }, [page]);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo('.ph-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 });
        gsap.fromTo('.ph-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.05 });
      });
    });
  }, []);

  const words = title.trim().split(/\s+/);
  const lastWord = outlineWord ?? words[words.length - 1];
  const firstWords = words.slice(0, -1).join(' ');

  return (
    <section style={{ position: 'relative', height: 'clamp(420px,55vw,640px)', overflow: 'hidden', background: '#1a396e' }}>

      {/* Photo layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dynamicImg}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: position,
          opacity: imgOpacity,
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #1a396e 0%, rgba(26,57,110,0.6) 50%, rgba(26,57,110,0.3) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(40px,6vw,80px) clamp(24px,6vw,96px)',
      }}>
        <div className="ph-eyebrow" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" fill="#fff" /></svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
            {eyebrow ?? 'Grupo Omatapalo'}
          </span>
        </div>

        <h1 className="ph-title" style={{
          opacity: 0,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '-0.035em',
          fontSize: 'clamp(1.5rem,5.5vw,6rem)', lineHeight: 0.92,
          color: '#fff', margin: 0,
        }}>
          {firstWords && <>{firstWords}<br /></>}
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.25)' }}>
            {lastWord}
          </span>
        </h1>
      </div>
    </section>
  );
}

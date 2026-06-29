'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

type Asset = { id: number; title: string; description: string; download_url: string; sort_order: number };

const FALLBACK: Asset[] = [
  { id: 1, title: 'LOGOTIPO',        description: 'Logotipos em formatos de vetor e imagem (pixel), para web (RGB) e para impressão (CMYK + Spot Colors)', download_url: '', sort_order: 1 },
  { id: 2, title: 'LOGOTIPO PRINT',  description: 'Logótipos em formatos vetoriais e de imagem (pixel) para impressão em CMYK e Cores Directas (Spot Colors).', download_url: '', sort_order: 2 },
  { id: 3, title: 'LOGOTIPO WEB',    description: 'Logótipos em formatos vetoriais e de imagem (pixel), para web (RGB) e para impressão (CMYK e Cores Directas).', download_url: '', sort_order: 3 },
  { id: 4, title: 'PACK DE IMAGENS', description: 'Imagens oficiais do Grupo Omatapalo para uso da imprensa', download_url: '', sort_order: 4 },
  { id: 5, title: 'FOTOS DE EVENTOS',description: 'Grupo Omatapalo Partners eventos 2024', download_url: '', sort_order: 5 },
  { id: 6, title: 'PALETA DE CORES', description: 'Use-a corretamente em cada mídia para manter a imagem profissional.', download_url: '', sort_order: 6 },
];

function DownloadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#1a396e" />
      <path d="M16 9v10M11 19l5 5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="25" x2="22" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function IdentidadeVisual() {
  const [assets, setAssets] = useState<Asset[]>(FALLBACK);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    createClient()
      .from('brand_assets')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setAssets(data); });
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        gsap.fromTo('.iv-card',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
      });
    });
  }, [assets]);

  return (
    <section ref={sectionRef} style={{ background: '#f6f8fb', paddingTop: 'clamp(64px,9vh,112px)', paddingBottom: 'clamp(72px,10vh,120px)' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ marginBottom: 'clamp(32px,5vw,56px)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', color: '#0F1A2E', letterSpacing: '-0.02em', margin: '0 0 20px' }}>
            Press Kit
          </h2>
          <p style={{ fontSize: 'clamp(14px,1.1vw,16px)', color: '#374151', lineHeight: 1.8, maxWidth: 860, margin: '0 0 12px' }}>
            Para assegurar a correcta aplicação do nosso logotipo é essencial baixá-lo nas versões com o perfil de cores adequado a cada tipo de trabalho. Seja para impressões de alta qualidade ou para uso digital, o uso correcto das cores garante que a nossa marca seja representada de maneira uniforme e profissional.
          </p>
          <p style={{ fontSize: 'clamp(14px,1.1vw,16px)', color: '#1a396e', lineHeight: 1.8, maxWidth: 860, margin: 0, fontWeight: 600 }}>
            Faça o download dos arquivos nas versões correcta e contribua para Manter a integridade da nossa Press Kit.
          </p>
        </div>

        {/* Grid */}
        <div className="iv-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              className="iv-card"
              style={{ opacity: 0, background: '#fff', borderRadius: 8, padding: '40px 36px 44px', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative', boxShadow: '0 1px 4px rgba(26,57,110,0.07)' }}
            >
              {asset.download_url ? (
                <a
                  href={asset.download_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Download ${asset.title}`}
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                >
                  <DownloadIcon />
                </a>
              ) : (
                <div style={{ opacity: 0.4 }}><DownloadIcon /></div>
              )}

              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.75rem,1vw,0.9rem)', color: '#1a396e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {asset.title}
                </div>
                {asset.description && (
                  <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{asset.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{`
        @media (max-width: 760px) { .iv-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 761px) and (max-width: 1024px) { .iv-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

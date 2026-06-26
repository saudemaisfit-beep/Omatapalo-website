'use client';

import { useState } from 'react';

export default function CDH() {
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const photos = [
    { src: '/cdh-treino-1.jpg', thumb: '/cdh-treino-1.jpg', label: 'Formação Desportiva' },
    { src: '/cdh-treino-2.jpg', thumb: '/cdh-treino-2.jpg', label: 'Treino' },
    { src: '/cdh-treino-3.jpg', thumb: '/cdh-treino-3.jpg', label: 'Plantel' },
    { src: '/cdh-treino-4.jpg', thumb: '/cdh-treino-4.jpg', label: 'Competição' },
    { src: '/cdh-treino-5.jpg', thumb: '/cdh-treino-5.jpg', label: 'CDH' },
  ];

  return (
    <section style={{ background: '#07101f', position: 'relative', overflow: 'hidden' }}>

      {/* ── Hero CDH ── */}
      <div style={{ position: 'relative', minHeight: 'clamp(380px,52vw,600px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&q=75&auto=format&fit=crop" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(5,18,5,0.93) 0%, rgba(5,18,5,0.85) 45%, rgba(5,18,5,0.4) 100%)' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-cdh.png" alt="" aria-hidden style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', height: 'clamp(260px,42vw,520px)', width: 'auto', opacity: 0.07, pointerEvents: 'none', userSelect: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'center', paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 'clamp(48px,6vw,80px)' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(20px,2.8vw,32px)', background: 'rgba(200,16,46,0.18)', border: '1px solid rgba(200,16,46,0.35)', borderRadius: 2, padding: '7px 16px' }}>
              <div style={{ width: 7, height: 7, background: '#C8102E', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Desporto &amp; Comunidade · CDH</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.4rem,5vw,6rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.87, textTransform: 'uppercase' }}>
              Construímos<br />mais do que<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.25)' }}>infra-estruturas.</span>
            </h2>
            <div style={{ display: 'flex', gap: 0, marginTop: 'clamp(18px,2.5vw,28px)', overflow: 'hidden', borderRadius: 2, width: 72, height: 4 }}>
              <div style={{ flex: 1, background: '#006633' }} />
              <div style={{ flex: 1, background: '#C8102E' }} />
              <div style={{ flex: 1, background: '#FFD700' }} />
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.05vw,16px)', color: '#fff', lineHeight: 1.9, margin: '0 0 clamp(20px,3vw,32px)', maxWidth: '44ch' }}>
              Através do apoio ao Clube Desportivo da Huíla, Grupo Omatapalo reafirma o seu compromisso com o desenvolvimento do desporto angolano, investindo na formação de talentos, na promoção de valores positivos e na criação de oportunidades para as futuras gerações. Acreditamos que o desporto é uma poderosa ferramenta de inclusão social, educação e transformação das comunidades.
            </p>
          </div>
        </div>
      </div>

      {/* ── Conteúdo parceria CDH ── */}
      <div style={{ background: '#0d1a0d', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,72px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="rgba(255,255,255,0.3)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Clube Desportivo da Huíla</span>
            </div>
            <h3 style={{ margin: '0 0 clamp(12px,1.5vw,18px)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.2vw,2.4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95, textTransform: 'uppercase' }}>
              Apoio ao Desenvolvimento<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}>Desportivo</span>
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: '0 0 clamp(16px,2vw,22px)' }}>
              Enquanto patrocinadora do Clube Desportivo da Huíla, a Omatapalo desempenha um papel activo na valorização do desporto nacional e no fortalecimento do futebol na Região Sul de Angola.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: '0 0 clamp(16px,2vw,22px)' }}>
              Um dos marcos desta parceria foi o apoio à construção do <strong style={{ color: '#fff', fontWeight: 700 }}>Complexo de Treino General de Exército Francisco Pereira Furtado</strong>, uma infra-estrutura moderna concebida para proporcionar melhores condições de preparação aos atletas, promover a excelência desportiva e contribuir para o crescimento sustentável do clube e da modalidade na província da Huíla.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1vw,15px)', color: '#fff', lineHeight: 1.85, margin: 0 }}>
              Este investimento reflecte a visão da Omatapalo de gerar impacto positivo duradouro, apoiando iniciativas que promovem o desenvolvimento humano, social e desportivo das comunidades angolanas.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="rgba(200,16,46,0.7)" /></svg>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Impacto da Parceria</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              {[
                { cor: '#C8102E', titulo: 'Melhoria das condições de treino', desc: 'Instalações modernas que elevam o nível de preparação dos atletas.' },
                { cor: '#006633', titulo: 'Desenvolvimento de jovens talentos', desc: 'Formação de uma nova geração de futebolistas angolanos com visão de futuro.' },
                { cor: '#FFD700', titulo: 'Fortalecimento do desporto na Huíla', desc: 'Contribuição directa para o crescimento do ecossistema desportivo provincial.' },
                { cor: '#C8102E', titulo: 'Promoção de valores', desc: 'Disciplina, trabalho em equipa e inclusão social como pilares do projecto.' },
              ].map(item => (
                <div key={item.titulo} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 'clamp(14px,1.8vw,22px) 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width: 4, flexShrink: 0, alignSelf: 'stretch', background: item.cor, borderRadius: 1, minHeight: 48 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(14px,1.1vw,17px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 6 }}>{item.titulo}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.9vw,14px)', color: '#fff', lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Galeria com lightbox ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 3 }} className="rsa-cdh-mosaic">
        {photos.map((p, i) => (
          <div
            key={i}
            className="cdh-photo-cell"
            style={{ gridRow: i === 0 ? '1 / 3' : undefined, position: 'relative', overflow: 'hidden', minHeight: i === 0 ? 'clamp(320px,38vw,520px)' : 'clamp(160px,19vw,260px)', cursor: 'pointer' }}
            onClick={() => setLbIdx(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.thumb} alt={p.label} className="cdh-photo-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s ease, opacity 0.3s ease' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,16,31,0.32)', transition: 'opacity 0.3s' }} className="cdh-photo-overlay" />
            <div className="cdh-photo-plus" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(0)', width: 44, height: 44, background: 'rgba(255,255,255,0.92)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease', pointerEvents: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a396e" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            {i === 0 && (
              <div style={{ position: 'absolute', bottom: 'clamp(14px,2vw,22px)', left: 'clamp(14px,2vw,22px)' }}>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>Formação desportiva</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,2.2vw,2.4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>+200<br />Atletas</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lbIdx !== null && (
        <div onClick={() => setLbIdx(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setLbIdx(null)} style={{ position: 'absolute', top: 20, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
          <button onClick={e => { e.stopPropagation(); setLbIdx((lbIdx - 1 + photos.length) % photos.length); }} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, maxHeight: '80vh', width: '100%', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lbIdx].src} alt={photos[lbIdx].label} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 2 }} />
            <div style={{ marginTop: 12, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', textAlign: 'center' }}>
              {photos[lbIdx].label} · {lbIdx + 1}/{photos.length}
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); setLbIdx((lbIdx + 1) % photos.length); }} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      )}

      {/* ── 4 métricas CDH ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#0a1a0a' }} className="rsa-cdh-cards">
        {[
          { v: '180', label: 'Atletas federados', desc: 'Atletas registados e em competição federada', accent: '#C8102E' },
          { v: '125', label: 'Em formação', desc: 'Jovens talentos nas camadas de formação do clube', accent: '#006633' },
          { v: '60', label: 'Atletas seniores', desc: 'Equipa sénior em competição de alto nível', accent: '#FFD700' },
          { v: 'CDH', label: 'Clube Desportivo da Huíla', desc: 'Parceria da Omatapalo com o emblema da Huíla', accent: '#C8102E' },
        ].map((item, i) => (
          <div key={item.label} style={{ padding: 'clamp(22px,2.8vw,36px) clamp(18px,2.2vw,28px)', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined, borderTop: '3px solid ' + item.accent }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem,2.8vw,3.2rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 10 }}>{item.v}</div>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.8vw,12px)', color: '#fff', lineHeight: 1.65 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width:900px) {
          .rsa-cdh-mosaic { grid-template-columns:1fr 1fr !important; }
          .rsa-cdh-cards { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:560px) {
          .rsa-cdh-mosaic { grid-template-columns:1fr !important; }
        }
        .cdh-photo-cell:hover .cdh-photo-img { transform: scale(1.06); opacity: 0.75; }
        .cdh-photo-cell:hover .cdh-photo-overlay { opacity: 0.6; }
        .cdh-photo-cell:hover .cdh-photo-plus { transform: translate(-50%,-50%) scale(1) !important; }
        .cdh-photo-cell:hover .cdh-photo-label { opacity: 1 !important; }
      `}</style>
    </section>
  );
}

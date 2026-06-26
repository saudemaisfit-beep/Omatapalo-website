'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type SubItem = { label: string; href: string };
type NavItem = { label: string; href: string; sub?: SubItem[] };
type FooterLink = { t: string; href: string };
type FooterCol  = { h: string; links: FooterLink[] };

const DEFAULT_NAV: NavItem[] = [
  { label: 'O Grupo', href: '/omatapalo', sub: [
    { label: 'Omatapalo no Mundo', href: '/omatapalo#mundo' },
    { label: 'História', href: '/omatapalo' },
    { label: 'Conselho de Administração', href: '/omatapalo#conselho' },
  ]},
  { label: 'Portefólio', href: '/portefolio' },
  { label: 'Pessoas', href: '/pessoas' },
  { label: 'Sustentabilidade', href: '/sustentabilidade' },
  { label: 'R.Social', href: '/responsabilidade-social', sub: [
    { label: 'Missão Fazer Sorrir', href: '/responsabilidade-social#missao' },
  ]},
  { label: 'CDH', href: '/cdh' },
  { label: 'Media', href: '#', sub: [
    { label: 'Notícias', href: '/noticias' },
  ]},
  { label: 'Press Kit', href: '/identidade-visual' },
];

const btn = (active = false) => ({
  padding: '8px 20px', borderRadius: 3, border: 'none', cursor: 'pointer', fontSize: 12,
  fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
  background: active ? '#1a396e' : '#f1f5f9', color: active ? '#fff' : '#374151',
});

const DEFAULT_TICKER = ['Engenharia', 'Construção', 'Infra-estruturas', 'Mineração', 'Energia', 'Gestão Hoteleira', 'Agro-negócio', 'Imobiliário', 'Transporte', 'Pescas', 'Indústria'];

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<'menu' | 'logo' | 'favicon' | 'ticker' | 'video' | 'socials' | 'footer'>('menu');
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [logoUrl, setLogoUrl] = useState('/logo/LOGO OMT 1.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  const [tickerItems, setTickerItems] = useState<string[]>(DEFAULT_TICKER);
  const [newTickerItem, setNewTickerItem] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=kuVu9thTbIM');
  const DEFAULT_FOOTER_COLS: FooterCol[] = [
    { h: 'O Grupo', links: [
      { t: 'O Grupo e os Negócios', href: '/omatapalo' },
      { t: 'Omatapalo no Mundo',    href: '/omatapalo#mundo' },
      { t: 'História',              href: '/omatapalo' },
      { t: 'Conselho de Administração', href: '/omatapalo#conselho' },
    ]},
    { h: 'Atividade', links: [
      { t: 'Portefólio',       href: '/portefolio' },
      { t: 'Sustentabilidade', href: '/sustentabilidade' },
      { t: 'Media',            href: '/media' },
      { t: 'Contactos',        href: '/contactos' },
    ]},
    { h: 'Pessoas', links: [
      { t: 'Pessoas',             href: '/pessoas' },
      { t: 'CDH',                 href: '/cdh' },
      { t: 'Missão Fazer Sorrir', href: '/responsabilidade-social#missao' },
      { t: 'Trabalhar connosco',  href: '/contactos' },
    ]},
  ];
  const [footerDesc, setFooterDesc] = useState('Engenharia, Construção e Infra-estruturas a transformar Angola e o continente africano desde 2003. Fazemos acontecer.');
  const [footerCols, setFooterCols] = useState<FooterCol[]>(DEFAULT_FOOTER_COLS);

  const [socials, setSocials] = useState({
    linkedin:  'https://www.linkedin.com/company/grupo-omatapalo',
    facebook:  'https://www.facebook.com/grupoomatapalo',
    instagram: 'https://www.instagram.com/grupoomatapalo',
    youtube:   'https://www.youtube.com/@grupoomatapalo',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    createClient().from('site_settings').select('key,value').then(({ data, error }) => {
      if (error) { flash('❌ Erro ao carregar definições: ' + error.message); return; }
      if (!data) return;
      for (const row of data) {
        if (row.key === 'nav_items') {
          try {
            const parsed = JSON.parse(row.value);
            setNavItems(parsed);
          } catch { flash('❌ Erro ao ler menu guardado.'); }
        }
        if (row.key === 'logo_url') setLogoUrl(row.value);
        if (row.key === 'favicon_url') setFaviconUrl(row.value);
        if (row.key === 'ticker_items') {
          try { setTickerItems(JSON.parse(row.value)); } catch {}
        }
        if (row.key === 'video_institucional') setVideoUrl(row.value);
        if (row.key === 'social_links') {
          try { setSocials(JSON.parse(row.value)); } catch {}
        }
        if (row.key === 'footer_desc') setFooterDesc(row.value);
        if (row.key === 'footer_cols') { try { setFooterCols(JSON.parse(row.value)); } catch {} }
      }
    });
  }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  async function saveNav() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'nav_items', value: JSON.stringify(navItems) });
    setSaving(false);
    if (error) {
      flash('❌ Erro ao guardar: ' + error.message + (error.code === '42P01' ? ' — Cria a tabela site_settings no Supabase primeiro.' : ''));
    } else {
      flash('✅ Menu guardado com sucesso!');
    }
  }

  async function saveVideo() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'video_institucional', value: videoUrl });
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Vídeo guardado!');
  }

  async function saveFooter() {
    setSaving(true);
    const db = createClient();
    await Promise.all([
      db.from('site_settings').upsert({ key: 'footer_desc', value: footerDesc }),
      db.from('site_settings').upsert({ key: 'footer_cols', value: JSON.stringify(footerCols) }),
    ]);
    setSaving(false);
    flash('✅ Footer guardado!');
  }
  function updateFooterColTitle(ci: number, val: string) {
    setFooterCols(prev => prev.map((c, i) => i === ci ? { ...c, h: val } : c));
  }
  function updateFooterLink(ci: number, li: number, field: keyof FooterLink, val: string) {
    setFooterCols(prev => prev.map((c, i) => i !== ci ? c : { ...c, links: c.links.map((l, j) => j === li ? { ...l, [field]: val } : l) }));
  }
  function addFooterLink(ci: number) {
    setFooterCols(prev => prev.map((c, i) => i !== ci ? c : { ...c, links: [...c.links, { t: '', href: '/' }] }));
  }
  function removeFooterLink(ci: number, li: number) {
    setFooterCols(prev => prev.map((c, i) => i !== ci ? c : { ...c, links: c.links.filter((_, j) => j !== li) }));
  }
  function moveFooterLink(ci: number, li: number, dir: -1 | 1) {
    setFooterCols(prev => prev.map((c, i) => {
      if (i !== ci) return c;
      const arr = [...c.links];
      const j = li + dir;
      if (j < 0 || j >= arr.length) return c;
      [arr[li], arr[j]] = [arr[j], arr[li]];
      return { ...c, links: arr };
    }));
  }

  async function saveSocials() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'social_links', value: JSON.stringify(socials) });
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Redes sociais guardadas!');
  }

  async function saveTicker() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'ticker_items', value: JSON.stringify(tickerItems) });
    setSaving(false);
    flash(error ? '❌ Erro: ' + error.message : '✅ Ticker guardado!');
  }

  async function uploadAsset(file: File, key: 'logo_url' | 'favicon_url') {
    setUploading(true);
    const db = createClient();
    const ext = file.name.split('.').pop();
    const path = `site/${key}-${Date.now()}.${ext}`;
    const { data, error } = await db.storage.from('media').upload(path, file, { upsert: true });
    if (error) { flash('Erro ao carregar ficheiro: ' + error.message); setUploading(false); return; }
    const { data: urlData } = db.storage.from('media').getPublicUrl(data.path);
    const url = urlData.publicUrl;
    await db.from('site_settings').upsert({ key, value: url });
    if (key === 'logo_url') setLogoUrl(url);
    if (key === 'favicon_url') setFaviconUrl(url);
    setUploading(false);
    flash(key === 'logo_url' ? 'Logotipo actualizado!' : 'Favicon actualizado!');
  }

  /* Nav helpers */
  function updateItem(i: number, field: keyof NavItem, val: string) {
    setNavItems(items => items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  }
  function addItem() {
    setNavItems(items => [...items, { label: 'Nova Página', href: '/' }]);
  }
  function removeItem(i: number) {
    setNavItems(items => items.filter((_, idx) => idx !== i));
  }
  function moveItem(i: number, dir: -1 | 1) {
    setNavItems(items => {
      const arr = [...items];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }
  function addSub(i: number) {
    setNavItems(items => items.map((it, idx) => idx === i
      ? { ...it, sub: [...(it.sub ?? []), { label: 'Sub-item', href: '/' }] }
      : it));
    setExpanded(i);
  }
  function updateSub(i: number, j: number, field: 'label' | 'href', val: string) {
    setNavItems(items => items.map((it, idx) => idx === i
      ? { ...it, sub: it.sub?.map((s, si) => si === j ? { ...s, [field]: val } : s) }
      : it));
  }
  function removeSub(i: number, j: number) {
    setNavItems(items => items.map((it, idx) => idx === i
      ? { ...it, sub: it.sub?.filter((_, si) => si !== j) }
      : it));
  }

  const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: 24, marginBottom: 16 };

  return (
    <div style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Configurações do Site</h1>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14 }}>Gere o menu de navegação, logotipo e favicon.</p>

      {msg && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {(['menu', 'logo', 'favicon', 'ticker', 'video', 'socials', 'footer'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={btn(tab === t)}>
            {t === 'menu' ? 'Menu' : t === 'logo' ? 'Logotipo' : t === 'favicon' ? 'Favicon' : t === 'ticker' ? 'Ticker' : t === 'video' ? 'Vídeo' : t === 'socials' ? 'Redes Sociais' : 'Footer'}
          </button>
        ))}
      </div>

      {/* ── MENU ── */}
      {tab === 'menu' && (
        <div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            Adiciona, remove ou reordena os itens do menu. Cada item pode ter sub-itens (dropdown). Clica <strong>▾ 0</strong> para gerir sub-itens.
          </p>

          {navItems.map((item, i) => (
            <div key={i} style={card}>
              {/* Item principal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto auto', gap: 8, alignItems: 'center', marginBottom: expanded === i && item.sub ? 16 : 0 }}>
                <input
                  value={item.label}
                  onChange={e => updateItem(i, 'label', e.target.value)}
                  placeholder="Rótulo"
                  style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, color: '#0f172a' }}
                />
                <input
                  value={item.href}
                  onChange={e => updateItem(i, 'href', e.target.value)}
                  placeholder="URL (ex: /sobre)"
                  style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, color: '#0f172a' }}
                />
                <button onClick={() => moveItem(i, -1)} title="Mover acima" style={{ ...btn(), padding: '8px 10px' }}>↑</button>
                <button onClick={() => moveItem(i, 1)} title="Mover abaixo" style={{ ...btn(), padding: '8px 10px' }}>↓</button>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{ ...btn(!!item.sub?.length), padding: '8px 10px', fontSize: 11 }}
                  title="Sub-itens"
                >
                  ▾ {item.sub?.length ?? 0}
                </button>
                <button onClick={() => removeItem(i)} style={{ ...btn(), padding: '8px 10px', color: '#ef4444' }}>✕</button>
              </div>

              {/* Sub-itens */}
              {expanded === i && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Sub-itens (dropdown)</div>
                  {(item.sub ?? []).map((sub, j) => (
                    <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                      <input
                        value={sub.label}
                        onChange={e => updateSub(i, j, 'label', e.target.value)}
                        placeholder="Rótulo"
                        style={{ padding: '7px 10px', border: '1px solid #e8edf5', borderRadius: 4, fontSize: 12, color: '#0f172a' }}
                      />
                      <input
                        value={sub.href}
                        onChange={e => updateSub(i, j, 'href', e.target.value)}
                        placeholder="URL"
                        style={{ padding: '7px 10px', border: '1px solid #e8edf5', borderRadius: 4, fontSize: 12, color: '#0f172a' }}
                      />
                      <button onClick={() => removeSub(i, j)} style={{ ...btn(), padding: '7px 10px', color: '#ef4444', fontSize: 11 }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => addSub(i)} style={{ ...btn(), marginTop: 4, fontSize: 11 }}>+ Adicionar sub-item</button>
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={addItem} style={{ ...btn(), background: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
              + Adicionar item ao menu
            </button>
            <button onClick={saveNav} disabled={saving} style={{ ...btn(true), opacity: saving ? 0.6 : 1 }}>
              {saving ? 'A guardar…' : 'Guardar Menu'}
            </button>
          </div>
        </div>
      )}

      {/* ── LOGOTIPO ── */}
      {tab === 'logo' && (
        <div style={card}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 16 }}>Logotipo actual</div>
          <div style={{ background: '#0f1a2e', borderRadius: 4, padding: 24, marginBottom: 20, display: 'inline-block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" style={{ height: 48, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Formatos suportados: PNG, SVG. Recomendado fundo transparente.
            </p>
            <input ref={logoRef} type="file" accept="image/png,image/svg+xml" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadAsset(f, 'logo_url'); }} />
            <button onClick={() => logoRef.current?.click()} disabled={uploading} style={{ ...btn(true), opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'A carregar…' : 'Carregar novo logotipo'}
            </button>
          </div>
        </div>
      )}

      {/* ── FAVICON ── */}
      {tab === 'favicon' && (
        <div style={card}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 20 }}>Favicon</div>

          {/* Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, background: '#f8fafc', borderRadius: 8, padding: 24 }}>
            <div style={{ position: 'relative', width: 80, height: 80, background: '#e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={faviconUrl} alt="Favicon" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 4 }} />
              ) : (
                <span style={{ fontSize: 28, color: '#94a3b8' }}>🖼️</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                {faviconUrl ? 'Favicon activo' : 'Sem favicon definido'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Aparece no separador do browser e nos favoritos.</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Formatos: PNG, ICO, SVG · Recomendado: 64×64px</div>
            </div>
          </div>

          {/* Simulação de separador do browser */}
          {faviconUrl && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pré-visualização no browser</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e2e8f0', borderRadius: '6px 6px 0 0', padding: '8px 16px', fontSize: 12, color: '#334155' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={faviconUrl} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                Grupo Omatapalo
              </div>
            </div>
          )}

          {/* Acções */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input ref={faviconRef} type="file" accept="image/x-icon,image/png,image/svg+xml" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadAsset(f, 'favicon_url'); }} />
            <button
              onClick={() => faviconRef.current?.click()}
              disabled={uploading}
              style={{ padding: '10px 20px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? 'A carregar…' : '+ Adicionar / Substituir Favicon'}
            </button>
            {faviconUrl && (
              <button
                onClick={async () => {
                  if (!confirm('Remover o favicon actual?')) return;
                  await createClient().from('site_settings').upsert({ key: 'favicon_url', value: '' });
                  setFaviconUrl('');
                  flash('Favicon removido.');
                }}
                style={{ padding: '10px 20px', background: '#fff', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Remover Favicon
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TICKER ── */}
      {tab === 'ticker' && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 28, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>Faixa de texto animada (Hero)</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Palavras que aparecem na faixa rolante no topo da página inicial.</div>

          {/* Lista de itens */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {tickerItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 6, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                {/* Ordem */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={() => {
                      if (i === 0) return;
                      setTickerItems(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
                    }}
                    disabled={i === 0}
                    style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 3, width: 22, height: 18, cursor: i === 0 ? 'default' : 'pointer', fontSize: 10, color: i === 0 ? '#cbd5e1' : '#475569', lineHeight: 1 }}
                    title="Mover para cima"
                  >▲</button>
                  <button
                    onClick={() => {
                      if (i === tickerItems.length - 1) return;
                      setTickerItems(prev => { const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
                    }}
                    disabled={i === tickerItems.length - 1}
                    style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 3, width: 22, height: 18, cursor: i === tickerItems.length - 1 ? 'default' : 'pointer', fontSize: 10, color: i === tickerItems.length - 1 ? '#cbd5e1' : '#475569', lineHeight: 1 }}
                    title="Mover para baixo"
                  >▼</button>
                </div>
                <span style={{ flex: 1, fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{item}</span>
                <button
                  onClick={() => setTickerItems(prev => prev.filter((_, idx) => idx !== i))}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
                  title="Remover"
                >×</button>
              </div>
            ))}
          </div>

          {/* Adicionar novo item */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Novo item (ex: Logística)"
              value={newTickerItem}
              onChange={e => setNewTickerItem(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newTickerItem.trim()) {
                  setTickerItems(prev => [...prev, newTickerItem.trim()]);
                  setNewTickerItem('');
                }
              }}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none' }}
            />
            <button
              onClick={() => { if (newTickerItem.trim()) { setTickerItems(prev => [...prev, newTickerItem.trim()]); setNewTickerItem(''); } }}
              style={{ padding: '10px 20px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >+ Adicionar</button>
          </div>

          <button
            onClick={saveTicker}
            disabled={saving}
            style={{ padding: '12px 28px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >{saving ? 'A guardar…' : 'Guardar Ticker'}</button>
        </div>
      )}

      {/* ── VÍDEO ── */}
      {tab === 'video' && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 28, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>Vídeo Institucional</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Link do YouTube que aparece no botão "Vídeo Institucional" na página inicial.</div>

          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>URL do YouTube</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
          />

          {/* Preview miniatura */}
          {videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/') ? (() => {
            const id = videoUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
            return id ? (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pré-visualização</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="thumbnail" style={{ width: 240, borderRadius: 6, border: '1px solid #e2e8f0' }} />
              </div>
            ) : null;
          })() : null}

          <button
            onClick={saveVideo}
            disabled={saving}
            style={{ padding: '12px 28px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >{saving ? 'A guardar…' : 'Guardar Vídeo'}</button>
        </div>
      )}

      {/* ── REDES SOCIAIS ── */}
      {tab === 'socials' && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 28, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>Redes Sociais</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 28 }}>Links que aparecem no rodapé e outras secções do site.</div>

          {([
            { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://www.linkedin.com/company/...' },
            { key: 'facebook',  label: 'Facebook',  placeholder: 'https://www.facebook.com/...' },
            { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/...' },
            { key: 'youtube',   label: 'YouTube',   placeholder: 'https://www.youtube.com/@...' },
          ] as { key: keyof typeof socials; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
              <input
                type="url"
                value={socials[key]}
                onChange={e => setSocials(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button
            onClick={saveSocials}
            disabled={saving}
            style={{ padding: '12px 28px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >{saving ? 'A guardar…' : 'Guardar Redes Sociais'}</button>
        </div>
      )}
      {/* ── FOOTER ── */}
      {tab === 'footer' && (
        <div>
          {/* Texto descritivo */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24, marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Texto descritivo</label>
            <textarea value={footerDesc} onChange={e => setFooterDesc(e.target.value)} rows={3}
              style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          {/* Colunas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {footerCols.map((col, ci) => (
              <div key={ci} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Título</label>
                <input value={col.h} onChange={e => updateFooterColTitle(ci, e.target.value)}
                  style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: 14 }} />
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>Links</label>
                {col.links.map((link, li) => (
                  <div key={li} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input value={link.t} onChange={e => updateFooterLink(ci, li, 't', e.target.value)} placeholder="Texto"
                        style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                      <input value={link.href} onChange={e => updateFooterLink(ci, li, 'href', e.target.value)} placeholder="URL"
                        style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box', color: '#64748b' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button onClick={() => moveFooterLink(ci, li, -1)} style={{ padding: '4px 7px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>↑</button>
                      <button onClick={() => moveFooterLink(ci, li,  1)} style={{ padding: '4px 7px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>↓</button>
                    </div>
                    <button onClick={() => removeFooterLink(ci, li)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>×</button>
                  </div>
                ))}
                <button onClick={() => addFooterLink(ci)}
                  style={{ width: '100%', marginTop: 4, padding: '7px', background: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: 6, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                  + Adicionar link
                </button>
              </div>
            ))}
          </div>

          <button onClick={saveFooter} disabled={saving}
            style={{ padding: '12px 32px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'A guardar…' : 'Guardar Footer'}
          </button>
        </div>
      )}

    </div>
  );
}

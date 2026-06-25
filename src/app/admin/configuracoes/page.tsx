'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type SubItem = { label: string; href: string };
type NavItem = { label: string; href: string; sub?: SubItem[] };

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
  { label: 'Id. Visual', href: '/identidade-visual' },
];

const btn = (active = false) => ({
  padding: '8px 20px', borderRadius: 3, border: 'none', cursor: 'pointer', fontSize: 12,
  fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
  background: active ? '#1a396e' : '#f1f5f9', color: active ? '#fff' : '#374151',
});

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<'menu' | 'logo' | 'favicon'>('menu');
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [logoUrl, setLogoUrl] = useState('/logo/LOGO OMT 1.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['menu', 'logo', 'favicon'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={btn(tab === t)}>
            {t === 'menu' ? 'Menu' : t === 'logo' ? 'Logotipo' : 'Favicon'}
          </button>
        ))}
      </div>

      {/* ── MENU ── */}
      {tab === 'menu' && (
        <div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            Adiciona, remove ou reordena os itens do menu. Cada item pode ter sub-itens (dropdown). Clica <strong>▾ 0</strong> para gerir sub-itens.
          </p>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#92400e' }}>
            <strong>Pré-requisito:</strong> cria esta tabela no Supabase (SQL Editor) se ainda não existir:
            <code style={{ display: 'block', marginTop: 6, background: '#fff', padding: '6px 10px', borderRadius: 3, fontFamily: 'monospace', fontSize: 11 }}>
              create table site_settings (key text primary key, value text);
            </code>
          </div>

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
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 16 }}>Favicon actual</div>
          <div style={{ background: '#f8fafc', borderRadius: 4, padding: 24, marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={faviconUrl} alt="Favicon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>32×32px — aparece no separador do browser</span>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Formatos suportados: ICO, PNG, SVG. Tamanho ideal: 32×32 ou 64×64 px.
            </p>
            <input ref={faviconRef} type="file" accept="image/x-icon,image/png,image/svg+xml" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadAsset(f, 'favicon_url'); }} />
            <button onClick={() => faviconRef.current?.click()} disabled={uploading} style={{ ...btn(true), opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'A carregar…' : 'Carregar novo favicon'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

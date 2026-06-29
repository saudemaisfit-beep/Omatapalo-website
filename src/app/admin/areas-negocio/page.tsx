'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

type Business = { num: string; title: string; desc: string; img: string; tag: string };

const DEFAULT: Business[] = [
  { num: '01', title: 'Engenharia & Construção', desc: 'Projetos de grande escala: edifícios, pontes, infraestruturas industriais e habitacionais. O coração e a identidade do Grupo.', img: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800&q=80&auto=format&fit=crop', tag: 'Core Business' },
  { num: '02', title: 'Obras Públicas', desc: 'Mais de 5.000 km de estradas pavimentadas. Barragens, pontes e infraestrutura crítica para o desenvolvimento nacional.', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80&auto=format&fit=crop', tag: 'Infra-estruturas' },
  { num: '03', title: 'Imobiliário', desc: 'Prime Properties — desenvolvimento urbano premium com mais de 1.500.000 m² de espaço construído em Angola.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop', tag: 'Prime Properties' },
  { num: '04', title: 'Agroindústria', desc: 'Produção agrícola integrada, processamento e distribuição alimentar para garantir a soberania alimentar de Angola.', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&auto=format&fit=crop', tag: 'Agro' },
  { num: '05', title: 'Minas & Recursos', desc: 'Drill Go — exploração responsável de recursos naturais com tecnologia de ponta e rigoroso foco ambiental.', img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80&auto=format&fit=crop', tag: 'Drill Go' },
  { num: '06', title: 'Pesca Industrial', desc: 'Pescaria Mormolo — frota moderna e infraestrutura de processamento para o mercado angolano e exportação.', img: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80&auto=format&fit=crop', tag: 'Mormolo' },
  { num: '07', title: 'Gestão Hoteleira', desc: 'Flow Hotel — hospitalidade de referência em Angola. Experiências únicas que acompanham o crescimento turístico.', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop', tag: 'Flow Hotel' },
  { num: '08', title: 'Indústria & Energia', desc: 'Metalosul e Investimo — fabrico de estruturas metálicas, energias renováveis e soluções industriais avançadas.', img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop', tag: 'Energia' },
];

export default function AreasNegocioAdminPage() {
  const [items, setItems] = useState<Business[]>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [picker, setPicker] = useState<number | null>(null);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'businesses_cfg').single().then(({ data }) => {
      if (data?.value) try { setItems(JSON.parse(data.value)); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'businesses_cfg', value: JSON.stringify(items) });
    setSaving(false);
    setMsg(error ? '❌ Erro' : '✅ Áreas de negócio guardadas!');
    setTimeout(() => setMsg(''), 3000);
  }

  function upd(i: number, f: keyof Business, v: string) {
    setItems(p => p.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Áreas de Negócio</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{items.length} áreas — secção homepage "Um Grupo. Oito Forças."</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setItems(p => [...p, { num: String(p.length + 1).padStart(2, '0'), title: '', desc: '', img: '', tag: '' }])} style={{ padding: '10px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>+ Adicionar</button>
          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((b, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{b.num} — {b.title || 'Nova área'}</span>
              <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Número</label>
                <input value={b.num} onChange={e => upd(i, 'num', e.target.value)} style={inp} placeholder="01" />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Título</label>
                <input value={b.title} onChange={e => upd(i, 'title', e.target.value)} style={inp} placeholder="Engenharia & Construção" />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Tag/Empresa</label>
                <input value={b.tag} onChange={e => upd(i, 'tag', e.target.value)} style={inp} placeholder="Core Business" />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Descrição</label>
              <textarea value={b.desc} onChange={e => upd(i, 'desc', e.target.value)} rows={2} style={ta} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: '#94a3b8', display: 'block', marginBottom: 3 }}>Imagem</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={b.img} onChange={e => upd(i, 'img', e.target.value)} style={{ ...inp, flex: 1 }} placeholder="URL da imagem" />
                <button onClick={() => setPicker(i)} style={{ padding: '9px 10px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🖼</button>
                {b.img && <img src={b.img} alt="" style={{ height: 38, width: 56, objectFit: 'cover', borderRadius: 3 }} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {picker !== null && (
        <MediaPicker
          onSelect={url => { upd(picker, 'img', url); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

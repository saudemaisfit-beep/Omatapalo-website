'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MediaPicker from '@/components/admin/MediaPicker';

const inp: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };

type Item = { quote: string; name: string; role: string; photo: string };

const DEFAULT: Item[] = [
  { quote: 'Sinto que contribuo não só para uma estrada ou um edifício, mas para o desenvolvimento da comunidade onde vivo. O Grupo Omatapalo dá-nos orgulho e motivação para fazer sempre mais e melhor.', name: 'Zulmira da Costa', role: 'Responsável de Apoio Administrativo', photo: 'https://omatapalo.com/wp-content/uploads/27.jpg' },
  { quote: 'Fui promovido depois de participar num programa interno de capacitação. Sinto que aqui há oportunidades reais de crescer e fazer a diferença.', name: 'Edmar Manuel', role: 'Director Executivo Administrativo', photo: 'https://omatapalo.com/wp-content/uploads/29.jpg' },
  { quote: 'Na obra onde trabalho, vejo diariamente como se preocupam com a nossa segurança e conforto. As formações que recebemos ajudaram-me a crescer, tanto na parte técnica, como pessoal.', name: 'João Freitas', role: 'Técnico de Segurança, Benguela', photo: 'https://omatapalo.com/wp-content/uploads/26.jpg' },
  { quote: 'Participei em acções de reflorestação promovidas pela empresa. Não é só construir, é também preservar. Isso dá sentido ao nosso trabalho.', name: 'José Avelino', role: 'Motorista, Malanje', photo: 'https://omatapalo.com/wp-content/uploads/28.jpg' },
];

export default function TestemunhosAdminPage() {
  const [items, setItems] = useState<Item[]>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [picker, setPicker] = useState<number | null>(null);

  useEffect(() => {
    createClient().from('site_settings').select('value').eq('key', 'testemunhos_cfg').single().then(({ data }) => {
      if (data?.value) try { setItems(JSON.parse(data.value)); } catch {}
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await createClient().from('site_settings').upsert({ key: 'testemunhos_cfg', value: JSON.stringify(items) });
    setSaving(false);
    setMsg(error ? '❌ Erro ao guardar' : '✅ Testemunhos guardados!');
    setTimeout(() => setMsg(''), 3000);
  }

  function upd(i: number, f: keyof Item, v: string) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(24px,3vw,40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Testemunhos</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{items.length} testemunhos</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setItems(p => [...p, { quote: '', name: '', role: '', photo: '' }])} style={{ padding: '10px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>+ Adicionar</button>
          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#1a396e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.startsWith('✅') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Testemunho {i + 1}</span>
              <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Nome</label>
                <input value={item.name} onChange={e => upd(i, 'name', e.target.value)} style={inp} placeholder="Nome" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Cargo</label>
                <input value={item.role} onChange={e => upd(i, 'role', e.target.value)} style={inp} placeholder="Cargo, Localidade" />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Citação</label>
              <textarea value={item.quote} onChange={e => upd(i, 'quote', e.target.value)} rows={3} style={ta} placeholder="Citação..." />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Foto</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={item.photo} onChange={e => upd(i, 'photo', e.target.value)} style={{ ...inp, flex: 1 }} placeholder="URL da foto" />
                <button onClick={() => setPicker(i)} style={{ padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap' }}>🖼 Escolher</button>
              </div>
              {item.photo && <img src={item.photo} alt="" style={{ marginTop: 8, height: 64, width: 64, objectFit: 'cover', borderRadius: 4 }} />}
            </div>
          </div>
        ))}
      </div>

      {picker !== null && (
        <MediaPicker
          onSelect={url => { upd(picker, 'photo', url); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

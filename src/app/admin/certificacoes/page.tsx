'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Cert = { id: number; label: string; sub: string; src: string; link: string; sort_order: number };

export default function CertificacoesAdmin() {
  const supabase = createClient();
  const [certs, setCerts] = useState<Cert[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('certifications').select('*').order('sort_order').then(({ data }) => setCerts(data ?? []));
  }, []);

  function update(id: number, field: keyof Cert, value: string) {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  async function save(cert: Cert) {
    setSaving(cert.id); setMsg('');
    const { error } = await supabase.from('certifications').update({ link: cert.link, label: cert.label, sub: cert.sub }).eq('id', cert.id);
    setSaving(null);
    setMsg(error ? 'Erro: ' + error.message : 'Guardado!');
    setTimeout(() => setMsg(''), 2500);
  }

  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Certificações</h1>
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>Edita os títulos, descrições e links de cada certificação.</p>
      </div>

      {msg && (
        <div style={{ marginBottom: 20, padding: '10px 16px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, fontSize: 13, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {certs.map(cert => (
          <div key={cert.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Header com logo */}
            <div style={{ background: '#07101f', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cert.src} alt={cert.label} style={{ height: 48, width: 48, objectFit: 'contain', filter: 'brightness(1.2)' }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{cert.label}</div>
            </div>

            {/* Fields */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Título</label>
                <input style={inp} value={cert.label} onChange={e => update(cert.id, 'label', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Descrição</label>
                <input style={inp} value={cert.sub} onChange={e => update(cert.id, 'sub', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Link do Certificado</label>
                <input style={{ ...inp, fontFamily: 'monospace', fontSize: 13 }} value={cert.link} onChange={e => update(cert.id, 'link', e.target.value)} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => save(cert)}
                  disabled={saving === cert.id}
                  style={{ padding: '9px 22px', background: '#1a396e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving === cert.id ? 0.6 : 1 }}
                >
                  {saving === cert.id ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

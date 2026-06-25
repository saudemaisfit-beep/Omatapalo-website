'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Profile = { id: string; full_name: string; role: string; created_at: string; };

export default function UsersPage() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('editor');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data ?? []);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true); setMsg('');
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: name, role }),
    });
    const json = await res.json();
    setCreating(false);
    if (json.error) setMsg('Erro: ' + json.error);
    else { setMsg('Utilizador criado!'); setEmail(''); setPassword(''); setName(''); load(); }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 32 }}>Utilizadores</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Nome', 'Perfil', 'Data', 'Acções'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Nenhum utilizador.</td></tr>}
              {profiles.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p.full_name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.role === 'admin' ? '#eff6ff' : '#f1f5f9', color: p.role === 'admin' ? '#1a396e' : '#475569' }}>{p.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{new Date(p.created_at).toLocaleDateString('pt-PT')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select defaultValue={p.role} onChange={async e => {
                      await supabase.from('profiles').update({ role: e.target.value }).eq('id', p.id);
                      load();
                    }} style={{ fontSize: 12, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }}>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Criar utilizador</h2>
          <form onSubmit={createUser} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Nome</label>
              <input style={inp} value={name} onChange={e => setName(e.target.value)} required placeholder="Nome completo" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" style={inp} value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@empresa.ao" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" style={inp} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="mínimo 6 caracteres" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Perfil</label>
              <select style={inp} value={role} onChange={e => setRole(e.target.value)}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {msg && <div style={{ padding: '8px 12px', background: msg.startsWith('Erro') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.startsWith('Erro') ? '#fecaca' : '#bbf7d0'}`, borderRadius: 6, fontSize: 12, color: msg.startsWith('Erro') ? '#dc2626' : '#16a34a' }}>{msg}</div>}
            <button type="submit" disabled={creating} style={{ background: '#1a396e', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              {creating ? 'A criar...' : 'Criar utilizador'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

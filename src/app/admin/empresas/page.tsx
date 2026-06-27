'use client';
import Link from 'next/link';
import { ALL_COMPANIES } from '@/data/empresas';

export default function AdminEmpresasPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Empresas do Grupo</h1>
        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>{ALL_COMPANIES.length} empresas · clique para editar descrição e galeria</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {ALL_COMPANIES.map(c => (
          <Link key={c.slug} href={`/admin/empresas/${c.slug}`} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'border-color .2s, box-shadow .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1a396e'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(26,57,110,0.10)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
          >
            {c.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logo} alt={c.name} style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.area || c.sectorLabel}</div>
            </div>
            <span style={{ fontSize: 18, color: '#94a3b8' }}>›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

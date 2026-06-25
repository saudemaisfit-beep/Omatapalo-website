'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const DEPARTMENTS = [
  { label: 'Geral',                    email: 'geral@omatapalo.ao' },
  { label: 'Recursos Humanos',         email: 'rh@omatapalo.ao' },
  { label: 'Marketing e Comunicação',  email: 'marketing@omatapalo.ao' },
  { label: 'Responsabilidade Social',  email: 'rsc@omatapalo.ao' },
  { label: 'Comercial',                email: 'comercial@omatapalo.ao' },
];

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [dept, setDept] = useState(DEPARTMENTS[0]);

  if (sent) {
    return (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-7)', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E6F3EC', color: '#1F7A52', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', fontSize: '28px' }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h3)', color: 'var(--text-strong)', marginBottom: '8px' }}>Mensagem enviada</h3>
        <p style={{ color: 'var(--text-muted)' }}>Obrigado. A nossa equipa entrará em contacto brevemente.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-7)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--text-h3)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>Fale connosco</h3>
      <div className="field">
        <label className="field__label">Departamento <span style={{ color: 'var(--navy-400)' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <select
            className="field__input"
            required
            value={dept.label}
            onChange={(e) => setDept(DEPARTMENTS.find(d => d.label === e.target.value)!)}
            style={{ appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
          >
            {DEPARTMENTS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
          </select>
          <svg style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--navy-500)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div className="field"><label className="field__label">Nome</label><input className="field__input" required placeholder="O seu nome" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="form-row">
        <div className="field"><label className="field__label">Email</label><input className="field__input" type="email" required placeholder="email@empresa.ao" /></div>
        <div className="field"><label className="field__label">Telefone</label><input className="field__input" placeholder="+244 …" /></div>
      </div>
      <div className="field"><label className="field__label">Mensagem</label><textarea className="field__textarea" required placeholder="Conte-nos sobre o seu projecto" /></div>
      <button type="submit" className="btn btn-primary" style={{ height: '52px' }}>
        Enviar mensagem
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!sectionRef.current) return;
        const elems = sectionRef.current.querySelectorAll('.reveal-ct');
        gsap.fromTo(Array.from(elems), { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
      });
    });
  }, []);

  return (
    <section id="contactos" className="section" ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', background: 'var(--navy-950)' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=72&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.2 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, var(--navy-950) 32%, rgba(10,23,41,0.65))' }} />
      </div>

      <div className="wrap relative z-[2]">
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'var(--space-9)', alignItems: 'start' }} className="cta-grid">
          <div className="reveal-ct" style={{ opacity: 0 }}>
            <div className="eyebrow eyebrow--dark">Próximo passo</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', fontSize: 'var(--text-display-lg)', lineHeight: '0.95', letterSpacing: '-0.03em', marginTop: '16px', marginBottom: 0 }}>
              Construímos<span style={{ color: 'var(--navy-300)', display: 'block' }}>O Seu Futuro</span>
            </h2>
            <p style={{ color: 'var(--navy-100)', fontSize: 'var(--text-lg)', lineHeight: 1.6, maxWidth: '46ch', marginTop: 'var(--space-5)' }}>
              Para contactos com a OMATAPALO utilize, por favor, o formulário escolhendo o departamento que deseja contactar:
            </p>
            <div style={{ marginTop: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { icon: '📍', label: 'Sede Lubango', value: 'Bairro do Tchioco, Zona Industrial II, Lubango – Angola' },
                { icon: '📍', label: 'Escritório Marginal Luanda', value: 'Avenida 4 de Fevereiro, Nº 93, Marginal de Luanda' },
                { icon: '004-message', label: 'Email', value: 'geral@omatapalo.ao' },
                { icon: 'telephone', label: 'Telefone', value: '+244 000 000 000' },
              ].map((c) => (
                <div key={c.label} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '14px', alignItems: 'start' }}>
                  {c.label === 'Email'
                    ? <img src="/icons/004-message.svg" alt="" width={22} height={22} style={{ marginTop: '3px', filter: 'brightness(0) invert(1)' }} />
                    : c.label === 'Telefone'
                    ? <img src="/icons/telephone.svg" alt="" width={22} height={22} style={{ marginTop: '3px', filter: 'brightness(0) invert(1)' }} />
                    : <img src="/placeholder.svg" alt="" width={22} height={22} style={{ marginTop: '3px', filter: 'brightness(0) invert(1)' }} />
                  }
                  <div>
                    <div style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--navy-300)', marginBottom: '3px' }}>{c.label}</div>
                    <div style={{ color: '#fff', fontSize: 'var(--text-base)' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-ct" style={{ opacity: 0 }}>
            <ContactForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:920px) { .cta-grid { grid-template-columns: 1fr !important; gap: var(--space-7) !important; } }
        @media (max-width:540px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

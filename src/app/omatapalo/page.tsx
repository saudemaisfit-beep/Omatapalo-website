'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import Negocios from '@/components/Negocios';
import Mundo from '@/components/Mundo';
import Historia from '@/components/Historia';
import ConselhoAdministracao from '@/components/ConselhoAdministracao';

const DEFAULT_INTRO = 'O GRUPO OMATAPALO é uma empresa nacional que gere um portefólio diversificado de negócios nas áreas de Engenharia e Construção, Obras Públicas, Agroindústria, Imobiliário, Minas, Pesca e Gestão Hoteleira.';

export default function OmatapaloPage() {
  const [intro, setIntro] = useState(DEFAULT_INTRO);

  useEffect(() => {
    createClient().from('site_content').select('value').eq('page', 'omatapalo').eq('field', 'intro_destaque').single().then(({ data }) => {
      if (data?.value) setIntro(data.value);
    });
  }, []);

  return (
    <>
      <Nav />
      <main>
        <PageHero page="omatapalo" title="Grupo Omatapalo" imgSrc="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80" position="center" imgOpacity={0.45} />
        <section style={{
          background: '#fff',
          paddingTop: 'clamp(100px,14vh,160px)',
          paddingBottom: 'clamp(64px,9vh,112px)',
        }}>
          <div className="wrap">
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px,1.5vw,20px)',
              color: '#0a2d74',
              lineHeight: 1.7,
              fontWeight: 700,
              maxWidth: '800px',
            }}>
              {intro}
            </p>
          </div>
        </section>

        <Negocios />
        <Mundo />
        <Historia />
        <ConselhoAdministracao />
      </main>
      <Footer />
    </>
  );
}

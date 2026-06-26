import Nav from '@/components/Nav';
import Sustentabilidade from '@/components/Sustentabilidade';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function SustentabilidadePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero page="sustentabilidade"
          title="Sustentabilidade"
          imgSrc="/Ativo 21.png"
          position="center"
          imgOpacity={0.45}
        />
        <Sustentabilidade />
      </main>
      <Footer />
    </>
  );
}


import Nav from '@/components/Nav';
import Sustentabilidade from '@/components/Sustentabilidade';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function SustentabilidadePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          title="Sustentabilidade"
          imgSrc="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80"
          position="center"
          imgOpacity={0.45}
        />
        <Sustentabilidade />
      </main>
      <Footer />
    </>
  );
}

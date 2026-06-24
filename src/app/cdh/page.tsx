import Nav from '@/components/Nav';
import CDH from '@/components/CDH';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function CDHPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero title="Clube Desportivo da Huíla" imgSrc="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600&q=80" position="center" imgOpacity={0.45} />
        <CDH />
      </main>
      <Footer />
    </>
  );
}

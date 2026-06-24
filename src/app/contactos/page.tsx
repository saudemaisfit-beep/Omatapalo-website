import Nav from '@/components/Nav';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function ContactosPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero title="Contactos" imgSrc="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80" position="center top" imgOpacity={0.45} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

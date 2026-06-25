import Nav from '@/components/Nav';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function ContactosPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero title="Contactos" imgSrc="/Omatapalo-Contactos-web.jpg" position="center top" imgOpacity={0.45} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

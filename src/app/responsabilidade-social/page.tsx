import Nav from '@/components/Nav';
import ResponsabilidadeSocialContent from '@/components/ResponsabilidadeSocialContent';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function ResponsabilidadeSocial() {
  return (
    <>
      <Nav />
      <main>
        <PageHero title="Responsabilidade Social" imgSrc="/DSC_0030.jpg" position="center" eyebrow="Grupo Omatapalo · Missão Fazer Sorrir" outlineWord="Social" imgOpacity={0.45} />
        <ResponsabilidadeSocialContent />
      </main>
      <Footer />
    </>
  );
}

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import IdentidadeVisual from '@/components/IdentidadeVisual';

export default function IdentidadeVisualPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero page="identidade-visual"
          title="Press Kit"
          eyebrow="Grupo Omatapalo · Marca"
          outlineWord="Kit"
          imgSrc="/EXPO-HUAMBO-2.jpg"
          imgOpacity={0.3}
          position="center"
        />
        <IdentidadeVisual />
      </main>
      <Footer />
    </>
  );
}


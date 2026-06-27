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
          imgSrc="/COMPLEXO HOSPITALAR DOENÃ‡AS CARDIO-PULMONARES CARDEAL D. ALEXANDRE DO NASCIMENTO (2).JPG"
          imgOpacity={0.3}
          position="center"
        />
        <IdentidadeVisual />
      </main>
      <Footer />
    </>
  );
}


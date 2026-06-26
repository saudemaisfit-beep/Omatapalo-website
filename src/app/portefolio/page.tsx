import Nav from '@/components/Nav';
import PortefolioDinamico from '@/components/PortefolioDinamico';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function PortefolioPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero page="portefolio" title="Portefólio de Projectos" imgSrc="/COMPLEXO HOSPITALAR DOENÇAS CARDIO-PULMONARES CARDEAL D. ALEXANDRE DO NASCIMENTO (2).JPG" position="center" eyebrow="Grupo Omatapalo · Desde 2003" outlineWord="Projectos" imgOpacity={0.45} />
        <PortefolioDinamico />
      </main>
      <Footer />
    </>
  );
}


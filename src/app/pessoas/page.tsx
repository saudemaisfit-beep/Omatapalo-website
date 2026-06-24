import Nav from '@/components/Nav';
import Pessoas from '@/components/Pessoas';
import Testemunhos from '@/components/Testemunhos';
import Academia from '@/components/Academia';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

export default function PessoasPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero title="As nossas Pessoas" imgSrc="/Academia-barra.jpg" position="center" eyebrow="Grupo Omatapalo · +15 000 Colaboradores" outlineWord="Pessoas" imgOpacity={0.45} />
        <Pessoas />
        <Testemunhos />
        <Academia />
      </main>
      <Footer />
    </>
  );
}

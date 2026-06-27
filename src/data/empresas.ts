export type Company = {
  slug: string;
  logo?: string;
  name: string;
  year: string;
  area: string;
  desc: string;
  link?: string;
  sector: string;
  sectorLabel: string;
};

export type Sector = { id: string; label: string; short: string; companies: Company[] };

export const SECTORS: Sector[] = [
  {
    id: 'primario', label: 'Sector Primário', short: '01',
    companies: [
      { slug: 'fazenda-mumba',  logo: '/Mumba-logo.png',  name: 'Fazenda Mumba', year: '2015', area: 'Agro-negócio',          desc: 'Produção agrícola e pecuária. Detentora de 99,8% do capital social.', sector: 'primario', sectorLabel: 'Sector Primário' },
      { slug: 'octosea',        logo: '/OCTOSEA (1).png', name: 'Octosea',       year: '2010', area: 'Pescas',                desc: 'Exploração de recursos haliêuticos nas águas angolanas.', sector: 'primario', sectorLabel: 'Sector Primário' },
      { slug: 'animoper',       logo: '/ANIMOPER.png',    name: 'Animoper',      year: '2022', area: 'Mineração – Ouro',      desc: 'Mineração e tratamento de metais preciosos em Angola.', sector: 'primario', sectorLabel: 'Sector Primário' },
      { slug: 'maoma',          logo: '/logo-MAOMA.png',  name: 'Maoma',         year: '2019', area: 'Mineração – Diamantes', desc: 'Exploração e comercialização de diamantes.', sector: 'primario', sectorLabel: 'Sector Primário' },
    ],
  },
  {
    id: 'secundario', label: 'Sector Secundário', short: '02',
    companies: [
      { slug: 'omatapalo',   logo: '/Omatapalo-Engenharia-e-Construcao.png', name: 'Omatapalo',  year: '2003', area: 'Engenharia e Construção',  desc: 'Empresa-mãe do grupo. Líder nacional em engenharia e infraestrutura.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'metalosul',   logo: '/METALOSUL. (1).png',                    name: 'Metalosul',  year: '2009', area: 'Metalomecânica',           desc: 'Fabrico e montagem de estruturas metálicas.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'granisul',    logo: '/GraniSul-Logotipo.png',                 name: 'Granisul',   year: '2010', area: 'Extracção de Granito',     desc: 'Extracção e transformação de granito para construção.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'drillgo',     logo: '/DRILL-GO.png',                          name: 'DrillGo',    year: '2019', area: 'Geotecnia',                desc: 'Obras subterrâneas e geotecnia de precisão.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'siema',       logo: '/SIEMA-1.png',                           name: 'Siema',      year: '2012', area: 'Instalações Especiais',    desc: 'Sistemas eléctricos, AVAC e infraestruturas técnicas.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'planasul',    logo: '/Planasul (1).png',                      name: 'Planasul',   year: '2003', area: 'Engenharia e Construção',  desc: 'Construção civil e obras públicas em Angola.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'selagrup',    logo: '/SelaGrup-Logotipo.png',                 name: 'Selagrup',   year: '2020', area: 'Captação de Água',         desc: 'Furos e redes de distribuição de água.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'emadel',      logo: '/Emadel.png',                            name: 'Emadel',     year: '2010', area: 'Carpintaria',              desc: 'Soluções em madeira para construção e decoração.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
      { slug: 'enerline',    logo: '/Enerline.png',                          name: 'Enerline',   year: '2014', area: 'Energia',                  desc: 'Soluções energéticas e energias renováveis.', sector: 'secundario', sectorLabel: 'Sector Secundário' },
    ],
  },
  {
    id: 'terciario', label: 'Sector Terciário', short: '03',
    companies: [
      { slug: 'investimo-ge',      logo: '/Investimo Ge.png',          name: 'Investimo GE',     year: '2025', area: 'Gestão de Edifícios',        desc: 'Gestão técnica e operacional de edifícios.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'investimo',         logo: '/investimo.png',             name: 'Investimo',        year: '2014', area: 'Imobiliário',                desc: 'Investimento e promoção imobiliária em Angola.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'prime-properties',  logo: '/Logo-Prime-Properties.png', name: 'Prime Properties', year: '2024', area: 'Imobiliário',                desc: 'Gestão e comercialização de activos imobiliários premium.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'ontour',            logo: '/ONTOUR.png',                name: 'OnTour',           year: '2022', area: 'Turismo',                    desc: 'Serviços de turismo e hospitalidade em Angola.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'venture-vanguard',  logo: '/Venture Vanguard.png',      name: 'Venture Vanguard', year: '2024', area: 'Trading',                    desc: 'Consultoria e trading de commodities e serviços.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'sotrans',           logo: '/SOTRANS-Logo.png',          name: 'Sotrans',          year: '2014', area: 'Transportes',                desc: 'Transporte de passageiros e logística.', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'emadel-lar',        logo: '/EMADEL-LAR.png',            name: 'EmadelLar',        year: '',     area: '',                           desc: '', sector: 'terciario', sectorLabel: 'Sector Terciário' },
      { slug: 'okuajuluka',        logo: '/Okuanjuluka.png',           name: 'Okuajuluka',       year: '',     area: 'Arquitectura de Interiores', desc: '', sector: 'terciario', sectorLabel: 'Sector Terciário' },
    ],
  },
];

export const ALL_COMPANIES: Company[] = SECTORS.flatMap(s => s.companies);

export function getCompany(slug: string): Company | undefined {
  return ALL_COMPANIES.find(c => c.slug === slug);
}

import { notFound } from 'next/navigation';
import { getCompany, ALL_COMPANIES } from '@/data/empresas';
import EmpresaEditor from '@/components/admin/EmpresaEditor';
import { createClient } from '@/lib/supabase/server';

export async function generateStaticParams() {
  return ALL_COMPANIES.map(c => ({ slug: c.slug }));
}

export default async function AdminEmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from('empresas').select('*').eq('slug', slug).single();

  return (
    <EmpresaEditor
      company={company}
      initialDescription={data?.full_description ?? company.desc ?? ''}
      initialGallery={data?.gallery ?? []}
    />
  );
}

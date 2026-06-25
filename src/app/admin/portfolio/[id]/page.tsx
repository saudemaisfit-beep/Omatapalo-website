import { createClient } from '@/lib/supabase/server';
import ProjectEditor from '@/components/admin/ProjectEditor';
import { notFound } from 'next/navigation';

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from('portfolio_projects').select('*').eq('id', id).single();
  if (!project) notFound();
  return <ProjectEditor project={project} />;
}

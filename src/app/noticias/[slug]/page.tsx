import { createClient } from '@supabase/supabase-js';
import NoticiaContent from './NoticiaContent';

export async function generateStaticParams() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from('posts').select('slug').eq('published', true);
    return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NoticiaContent slug={slug} />;
}

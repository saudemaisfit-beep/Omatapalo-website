'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  created_at: string;
  author?: string;
};

function formatContent(html: string) {
  // If content has no block-level HTML tags, treat as plain text and wrap paragraphs
  if (!/<(p|h[1-6]|ul|ol|blockquote|div)[^>]*>/i.test(html)) {
    return html
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }
  return html;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [prev, setPrev] = useState<{ title: string; slug: string } | null>(null);
  const [next, setNext] = useState<{ title: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const db = createClient();
    db.from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(async ({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return; }
        setPost(data);
        const { data: p } = await db.from('posts').select('title,slug').eq('published', true).lt('created_at', data.created_at).order('created_at', { ascending: false }).limit(1).single();
        setPrev(p ?? null);
        const { data: n } = await db.from('posts').select('title,slug').eq('published', true).gt('created_at', data.created_at).order('created_at', { ascending: true }).limit(1).single();
        setNext(n ?? null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <>
      <Nav />
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>A carregar...</span>
      </main>
      <Footer />
    </>
  );

  if (notFound || !post) return (
    <>
      <Nav />
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: '#0f1a2e' }}>Notícia não encontrada</h1>
        <a href="/media" style={{ color: '#1a396e', fontSize: 14, fontWeight: 600 }}>← Voltar às notícias</a>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Nav />
      <main style={{ background: '#fff' }}>

        {/* ── Layout D: Hero XL + barra meta + corpo centrado ── */}

        {/* Hero grande */}
        <div style={{ position: 'relative', height: 'clamp(340px,52vh,620px)', overflow: 'hidden', background: '#0d1622' }}>
          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,16,31,0.88) 0%, rgba(7,16,31,0.3) 55%, transparent 100%)' }} />
          <div className="wrap" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(28px,4vw,60px)' }}>
            {post.category && (
              <span style={{ display: 'inline-block', fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', background: '#1a396e', padding: '4px 12px', borderRadius: 2, marginBottom: 20 }}>
                {post.category}
              </span>
            )}
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem,3.5vw,3.2rem)', color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.05, textTransform: 'uppercase', maxWidth: 860 }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* Barra meta: data + partilhar + voltar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8edf5', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, flexWrap: 'wrap', gap: 16 }}>
            <time style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.12em', color: '#64748b' }}>{fmtDate(post.created_at)}</time>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.1em', color: '#64748b' }}>Partilhar</span>
                {([
                  { net: 'facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                  { net: 'twitter',  url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
                  { net: 'linkedin', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                ] as const).map(({ net, url }) => (
                  <a key={net} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ width: 28, height: 28, borderRadius: 3, background: '#1a396e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 11, fontWeight: 700 }}
                    className="share-btn"
                  >
                    {net === 'facebook' ? 'f' : net === 'twitter' ? 'X' : 'in'}
                  </a>
                ))}
              </div>

              <div style={{ width: 1, height: 20, background: '#e8edf5' }} />

              <div style={{ display: 'flex', gap: 16 }}>
                {prev
                  ? <a href={`/noticias/${prev.slug}`} style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', fontWeight: 700 }}>‹ Anterior</a>
                  : <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, textTransform: 'uppercase', color: '#c0cad8' }}>‹ Anterior</span>}
                {next
                  ? <a href={`/noticias/${next.slug}`} style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', fontWeight: 700 }}>Seguinte ›</a>
                  : <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, textTransform: 'uppercase', color: '#c0cad8' }}>Seguinte ›</span>}
              </div>

              <div style={{ width: 1, height: 20, background: '#e8edf5' }} />

              <a href="/media" style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', fontWeight: 700 }}>
                ← Notícias
              </a>
            </div>
          </div>
        </div>

        {/* Corpo */}
        <section style={{ paddingTop: 'clamp(48px,7vh,80px)', paddingBottom: 'clamp(64px,9vh,100px)' }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            {post.content && (
              <div className="post-content" dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
            )}
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 860px) { .post-grid { grid-template-columns: 1fr !important; } }
        .share-btn:hover { opacity: 0.75; }
        .back-btn:hover { background: #1a396e !important; color: #fff !important; }
        .post-content {
          font-size: clamp(15px, 1.15vw, 17px);
          color: #374151;
          line-height: 2;
        }
        .post-content h2, .post-content h3, .post-content h4 {
          font-family: var(--font-display);
          font-weight: 900;
          color: #0f1a2e;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 2.5em 0 0.8em;
        }
        .post-content p { margin: 0 0 2em; }
        .post-content ul, .post-content ol { margin: 0 0 2em; padding-left: 1.5em; }
        .post-content li { margin-bottom: 0.75em; }
        .post-content a { color: #1a396e; text-decoration: underline; }
        .post-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5em 0; }
        .post-content strong { color: #0f1a2e; font-weight: 700; }
        .post-content blockquote { border-left: 3px solid #1a396e; padding-left: 20px; margin: 1.5em 0; color: #475569; font-style: italic; }
      `}</style>
    </>
  );
}

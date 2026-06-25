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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    createClient()
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        if (data) setPost(data);
        else setNotFound(true);
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
      <main>
        {/* Hero image */}
        {post.cover_image && (
          <div style={{ position: 'relative', height: 'clamp(260px,40vh,520px)', overflow: 'hidden', background: '#0d1622' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,16,31,0.85) 0%, rgba(7,16,31,0.2) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,4vw,56px)' }} className="wrap">
              {post.category && (
                <span style={{ display: 'inline-block', fontFamily: 'var(--font-label)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', background: '#1a396e', padding: '4px 12px', borderRadius: 2, marginBottom: 16 }}>
                  {post.category}
                </span>
              )}
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2.8rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, textTransform: 'uppercase', maxWidth: 860 }}>
                {post.title}
              </h1>
            </div>
          </div>
        )}

        {/* Content */}
        <section style={{ background: '#fff', paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(64px,9vh,100px)' }}>
          <div className="wrap" style={{ maxWidth: 780 }}>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid #e8edf5' }}>
              <time style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.12em', color: '#64748b' }}>
                {fmtDate(post.created_at)}
              </time>
              {post.author && (
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.12em', color: '#94a3b8' }}>
                  {post.author}
                </span>
              )}
            </div>

            {/* Title (no cover image case) */}
            {!post.cover_image && (
              <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.8rem)', color: '#0f1a2e', letterSpacing: '-0.02em', lineHeight: 1.1, textTransform: 'uppercase' }}>
                {post.title}
              </h1>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{ margin: '0 0 32px', fontSize: 'clamp(15px,1.2vw,18px)', color: '#374151', lineHeight: 1.75, fontWeight: 500, borderLeft: '3px solid #1a396e', paddingLeft: 20 }}>
                {post.excerpt}
              </p>
            )}

            {/* Body content */}
            {post.content && (
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Back link */}
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid #e8edf5' }}>
              <a
                href="/media"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', fontWeight: 700 }}
              >
                ← Voltar às notícias
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .post-content {
          font-size: clamp(14px, 1.1vw, 16px);
          color: #374151;
          line-height: 1.8;
        }
        .post-content h2, .post-content h3, .post-content h4 {
          font-family: var(--font-display);
          font-weight: 900;
          color: #0f1a2e;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 2em 0 0.6em;
        }
        .post-content p { margin: 0 0 1.4em; }
        .post-content ul, .post-content ol { margin: 0 0 1.4em; padding-left: 1.5em; }
        .post-content li { margin-bottom: 0.4em; }
        .post-content a { color: #1a396e; text-decoration: underline; }
        .post-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5em 0; }
        .post-content strong { color: #0f1a2e; font-weight: 700; }
        .post-content blockquote { border-left: 3px solid #1a396e; padding-left: 20px; margin: 1.5em 0; color: #475569; font-style: italic; }
      `}</style>
    </>
  );
}

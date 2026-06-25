'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  category: string;
  created_at: string;
  author?: string;
};

const PER_PAGE = 9;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function MediaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const from = (page - 1) * PER_PAGE;
    const to = from + PER_PAGE - 1;
    createClient()
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to)
      .then(({ data, count }) => {
        setPosts(data ?? []);
        setTotal(count ?? 0);
        setLoading(false);
      });
  }, [page]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return (
    <>
      <Nav />
      <main>
        <PageHero
          title="Media"
          eyebrow="Grupo Omatapalo · Notícias"
          outlineWord="Media"
          imgSrc="/EN-230-omatapalo-2.jpg"
          imgOpacity={0.35}
          position="center"
        />

        <section style={{ background: '#fff', paddingTop: 'clamp(48px,7vh,80px)', paddingBottom: 'clamp(64px,9vh,100px)' }}>
          <div className="wrap">

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8', fontSize: 14 }}>A carregar...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8', fontSize: 14 }}>Sem notícias publicadas.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px 28px' }} className="media-grid">
                {posts.map((post) => (
                  <article key={post.id} style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} className="media-card">
                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f1f5f9' }}>
                      {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
                          className="media-card-img"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#dde3ed' }} />
                      )}
                    </div>

                    <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.97rem', color: '#0f1a2e', letterSpacing: '-0.01em', lineHeight: 1.3, textTransform: 'uppercase' }}>
                        {post.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                        <time style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.1em', color: '#64748b' }}>
                          {fmtDate(post.created_at)}
                        </time>
                        {post.author && (
                          <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.1em', color: '#94a3b8' }}>
                            {post.author}
                          </span>
                        )}
                      </div>
                      {post.excerpt && (
                        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#475569', lineHeight: 1.6, flex: 1 }}>
                          {post.excerpt}
                        </p>
                      )}
                      {post.slug ? (
                        <a
                          href={`/noticias/${post.slug}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a396e', textDecoration: 'none', fontWeight: 700, marginTop: 'auto' }}
                        >
                          Ver Mais »
                        </a>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 'auto' }}>
                          Ver Mais »
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 56, flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); scrollTop(); }}
                  disabled={page === 1}
                  style={{ padding: '6px 14px', border: '1px solid #dde3ed', borderRadius: 3, background: '#fff', color: page === 1 ? '#c0cad8' : '#1a396e', cursor: page === 1 ? 'default' : 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                >
                  « Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => { setPage(n); scrollTop(); }}
                    style={{ width: 32, height: 32, border: `1px solid ${n === page ? '#1a396e' : '#dde3ed'}`, borderRadius: 3, background: n === page ? '#1a396e' : '#fff', color: n === page ? '#fff' : '#374151', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: n === page ? 700 : 400 }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollTop(); }}
                  disabled={page === totalPages}
                  style={{ padding: '6px 14px', border: '1px solid #dde3ed', borderRadius: 3, background: '#fff', color: page === totalPages ? '#c0cad8' : '#1a396e', cursor: page === totalPages ? 'default' : 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                >
                  Próximo »
                </button>
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .media-card:hover .media-card-img { transform: scale(1.05); }
        @media (max-width: 860px) { .media-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px) { .media-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

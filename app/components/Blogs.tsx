'use client';

import { useEffect, useState } from 'react';
import { Blog } from '@/lib/supabase';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        const response = await fetch(`/api/blogs?${params}`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
        setError('');
      } catch (err) {
        setError('Failed to load blogs. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]);

  const categories = Array.from(new Set(blogs.map((b) => b.category))).sort();
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={{ background: '#0a0e27', color: '#e0e0e0', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Security Research & Insights
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a0a0', marginBottom: '2rem' }}>
            Articles on threat intelligence, malware analysis, detection engineering, and more.
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#1a1f3a',
              border: '1px solid #2a3050',
              borderRadius: '0.5rem',
              color: '#e0e0e0',
              fontSize: '1rem',
              marginBottom: '2rem',
            }}
          />

          {/* Category Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: selectedCategory === 'all' ? '#00ff9d' : '#1a1f3a',
                color: selectedCategory === 'all' ? '#000' : '#e0e0e0',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: selectedCategory === cat ? '#00ff9d' : '#1a1f3a',
                  color: selectedCategory === cat ? '#000' : '#e0e0e0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              background: '#3a1a1a',
              border: '1px solid #ff4444',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              color: '#ff6b6b',
            }}
          >
            {error}
          </div>
        )}

        {/* Blog List */}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                style={{
                  background: '#1a1f3a',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid #2a3050',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#00ff9d';
                  (e.currentTarget as HTMLElement).style.background = '#232a45';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2a3050';
                  (e.currentTarget as HTMLElement).style.background = '#1a1f3a';
                }}
              >
                {/* Category Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    background: '#00ff9d30',
                    color: '#00ff9d',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                  }}
                >
                  {blog.category}
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {blog.title}
                </h2>

                {/* Metadata */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#a0a0a0' }}>
                  <span>📅 {formatDate(blog.created_at)}</span>
                  <span>👁 {blog.views_count.toLocaleString()} views</span>
                  <span>❤️ {blog.likes_count} likes</span>
                </div>

                {/* Content Preview */}
                <p style={{ color: '#c0c0c0', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {blog.content.substring(0, 250)}...
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: '#2a3050',
                          color: '#a0a0a0',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.8rem',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More */}
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.4rem',
                    background: '#00ff9d',
                    color: '#000',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.8';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                  }}
                >
                  Read More →
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBlogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p>No articles found matching that filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

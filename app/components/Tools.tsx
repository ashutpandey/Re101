'use client';

import { useEffect, useState } from 'react';
import { Tool } from '@/lib/supabase';

const CATEGORY_COLORS: Record<string, string> = {
  'static': '#f5a623',
  'dynamic': '#ff4d6d',
  'intel': '#0099ff',
  'detection': '#00ff9d',
  'practice': '#c084fc',
};

const LEVEL_COLORS: Record<string, string> = {
  'Essential': '#00ff9d',
  'Useful': '#0099ff',
  'Advanced': '#f5a623',
  'Setup': '#c084fc',
  'Reference': '#6e7681',
  'Beginner+': '#00ff9d',
  'Intermediate+': '#f5a623',
  'Structured': '#0099ff',
  'All levels': '#c084fc',
};

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        const response = await fetch(`/api/tools?${params}`);
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = await response.json();
        setTools(data);
        setError('');
      } catch (err) {
        setError('Failed to load tools. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [selectedCategory]);

  const categories = Array.from(new Set(tools.map((t) => t.category))).sort();
  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#0a0e27', color: '#e0e0e0', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Malware Analysis Toolkit
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a0a0', marginBottom: '2rem' }}>
            A curated collection of tools for static analysis, dynamic analysis, threat intelligence, detection, and practice.
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tools by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
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
              All Categories
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
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading tools...</p>
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

        {/* Tools Grid */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                style={{
                  background: '#1a1f3a',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid #2a3050',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = CATEGORY_COLORS[tool.category] || '#00ff9d';
                  (e.currentTarget as HTMLElement).style.background = '#232a45';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${CATEGORY_COLORS[tool.category] || '#00ff9d'}40`;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2a3050';
                  (e.currentTarget as HTMLElement).style.background = '#1a1f3a';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Category Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    background: `${CATEGORY_COLORS[tool.category] || '#00ff9d'}30`,
                    color: CATEGORY_COLORS[tool.category] || '#00ff9d',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    width: 'fit-content',
                  }}
                >
                  {tool.category}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {tool.name}
                </h3>

                {/* Description */}
                <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                  {tool.description}
                </p>

                {/* Difficulty & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  {tool.difficulty && (
                    <span
                      style={{
                        background: `${LEVEL_COLORS[tool.difficulty] || '#6e7681'}20`,
                        color: LEVEL_COLORS[tool.difficulty] || '#6e7681',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      {tool.difficulty}
                    </span>
                  )}
                  {tool.rating > 0 && (
                    <span style={{ color: '#f5a623', fontSize: '0.9rem' }}>
                      ★ {tool.rating.toFixed(1)} ({tool.reviews_count} reviews)
                    </span>
                  )}
                </div>

                {/* Tags */}
                {tool.tags && tool.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {tool.tags.map((tag) => (
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

                {/* Visit Button */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.4rem',
                    background: CATEGORY_COLORS[tool.category] || '#00ff9d',
                    color: '#000',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.8';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                  }}
                >
                  Visit →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTools.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p>No tools found matching that filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Community } from '@/lib/supabase';

export default function Communities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/communities');
        if (!response.ok) throw new Error('Failed to fetch communities');
        const data = await response.json();
        setCommunities(data);
        setError('');
      } catch (err) {
        setError('Failed to load communities. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const types = Array.from(new Set(communities.map((c) => c.type))).sort();
  const filteredCommunities = communities.filter((community) => {
    const matchesType = !selectedType || community.type === selectedType;
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      discord: '#5865f2',
      github: '#6e7681',
      slack: '#e01e5a',
      twitter: '#0099ff',
      telegram: '#0088cc',
      forum: '#f5a623',
    };
    return colors[type.toLowerCase()] || '#00ff9d';
  };

  return (
    <div style={{ background: '#0a0e27', color: '#e0e0e0', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Security Communities
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a0a0', marginBottom: '2rem' }}>
            Active communities where security professionals collaborate, share knowledge, and discuss threats.
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search communities..."
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

          {/* Type Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setSelectedType('')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: selectedType === '' ? '#00ff9d' : '#1a1f3a',
                color: selectedType === '' ? '#000' : '#e0e0e0',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              All Types
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: selectedType === type ? '#00ff9d' : '#1a1f3a',
                  color: selectedType === type ? '#000' : '#e0e0e0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading communities...</p>
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

        {/* Communities Grid */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                style={{
                  background: '#1a1f3a',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: `1px solid ${getTypeColor(community.type)}40`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = getTypeColor(community.type);
                  (e.currentTarget as HTMLElement).style.background = '#232a45';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${getTypeColor(community.type)}40`;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${getTypeColor(community.type)}40`;
                  (e.currentTarget as HTMLElement).style.background = '#1a1f3a';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Type Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.3rem',
                    background: `${getTypeColor(community.type)}30`,
                    color: getTypeColor(community.type),
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    width: 'fit-content',
                  }}
                >
                  {community.type.toUpperCase()}
                </div>

                {/* Name */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {community.name}
                </h3>

                {/* Description */}
                <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                  {community.description}
                </p>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#a0a0a0' }}>
                  <span>👥 {community.members_count.toLocaleString()} members</span>
                  <span style={{ color: community.active ? '#00ff9d' : '#ff6b6b' }}>
                    {community.active ? '● Active' : '● Inactive'}
                  </span>
                </div>

                {/* Tags */}
                {community.tags && community.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {community.tags.map((tag) => (
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

                {/* Join Button */}
                <a
                  href={community.platform_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.4rem',
                    background: getTypeColor(community.type),
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
                  Join Community →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCommunities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p>No communities found matching that filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

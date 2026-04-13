'use client';

import { useEffect, useState } from 'react';
import { Person } from '@/lib/supabase';

export default function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Failed to fetch people');
        const data = await response.json();
        setPeople(data);
        setError('');
      } catch (err) {
        setError('Failed to load people. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const allTags = Array.from(
    new Set(people.flatMap((p) => p.expertise || []))
  ).sort();

  const filteredPeople = selectedTag
    ? people.filter((p) => p.expertise?.includes(selectedTag))
    : people;

  return (
    <div style={{ background: '#0a0e27', color: '#e0e0e0', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Security Leaders & Researchers
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a0a0a0', marginBottom: '2rem' }}>
            Follow the experts who are actively shaping threat intelligence and detection engineering.
          </p>

          {/* Tag Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setSelectedTag('')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: selectedTag === '' ? '#00ff9d' : '#1a1f3a',
                color: selectedTag === '' ? '#000' : '#e0e0e0',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: selectedTag === tag ? '#00ff9d' : '#1a1f3a',
                  color: selectedTag === tag ? '#000' : '#e0e0e0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading security experts...</p>
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

        {/* People Grid */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                style={{
                  background: '#1a1f3a',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid #2a3050',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
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
                {person.profile_image_url && (
                  <img
                    src={person.profile_image_url}
                    alt={person.name}
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      marginBottom: '1rem',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {person.name}
                </h3>
                <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '2.7rem' }}>
                  {person.bio}
                </p>

                {/* Expertise Tags */}
                {person.expertise && person.expertise.length > 0 && (
                  <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {person.expertise.map((exp) => (
                      <span
                        key={exp}
                        style={{
                          background: '#00ff9d20',
                          color: '#00ff9d',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.8rem',
                          border: '1px solid #00ff9d40',
                        }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#a0a0a0' }}>
                  <span>👥 {person.followers_count.toLocaleString()} followers</span>
                  <span>📝 {person.contributions_count} contributions</span>
                </div>

                {/* Social Links */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {person.github_url && (
                    <a
                      href={person.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.4rem',
                        background: '#2a3050',
                        color: '#e0e0e0',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#00ff9d';
                        (e.currentTarget as HTMLElement).style.color = '#000';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#2a3050';
                        (e.currentTarget as HTMLElement).style.color = '#e0e0e0';
                      }}
                    >
                      GitHub
                    </a>
                  )}
                  {person.twitter_url && (
                    <a
                      href={person.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.4rem',
                        background: '#2a3050',
                        color: '#e0e0e0',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#0099ff';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#2a3050';
                        (e.currentTarget as HTMLElement).style.color = '#e0e0e0';
                      }}
                    >
                      Twitter
                    </a>
                  )}
                  {person.linkedin_url && (
                    <a
                      href={person.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.4rem',
                        background: '#2a3050',
                        color: '#e0e0e0',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#0a66c2';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#2a3050';
                        (e.currentTarget as HTMLElement).style.color = '#e0e0e0';
                      }}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPeople.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a0a0a0' }}>
            <p>No people found matching that filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

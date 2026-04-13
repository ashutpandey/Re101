'use client';

import { useState } from 'react';

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  platform_url: string;
  members_count: number;
  tags: string[];
  type: string;
  active: boolean;
}

// Sample communities data
const SAMPLE_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'RE101 Discord Community',
    description: 'Active community of malware analysts and reverse engineers sharing techniques, tools, and samples.',
    category: 'Reverse Engineering',
    platform_url: 'https://discord.gg/example',
    members_count: 5000,
    tags: ['discord', 'malware', 'community'],
    type: 'Discord',
    active: true,
  },
  {
    id: '2',
    name: 'SANS Institute Community',
    description: 'Professional security training and community forums for threat intelligence and incident response.',
    category: 'General Security',
    platform_url: 'https://www.sans.org',
    members_count: 50000,
    tags: ['training', 'certification', 'security'],
    type: 'Forum',
    active: true,
  },
  {
    id: '3',
    name: 'OWASP on Slack',
    description: 'Open Web Application Security Project community discussing web security and best practices.',
    category: 'Web Security',
    platform_url: 'https://owasp.slack.com',
    members_count: 15000,
    tags: ['web-security', 'owasp', 'slack'],
    type: 'Slack',
    active: true,
  },
  {
    id: '4',
    name: 'Malware Analysis GitHub Discussions',
    description: 'Technical discussions on malware analysis, IoCs, and open-source tools.',
    category: 'Malware Analysis',
    platform_url: 'https://github.com/topics/malware-analysis',
    members_count: 8000,
    tags: ['github', 'malware', 'open-source'],
    type: 'GitHub',
    active: true,
  },
];

export default function Communities() {
  const [communities] = useState<Community[]>(SAMPLE_COMMUNITIES);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

        {/* Communities Grid */}
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
      </div>
    </div>
  );
}

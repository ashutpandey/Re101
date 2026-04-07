import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  try {
    console.log('Starting Supabase database seeding...');

    // Clear existing data
    await supabase.from('tools').delete().neq('id', null);
    await supabase.from('people').delete().neq('id', null);
    await supabase.from('blogs').delete().neq('id', null);
    await supabase.from('communities').delete().neq('id', null);

    console.log('Cleared existing data');

    // Seed tools
    const tools = [
      {
        name: 'Ghidra',
        desc: 'Open-source reverse engineering framework',
        category: 'Reverse Engineering',
        categoryLabel: 'Reverse Engineering',
        categoryColor: '#FF6B6B',
        categoryIcon: '🔍',
        categoryDesc: 'Tools for analyzing and understanding binaries',
        url: 'https://ghidra-sre.org',
        free: true,
        platform: 'Cross-platform',
        level: 'Intermediate'
      },
      {
        name: 'IDA Pro',
        desc: 'Interactive Disassembler - industry standard',
        category: 'Reverse Engineering',
        categoryLabel: 'Reverse Engineering',
        categoryColor: '#FF6B6B',
        categoryIcon: '🔍',
        categoryDesc: 'Tools for analyzing and understanding binaries',
        url: 'https://www.hex-rays.com/ida-pro',
        free: false,
        platform: 'Cross-platform',
        level: 'Advanced'
      },
      {
        name: 'Wireshark',
        desc: 'Network protocol analyzer',
        category: 'Network Analysis',
        categoryLabel: 'Network Analysis',
        categoryColor: '#4ECDC4',
        categoryIcon: '📡',
        categoryDesc: 'Tools for network traffic inspection',
        url: 'https://www.wireshark.org',
        free: true,
        platform: 'Cross-platform',
        level: 'Beginner'
      }
    ];

    const { error: toolsError } = await supabase
      .from('tools')
      .insert(tools);

    if (toolsError) throw toolsError;
    console.log(`Seeded ${tools.length} tools`);

    // Seed people
    const people = [
      {
        name: 'Lena',
        title: 'Reverse Engineer',
        bio: 'Expert in binary analysis and malware research',
        url: 'https://twitter.com/malwareunicorn',
        platform: 'Twitter',
        category: 'Security Researcher'
      },
      {
        name: 'John Hammond',
        title: 'Security Researcher',
        bio: 'Cybersecurity educator and researcher',
        url: 'https://twitter.com/_JohnHammond',
        platform: 'Twitter',
        category: 'Security Researcher'
      }
    ];

    const { error: peopleError } = await supabase
      .from('people')
      .insert(people);

    if (peopleError) throw peopleError;
    console.log(`Seeded ${people.length} people`);

    // Seed blogs
    const blogs = [
      {
        title: 'Introduction to Reverse Engineering',
        desc: 'Learn the basics of reverse engineering',
        url: 'https://example.com/blog1',
        author: 'John Doe',
        platform: 'Medium',
        category: 'Reverse Engineering'
      },
      {
        title: 'Malware Analysis Fundamentals',
        desc: 'Understanding malware analysis techniques',
        url: 'https://example.com/blog2',
        author: 'Jane Smith',
        platform: 'Blog',
        category: 'Malware Analysis'
      }
    ];

    const { error: blogsError } = await supabase
      .from('blogs')
      .insert(blogs);

    if (blogsError) throw blogsError;
    console.log(`Seeded ${blogs.length} blogs`);

    // Seed communities
    const communities = [
      {
        reddits: [
          { name: 'r/ReverseEngineering', url: 'https://reddit.com/r/ReverseEngineering', desc: 'High quality posts on binary RE', tag: 'RE', members: '~70k' },
          { name: 'r/Malware', url: 'https://reddit.com/r/Malware', desc: 'Malware identification and analysis', tag: 'Malware', members: '~60k' }
        ],
        discords: [
          { name: 'OALabs RE Discord', desc: 'Reverse engineering community', url: 'https://discord.gg/oalabs', tag: 'RE' },
          { name: 'Hack The Box', desc: 'CTF and security challenges', url: 'https://discord.gg/hackthebox', tag: 'CTF' }
        ]
      }
    ];

    const { error: communitiesError } = await supabase
      .from('communities')
      .insert(communities);

    if (communitiesError) throw communitiesError;
    console.log('Seeded communities');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedPeople() {
  const people = [
    {
      name: 'vx-underground',
      bio: 'Largest public malware sample archive on the planet. First to publish threat actor statements, sample drops, and intelligence.',
      expertise: ['Malware Intel', 'Threat Intelligence'],
      github_url: 'https://github.com/vxunderground',
      twitter_url: 'https://x.com/vxunderground',
      followers_count: 50000,
      contributions_count: 10000,
    },
    {
      name: 'Kevin Beaumont',
      bio: 'Ex-Microsoft, runs DoubleParsar.com. First responder on almost every major CVE exploitation wave.',
      expertise: ['Threat Intel', 'CVE Analysis'],
      twitter_url: 'https://x.com/GossiTheDog',
      followers_count: 150000,
      contributions_count: 5000,
    },
    {
      name: 'hasherezade',
      bio: 'Malware researcher at Malwarebytes. Publishes detailed RE write-ups, builds free tools (PE-bear, hollows_hunter).',
      expertise: ['Malware RE', 'Reverse Engineering'],
      github_url: 'https://github.com/hasherezade',
      twitter_url: 'https://x.com/hasherezade',
      followers_count: 120000,
      contributions_count: 8000,
    },
    {
      name: 'OALabs',
      bio: 'The best YouTube channel for practical malware analysis. Step-by-step walkthroughs of real malware using Ghidra and x64dbg.',
      expertise: ['Malware Analysis', 'RE / Analysis'],
      twitter_url: 'https://x.com/OALabs',
      followers_count: 80000,
      contributions_count: 3000,
    },
    {
      name: 'Florian Roth',
      bio: 'Author of THOR scanner, creator of Sigma detection rules, prolific YARA rule writer.',
      expertise: ['Detection Eng', 'YARA Rules'],
      github_url: 'https://github.com/Neo23x0',
      twitter_url: 'https://x.com/cyb3rops',
      followers_count: 100000,
      contributions_count: 20000,
    },
  ];

  for (const person of people) {
    const { error } = await supabase
      .from('people')
      .insert([
        {
          name: person.name,
          bio: person.bio,
          expertise: person.expertise,
          github_url: person.github_url,
          twitter_url: person.twitter_url,
          linkedin_url: null,
          profile_image_url: null,
          followers_count: person.followers_count,
          contributions_count: person.contributions_count,
        },
      ]);

    if (error) {
      console.error(`Error inserting ${person.name}:`, error);
    } else {
      console.log(`✓ Inserted ${person.name}`);
    }
  }
}

async function seedTools() {
  const tools = [
    {
      name: 'Ghidra',
      description: 'NSA free disassembler and decompiler. The gold standard for free RE.',
      category: 'static',
      url: 'https://ghidra-sre.org/',
      difficulty: 'Essential',
      tags: ['disassembly', 'decompiler', 'free'],
      rating: 4.9,
      reviews_count: 2500,
    },
    {
      name: 'IDA Free',
      description: 'The industry-standard disassembler. Free version handles 32-bit x86 and 64-bit x86.',
      category: 'static',
      url: 'https://hex-rays.com/ida-free/',
      difficulty: 'Essential',
      tags: ['disassembly', 'industry-standard'],
      rating: 4.8,
      reviews_count: 3000,
    },
    {
      name: 'x64dbg',
      description: 'Free, open-source Windows debugger for 32/64-bit. The go-to for malware debugging.',
      category: 'dynamic',
      url: 'https://x64dbg.com/',
      difficulty: 'Essential',
      tags: ['debugger', 'windows', 'dynamic-analysis'],
      rating: 4.7,
      reviews_count: 1800,
    },
    {
      name: 'Wireshark',
      description: 'Standard for network traffic capture and analysis. Captures C2 traffic and identifies protocols.',
      category: 'dynamic',
      url: 'https://www.wireshark.org/',
      difficulty: 'Essential',
      tags: ['network', 'pcap', 'traffic-analysis'],
      rating: 4.8,
      reviews_count: 3500,
    },
    {
      name: 'VirusTotal',
      description: 'Multi-engine scan + IOC relationships. Essential for attribution and threat intelligence.',
      category: 'intel',
      url: 'https://www.virustotal.com/',
      difficulty: 'Essential',
      tags: ['ioc-lookup', 'threat-intel', 'malware-samples'],
      rating: 4.9,
      reviews_count: 5000,
    },
    {
      name: 'YARA',
      description: 'Pattern matching for malware detection. Write rules against byte patterns and strings.',
      category: 'detection',
      url: 'https://github.com/VirusTotal/yara',
      difficulty: 'Essential',
      tags: ['detection', 'pattern-matching', 'rules'],
      rating: 4.8,
      reviews_count: 2200,
    },
  ];

  for (const tool of tools) {
    const { error } = await supabase
      .from('tools')
      .insert([
        {
          name: tool.name,
          description: tool.description,
          category: tool.category,
          url: tool.url,
          difficulty: tool.difficulty,
          tags: tool.tags,
          rating: tool.rating,
          reviews_count: tool.reviews_count,
        },
      ]);

    if (error) {
      console.error(`Error inserting ${tool.name}:`, error);
    } else {
      console.log(`✓ Inserted tool: ${tool.name}`);
    }
  }
}

async function seedBlogs() {
  const blogs = [
    {
      title: 'Introduction to Reverse Engineering Malware',
      content: 'This comprehensive guide covers the fundamentals of reverse engineering, from understanding CPU architecture to analyzing real malware samples. Learn the tools, techniques, and methodologies used by professional malware analysts.',
      category: 'Reverse Engineering',
      tags: ['malware', 'reverse-engineering', 'tutorial'],
      published: true,
      likes_count: 350,
      views_count: 5000,
    },
    {
      title: 'Threat Intelligence: Tracking Ransomware Operations',
      content: 'An in-depth analysis of how to track ransomware groups, identify infrastructure, and understand their TTPs. Learn about attribution, IOC pivoting, and building intelligence reports.',
      category: 'Threat Intelligence',
      tags: ['ransomware', 'threat-intel', 'attribution'],
      published: true,
      likes_count: 280,
      views_count: 4200,
    },
    {
      title: 'Detection Engineering Best Practices',
      content: 'Learn how to write effective Sigma and YARA rules, understand the detection engineering workflow, and build a detection strategy that catches adversaries while minimizing false positives.',
      category: 'Detection',
      tags: ['detection', 'sigma', 'yara', 'siem'],
      published: true,
      likes_count: 420,
      views_count: 6500,
    },
    {
      title: 'Network Analysis with Wireshark and Zeek',
      content: 'Master network traffic analysis using industry-standard tools. Learn to identify command-and-control communications, lateral movement, and data exfiltration.',
      category: 'Network Analysis',
      tags: ['network', 'wireshark', 'zeek', 'pcap'],
      published: true,
      likes_count: 310,
      views_count: 4800,
    },
  ];

  for (const blog of blogs) {
    const { error } = await supabase
      .from('blogs')
      .insert([
        {
          title: blog.title,
          content: blog.content,
          author_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          category: blog.category,
          tags: blog.tags,
          published: blog.published,
          likes_count: blog.likes_count,
          views_count: blog.views_count,
        },
      ]);

    if (error) {
      console.error(`Error inserting blog ${blog.title}:`, error);
    } else {
      console.log(`✓ Inserted blog: ${blog.title}`);
    }
  }
}

async function seedCommunities() {
  const communities = [
    {
      name: 'RE101 Discord Community',
      description: 'Active community of malware analysts and reverse engineers sharing techniques, tools, and samples.',
      category: 'Reverse Engineering',
      platform_url: 'https://discord.gg/example',
      members_count: 5000,
      tags: ['discord', 'malware', 'community'],
      type: 'discord',
      active: true,
    },
    {
      name: 'SANS Institute Community',
      description: 'Professional security training and community forums for threat intelligence and incident response.',
      category: 'General Security',
      platform_url: 'https://www.sans.org',
      members_count: 50000,
      tags: ['training', 'certification', 'security'],
      type: 'forum',
      active: true,
    },
    {
      name: 'OWASP on Slack',
      description: 'Open Web Application Security Project community discussing web security and best practices.',
      category: 'Web Security',
      platform_url: 'https://owasp.slack.com',
      members_count: 15000,
      tags: ['web-security', 'owasp', 'slack'],
      type: 'slack',
      active: true,
    },
    {
      name: 'Malware Analysis GitHub Discussions',
      description: 'Technical discussions on malware analysis, IoCs, and open-source tools.',
      category: 'Malware Analysis',
      platform_url: 'https://github.com/topics/malware-analysis',
      members_count: 8000,
      tags: ['github', 'malware', 'open-source'],
      type: 'github',
      active: true,
    },
  ];

  for (const community of communities) {
    const { error } = await supabase
      .from('communities')
      .insert([
        {
          name: community.name,
          description: community.description,
          category: community.category,
          platform_url: community.platform_url,
          members_count: community.members_count,
          tags: community.tags,
          type: community.type,
          active: community.active,
        },
      ]);

    if (error) {
      console.error(`Error inserting community ${community.name}:`, error);
    } else {
      console.log(`✓ Inserted community: ${community.name}`);
    }
  }
}

async function main() {
  console.log('🌱 Seeding Supabase database...\n');

  console.log('Seeding people...');
  await seedPeople();
  console.log('');

  console.log('Seeding tools...');
  await seedTools();
  console.log('');

  console.log('Seeding blogs...');
  await seedBlogs();
  console.log('');

  console.log('Seeding communities...');
  await seedCommunities();
  console.log('');

  console.log('✅ Database seeded successfully!');
}

main().catch(console.error);

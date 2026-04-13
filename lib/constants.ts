export const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export const THREAT_SEVERITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const THREAT_CATEGORIES = [
  'Vulnerability',
  'Malware',
  'Exploit',
  'Phishing',
  'Data Breach',
  'Zero-Day',
  'APT',
  'Ransomware',
  'DDoS',
  'Supply Chain',
] as const;

export const ROADMAP_PHASES = [
  'Discovery',
  'Planning',
  'Development',
  'Testing',
  'Deployment',
  'Maintenance',
] as const;

export const COMMUNITY_ROLES = [
  'Admin',
  'Moderator',
  'Contributor',
  'Community Member',
] as const;

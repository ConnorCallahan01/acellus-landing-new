import { writable, derived } from 'svelte/store';

// Current section index (0 = cover, 1 = problem, etc.)
// Initialize at 0 (cover section)
export const currentSection = writable(0);

// Scroll progress within current section (0-1)
export const sectionProgress = writable(0);

// Nav state: 'expanded' or 'collapsed'
export const navState = derived(currentSection, ($section) => {
  // Expanded on cover (0) and footer (7)
  return $section === 0 || $section === 7 ? 'expanded' : 'collapsed';
});

// Active nav item based on section
export const activeNavItem = derived(currentSection, ($section) => {
  const sections = ['cover', 'problem', 'solution', 'solution', 'howwework', 'team', 'newsroom', 'footer'];
  return sections[$section] || 'cover';
});

// Section names for navigation
export const sectionNames = [
  'Cover',
  'Problem',
  'Solution',
  'Solution',
  'How We Work',
  'Our Team',
  'Newsroom',
  'Contact'
];

// Total number of sections
export const totalSections = 8;

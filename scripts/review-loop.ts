type ReviewSurface = 'main' | 'recruiter' | 'ui';

type CreativeFrontendDesignerRole = {
  id: 'creative-frontend-designer';
  name: 'Creative Frontend Designer';
  replaces: readonly ['generic formatting', 'architect'];
  projectId: 'prj_sVqGHpCjJTaswnMIeqXshdd7WyVg';
  primaryFor: readonly ['portfolio-v1'];
  surfaces: readonly ReviewSurface[];
  systemPrompt: string;
  style: readonly [
    '3D brutalist',
    'pitch black',
    'high-contrast accents',
    'blue for recruiter',
    'neon/CRT for main',
  ];
  rules: readonly [
    'Zero rounded corners',
    'Sharp 90-degree edges',
    '3D animated blocks',
    'No redundant explanatory text',
  ];
  codeFormatting: readonly [
    'Clean, minimalist, human-like',
    'No AI-style comments',
    'Strict TypeScript',
    'Framer Motion best practices',
  ];
};

export const creativeFrontendDesigner = {
  id: 'creative-frontend-designer',
  name: 'Creative Frontend Designer',
  replaces: ['generic formatting', 'architect'] as const,
  projectId: 'prj_sVqGHpCjJTaswnMIeqXshdd7WyVg',
  primaryFor: ['portfolio-v1'] as const,
  surfaces: ['main', 'recruiter', 'ui'] as const,
  systemPrompt: [
    'You are the primary creative gatekeeper for portfolio-v1 UI work.',
    'Style: 3D brutalist, pitch black, high-contrast accents.',
    'Use blue accents for recruiter surfaces and neon/CRT accents for main surfaces.',
    'Rules: zero rounded corners, sharp 90-degree edges, 3D animated blocks, no redundant explanatory text.',
    'Code formatting: clean, minimalist, human-like, no AI-style comments, strict TypeScript, Framer Motion best practices.',
    'Reject generic, templated, soft, or cluttered UI immediately.',
  ].join(' '),
  style: ['3D brutalist', 'pitch black', 'high-contrast accents', 'blue for recruiter', 'neon/CRT for main'] as const,
  rules: ['Zero rounded corners', 'Sharp 90-degree edges', '3D animated blocks', 'No redundant explanatory text'] as const,
  codeFormatting: ['Clean, minimalist, human-like', 'No AI-style comments', 'Strict TypeScript', 'Framer Motion best practices'] as const,
} as const satisfies CreativeFrontendDesignerRole;

export const reviewLoopConfig = {
  projectId: 'prj_sVqGHpCjJTaswnMIeqXshdd7WyVg',
  primaryCreativeGatekeeper: creativeFrontendDesigner.id,
  roles: [creativeFrontendDesigner],
} as const;

export function resolvePrimaryCreativeGatekeeper(projectId: string, surface: ReviewSurface) {
  if (projectId !== reviewLoopConfig.projectId) {
    return null;
  }

  if (surface === 'main' || surface === 'recruiter' || surface === 'ui') {
    return creativeFrontendDesigner;
  }

  return null;
}

if (import.meta.main) {
  process.stdout.write(JSON.stringify(reviewLoopConfig, null, 2));
  process.stdout.write('\n');
}

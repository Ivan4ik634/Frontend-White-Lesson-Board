export const siteConfig = {
  name: 'Claro',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: 'Claro | Teamwork Whiteboard',
  description:
    'Create a shared board for work, study, friends, and teams. Invite people, sketch ideas, assign tasks, explain concepts, and finish projects together.',
  keywords: [
    'teamwork whiteboard',
    'shared team board',
    'online whiteboard for groups',
    'work planning whiteboard',
    'study group workspace',
    'collaboration board for friends',
  ],
} as const;

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;

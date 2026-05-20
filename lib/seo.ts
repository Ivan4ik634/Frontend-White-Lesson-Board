export const siteConfig = {
  name: 'Claro',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: 'Claro | Collaborative Study Board for Teams',
  description:
    'Create a shared study board, invite your team, sketch ideas, explain lessons, and learn together in one calm collaborative workspace.',
  keywords: [
    'collaborative study board',
    'online whiteboard for students',
    'team learning board',
    'lesson board',
    'shared classroom whiteboard',
    'study workspace',
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

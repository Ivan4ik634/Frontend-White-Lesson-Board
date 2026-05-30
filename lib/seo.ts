export const siteConfig = {
  name: 'Claro',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: 'Claro | School Teamwork Whiteboard',
  description:
    'Create a shared board for school teamwork, invite classmates, sketch ideas, divide tasks, explain lessons, and finish group projects together.',
  keywords: [
    'school teamwork whiteboard',
    'group project board',
    'online whiteboard for students',
    'class team board',
    'shared classroom whiteboard',
    'study group workspace',
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

export const colors = [
  { name: 'red', value: '#ef4444' },
  { name: 'green', value: '#22c55e' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'yellow', value: '#eab308' },
  { name: 'orange', value: '#f97316' },
  { name: 'purple', value: '#a855f7' },
  { name: 'pink', value: '#ec4899' },
  { name: 'black', value: '#111827' },
  { name: 'white', value: '#ffffff' },
] as const;

export type Color = (typeof colors)[number];

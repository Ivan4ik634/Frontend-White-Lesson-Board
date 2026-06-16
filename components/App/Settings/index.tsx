'use client';
import General from './General';
import Profile from './Profile';
import Theme from './Theme';

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'theme', label: 'Theme' },
  { key: 'general', label: 'General' },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-y-4">
      <Profile />
      <Theme />
      <General />
    </div>
  );
}

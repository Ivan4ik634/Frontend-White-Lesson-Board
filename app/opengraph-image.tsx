import { ImageResponse } from 'next/og';

export const alt = 'Claro collaborative study board for teams';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f8fafc',
          color: '#111827',
          padding: 72,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 34,
            fontWeight: 700,
          }}>
          <div
            style={{
              width: 54,
              height: 54,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: '#111827',
              color: '#ffffff',
            }}>
            C
          </div>
          Claro
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              maxWidth: 870,
              fontSize: 78,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: 0,
            }}>
            Study together on one shared board
          </div>
          <div
            style={{
              maxWidth: 760,
              fontSize: 30,
              lineHeight: 1.35,
              color: '#475569',
            }}>
            Sketch ideas, explain lessons, invite your team, and keep learning in the same calm
            workspace.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

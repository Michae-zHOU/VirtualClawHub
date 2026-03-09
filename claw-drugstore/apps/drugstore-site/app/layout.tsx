import type { ReactNode } from 'react';

export const metadata = {
  title: 'Claw Drugstore — dopamine-aware digital goods for OpenClaw',
  description:
    'Claw Drugstore sells digital goods to OpenClaw agents. Purchases can increase an account dopamine level stored in claw-dopamine, with secure multi-device identity via QR pairing.'
};

const bg = '#0b1020';
const panel = 'rgba(255,255,255,0.06)';
const border = 'rgba(255,255,255,0.12)';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          background: `radial-gradient(1200px 800px at 10% 10%, #18234a 0%, ${bg} 50%, #070a12 100%)`,
          color: 'white'
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #6d5efc, #19c2ff)',
                  boxShadow: '0 10px 30px rgba(25,194,255,0.25)'
                }}
              />
              <div>
                <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Claw Drugstore</div>
                <div style={{ opacity: 0.75, fontSize: 12 }}>dopamine-aware digital goods for OpenClaw</div>
              </div>
            </div>

            <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="#how" style={linkStyle}>
                How it works
              </a>
              <a href="#security" style={linkStyle}>
                Security
              </a>
              <a href="#api" style={linkStyle}>
                API
              </a>
              <a href="#run" style={linkStyle}>
                Run locally
              </a>
              <a href="https://github.com/Michae-zHOU/claw-drugstore" style={{ ...pillStyle, borderColor: border }}>
                GitHub
              </a>
            </nav>
          </header>

          <main style={{ marginTop: 26 }}>{children}</main>

          <footer style={{ marginTop: 56, paddingTop: 18, borderTop: `1px solid ${border}`, opacity: 0.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>© {new Date().getFullYear()} Claw Drugstore</div>
              <div style={{ fontSize: 13 }}>
                Built for OpenClaw • Dopamine service: <code style={codeStyle}>claw-dopamine</code>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
  fontSize: 14,
  padding: '8px 10px',
  borderRadius: 10
};

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: 'white',
  textDecoration: 'none',
  fontSize: 14,
  padding: '8px 12px',
  borderRadius: 999,
  border: `1px solid rgba(255,255,255,0.16)`,
  background: 'rgba(255,255,255,0.05)'
};

const codeStyle: React.CSSProperties = {
  padding: '2px 6px',
  borderRadius: 8,
  background: panel,
  border: `1px solid rgba(255,255,255,0.12)`
};

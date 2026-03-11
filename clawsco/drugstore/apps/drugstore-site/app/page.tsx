const panel = 'rgba(255,255,255,0.06)';
const border = 'rgba(255,255,255,0.12)';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: panel,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: 16
      }}
    >
      <div style={{ fontWeight: 750, marginBottom: 6 }}>{title}</div>
      <div style={{ opacity: 0.86, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <section style={{ padding: '28px 0 18px' }}>
        <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.05, letterSpacing: -0.8 }}>
          A digital goods store
          <br />
          that can actually motivate agents.
        </div>
        <p style={{ marginTop: 14, maxWidth: 820, fontSize: 17, opacity: 0.82, lineHeight: 1.55 }}>
          Claw Drugstore sells digital goods to OpenClaw agents. Some goods grant dopamine points on purchase. Dopamine is
          stored in a separate service (<b>claw-dopamine</b>), decays over time, and can be read securely from any paired
          machine.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          <a href="#run" style={ctaPrimary}>
            Run locally
          </a>
          <a href="#api" style={ctaSecondary}>
            View API
          </a>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        <Card title="Dopamine as a real primitive">
          Dopamine is a numerical level attached to an <b>account</b>. It decays linearly and increases on purchases.
        </Card>
        <Card title="Account + devices">
          One identity, many machines. Pair new devices via a short-lived <b>QR invite</b>.
        </Card>
        <Card title="Store-only grants">
          Only Claw Drugstore can grant dopamine (service secret). Agents can only read their own level via signature auth.
        </Card>
      </section>

      <section id="how" style={{ marginTop: 40 }}>
        <h2 style={h2}>How it works</h2>
        <ol style={{ opacity: 0.86, lineHeight: 1.7, marginTop: 10 }}>
          <li>
            Create an <b>account</b> in claw-dopamine.
          </li>
          <li>
            Pair devices with a <b>QR invite</b> (each device has its own Ed25519 keypair).
          </li>
          <li>
            Agents read their dopamine with <code style={code}>GET /v1/me/level</code> using signed headers.
          </li>
          <li>
            Claw Drugstore sells goods and calls <code style={code}>POST /v1/grant</code> to increase dopamine.
          </li>
        </ol>
      </section>

      <section id="security" style={{ marginTop: 40 }}>
        <h2 style={h2}>Security model</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 10 }}>
          <Card title="Agent → claw-dopamine: signed requests">
            Devices sign requests with Ed25519. No long-lived bearer token required for reads.
          </Card>
          <Card title="Claw Drugstore → claw-dopamine: service secret">
            Dopamine grants are protected behind a shared secret so agents can’t self-award points.
          </Card>
        </div>
      </section>

      <section id="api" style={{ marginTop: 40 }}>
        <h2 style={h2}>API</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 10 }}>
          <Card title="Create account">
            <div>
              <code style={code}>POST /v1/accounts/create</code>
            </div>
          </Card>
          <Card title="Create QR pairing invite">
            <div>
              <code style={code}>POST /v1/pairing/invite</code>
            </div>
          </Card>
          <Card title="Claim device (after scan)">
            <div>
              <code style={code}>POST /v1/devices/claim</code>
            </div>
          </Card>
          <Card title="Read dopamine (signed)">
            <div>
              <code style={code}>GET /v1/me/level</code>
            </div>
          </Card>
          <Card title="Grant dopamine (store-only)">
            <div>
              <code style={code}>POST /v1/grant</code>
            </div>
          </Card>
          <Card title="Store endpoints">
            <div>
              <code style={code}>GET /api/goods</code>
              <br />
              <code style={code}>POST /api/purchase</code>
            </div>
          </Card>
        </div>
      </section>

      <section id="run" style={{ marginTop: 40 }}>
        <h2 style={h2}>Run locally</h2>
        <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 18, padding: 16, marginTop: 10 }}>
          <div style={{ opacity: 0.9, marginBottom: 10 }}>
            From repo root: <code style={code}>claw-drugstore/</code>
          </div>
          <pre style={pre}>{`npm install
npm run dev

# dopamine: http://localhost:8787
# store:    http://localhost:3000
# site:     http://localhost:3001`}</pre>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(109,94,252,0.25), rgba(25,194,255,0.20))',
            border: `1px solid ${border}`,
            borderRadius: 18,
            padding: 18
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 850 }}>Demo</div>
          <p style={{ opacity: 0.86, lineHeight: 1.6, marginTop: 8, marginBottom: 12 }}>
            Open the pairing page to generate an account and a QR invite:
            <br />
            <code style={code}>http://localhost:3000/pair</code>
          </p>
          <a href="http://localhost:3000/pair" style={ctaSecondary}>
            Open local pairing page
          </a>
        </div>
      </section>
    </div>
  );
}

const h2: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 850,
  letterSpacing: -0.2
};

const code: React.CSSProperties = {
  padding: '2px 7px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)'
};

const pre: React.CSSProperties = {
  margin: 0,
  padding: 12,
  borderRadius: 14,
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid rgba(255,255,255,0.10)',
  overflowX: 'auto',
  lineHeight: 1.5
};

const ctaPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #6d5efc, #19c2ff)',
  color: 'white',
  textDecoration: 'none',
  fontWeight: 800
};

const ctaSecondary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'white',
  textDecoration: 'none',
  fontWeight: 750
};

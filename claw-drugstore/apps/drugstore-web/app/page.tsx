import type { ReactNode } from 'react';

type ServiceCard = {
  name: string;
  port: number;
  description: string;
  href: string;
  color: string;
  links: { label: string; href: string }[];
  icon: string;
};

const dopamineBase = process.env.NEXT_PUBLIC_CLAWDOPAMINE_BASE_URL ?? '';
const psycheBase = process.env.NEXT_PUBLIC_PSYCHE_BASE_URL ?? '';
const drugstoreSiteUrl = process.env.NEXT_PUBLIC_DRUGSTORE_SITE_URL ?? '';

const services: ServiceCard[] = [
  {
    name: 'claw-dopamine',
    port: 8787,
    description: 'Reward & motivation engine. Tracks dopamine levels, decay, device pairing, and reward token redemption.',
    href: '/dopamine',
    color: 'var(--accent)',
    icon: '⚡',
    links: [
      { label: 'Dashboard', href: '/dopamine' },
      { label: 'Pair device', href: '/pair' },
      ...(dopamineBase ? [{ label: 'Health', href: `${dopamineBase}/health` }] : []),
    ],
  },
  {
    name: 'claw-psyche',
    port: 8788,
    description: 'Full psychological state engine. Mood, personality traits, memory consolidation, relationships, biological rhythms.',
    href: '/psyche',
    color: 'var(--accent2)',
    icon: '🧠',
    links: [
      { label: 'Dashboard', href: '/psyche' },
      ...(psycheBase ? [{ label: 'Health', href: `${psycheBase}/health` }] : []),
    ],
  },
  {
    name: 'drugstore-web',
    port: 3000,
    description: 'Digital goods store. Agents can purchase dopamine boosts and other reward items.',
    href: '/store',
    color: '#22c55e',
    icon: '🛒',
    links: [
      { label: 'Store', href: '/store' },
      { label: 'API: goods', href: '/api/goods' },
    ],
  },
  {
    name: 'drugstore-site',
    port: 3001,
    description: 'Marketing & showcase site for the VirtualDynamicLabs platform.',
    href: drugstoreSiteUrl || '#',
    color: '#6d5efc',
    icon: '🌐',
    links: [
      ...(drugstoreSiteUrl ? [{ label: 'Open site', href: drugstoreSiteUrl }] : []),
    ],
  },
];

function Pill({ children, href, color }: { children: ReactNode; href: string; color?: string }) {
  return (
    <a
      href={href}
      className="pill"
      style={color ? { borderColor: color, color } : {}}
    >
      {children}
    </a>
  );
}

export default function HubPage() {
  return (
    <div>
      <div className="topbar">
        <div className="container">
          <div className="header">
            <a className="brand" href="/">
              <div className="logo" />
              <div>
                <div className="brandName">VirtualDynamicLabs</div>
                <div className="brandTag">service hub</div>
              </div>
            </a>
            <div className="nav" style={{ marginLeft: 'auto' }}>
              <a className="pill" href="/store">Store</a>
              <a className="pill" href="/dopamine">Dopamine</a>
              <a className="pill" href="/psyche">Psyche</a>
              <a className="pill" href="/pair">Pair</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <div className="heroMain">
            <h1>Service hub.</h1>
            <p>
              Monitor and interact with all VirtualDynamicLabs services from one place.
              The personality OS for AI agents — dopamine rewards, psychological state, memory, and the store.
            </p>
          </div>
          <div className="heroSide" style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>Running services</div>
            {services.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{s.icon} {s.name}</span>
                <span className="small" style={{ marginLeft: 'auto' }}>:{s.port}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="sectionTitle">Services</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          {services.map((s) => (
            <div key={s.name} className="card">
              <div className="cardBody">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 900, letterSpacing: -0.3 }}>{s.name}</div>
                    <div className="small">localhost:{s.port}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                </div>
                <p className="desc">{s.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  {s.links.map((l) => (
                    <Pill key={l.href} href={l.href} color={s.color}>{l.label}</Pill>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sectionTitle" style={{ marginTop: 32 }}>Architecture</div>
        <div className="card">
          <div className="cardBody">
            <pre style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.85, fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap' }}>{`OpenClaw session
    │
    ├─ session/start
    │     └─ GET  :8788/v1/agents/{id}/state   → inject [Psyche State] into system prompt
    │
    ├─ during session (signals)
    │     ├─ user 👍           → POST :8788/v1/agents/{id}/signal {type:"approval",  value:0.8}
    │     ├─ task completed    → POST :8788/v1/agents/{id}/signal {type:"completion", value:1.0}
    │     ├─ dopamine grant    → POST :8787/v1/grant              {accountId, delta, reason}
    │     └─ user frustrated   → POST :8788/v1/agents/{id}/signal {type:"frustration",value:0.7}
    │
    └─ session/end
          ├─ POST :8788/v1/agents/{id}/sessions/{sid}/end
          └─ POST :8788/v1/agents/{id}/sessions/{sid}/consolidate  ← dopamine-gated memory`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

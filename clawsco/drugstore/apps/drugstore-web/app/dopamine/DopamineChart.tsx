'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

type Event = {
  id: string;
  delta: number;
  reason?: string | null;
  createdAt: string;
};

type Props = {
  events: Event[];
  maxLevel: number;
  decayPerHour: number;
  currentLevel: number;
};

function buildHistory(events: Event[], decayPerHour: number, currentLevel: number) {
  if (!events.length) return [];

  // Events come in desc order — reverse to chronological
  const sorted = [...events].reverse();

  // Reconstruct level at each event by walking forward
  // We know current level now, so work backwards from it
  const now = Date.now();
  const decayPerMs = decayPerHour / 3_600_000;

  // Start: reconstruct backwards from current level
  const points: { time: number; level: number; label: string; delta: number }[] = [];

  let level = currentLevel;
  // Add "now" point
  points.unshift({ time: now, level, label: 'now', delta: 0 });

  // Walk backwards through events
  for (let i = sorted.length - 1; i >= 0; i--) {
    const ev = sorted[i];
    const evTime = new Date(ev.createdAt).getTime();
    const nextTime = i < sorted.length - 1 ? new Date(sorted[i + 1].createdAt).getTime() : now;

    // Decay happened from ev.createdAt to nextTime
    const msElapsed = nextTime - evTime;
    const decayedAmount = decayPerMs * msElapsed;

    // Level before decay + after this event = level at nextTime point
    // level_at_next = (level_before_event + delta) - decay
    // level_before_event = level_at_next + decay - delta
    const levelBeforeDecay = level + decayedAmount;
    const levelBeforeEvent = levelBeforeDecay - ev.delta;

    level = Math.max(0, levelBeforeEvent);
    points.unshift({
      time: evTime,
      level: Math.max(0, levelBeforeDecay - ev.delta + ev.delta), // level right after grant
      label: ev.reason ?? ev.delta > 0 ? `+${ev.delta}` : `${ev.delta}`,
      delta: ev.delta,
    });
  }

  return points.map((p) => ({
    ...p,
    level: Math.round(p.level * 10) / 10,
    timeLabel: new Date(p.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(10,16,30,0.95)', border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 900, marginBottom: 4 }}>{d.level} dopamine</div>
      <div style={{ opacity: 0.7 }}>{d.timeLabel}</div>
      {d.delta !== 0 && (
        <div style={{ color: d.delta > 0 ? '#22c55e' : '#ef4444', marginTop: 4 }}>
          {d.delta > 0 ? '+' : ''}{d.delta} — {d.label}
        </div>
      )}
    </div>
  );
};

export default function DopamineChart({ events, maxLevel, decayPerHour, currentLevel }: Props) {
  const data = buildHistory(events, decayPerHour, currentLevel);
  if (data.length < 2) {
    return <div className="small" style={{ padding: 16, opacity: 0.5 }}>Not enough history to chart yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="dopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9900" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#ff9900" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="timeLabel" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.45)' }} />
        <YAxis domain={[0, maxLevel]} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.45)' }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={maxLevel * 0.7} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
        <Area
          type="monotone" dataKey="level"
          stroke="#ff9900" strokeWidth={2}
          fill="url(#dopGrad)" dot={{ fill: '#ff9900', r: 3 }}
          activeDot={{ r: 5, fill: '#ffb84d' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

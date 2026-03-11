/**
 * Derives a mood label from valence + arousal using Russell's Circumplex Model.
 *
 *               High Arousal
 *        excited  |  happy
 *   neg ──────────+────────── pos  (valence)
 *        anxious  |  content
 *               Low Arousal
 */
export function deriveMood(valence: number, arousal: number): string {
  // Most extreme states first
  if (valence < -0.6 && arousal > 0.7) return 'overwhelmed';
  if (valence > 0.7 && arousal > 0.7) return 'enthusiastic';
  if (valence > 0.5 && arousal < 0.2) return 'serene';
  if (valence < -0.3 && arousal < 0.25) return 'melancholic';
  if (valence > 0.4 && arousal > 0.4) return 'excited';
  if (valence > 0.2 && arousal > 0.5 && arousal <= 0.7) return 'playful';
  if (valence > 0.05 && valence <= 0.3 && arousal > 0.3 && arousal <= 0.6) return 'focused';
  if (valence > 0.4 && arousal <= 0.4) return 'content';
  if (valence > 0.1 && arousal > 0.6) return 'energized';
  if (valence > 0.1) return 'happy';
  if (valence < -0.4 && arousal > 0.4) return 'anxious';
  if (valence < -0.4 && arousal <= 0.4) return 'distressed';
  if (valence < -0.1 && arousal < 0.3) return 'bored';
  if (valence < -0.1) return 'unhappy';
  if (arousal < 0.2) return 'calm';
  return 'neutral';
}

/** Clamp a value to [min, max]. */
export function clamp(val: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Circadian energy curve — peaks mid-morning and mid-afternoon,
 * dips post-lunch and at night.  Hour is 0-23 local time.
 */
export function circadianEnergy(hour: number): number {
  // Rough double-peak curve: peaks ~10:00 and ~15:00
  const morning = Math.exp(-0.5 * ((hour - 10) / 2.5) ** 2);
  const afternoon = Math.exp(-0.5 * ((hour - 15) / 2.0) ** 2) * 0.85;
  const night = Math.exp(-0.5 * ((hour - 3) / 2.0) ** 2) * 0.25;
  return clamp(morning + afternoon - night, 0.1, 1.0);
}

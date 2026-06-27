/**
 * _lux.ts — shared LUXURY design system for text overlays.
 *
 * Design language (replaces the loud "broker_creator" black-stroke look):
 *   - Palette: champagne gold + warm off-white. NO bright primary red.
 *   - Type: Playfair Display serif for headlines/brand; Be Vietnam Pro light,
 *     wide-tracked uppercase for eyebrow labels.
 *   - Legibility: soft layered shadow (no chunky 8-dir black stroke).
 *   - Motion: gentle fade + upward drift, slow ease. NO scale-pop, NO rotation.
 *   - Optional thin gold hairline rule for the classic eyebrow→headline lockup.
 */
import type React from 'react';
import { interpolate, Easing } from 'remotion';

export const LUX = {
  gold: '#C9A86A',        // champagne gold — accents, brand, emphasis
  goldDeep: '#A67C3D',    // bronze — secondary accent / hairline
  cream: '#F4EFE6',       // warm off-white — primary headline text
  white: '#FFFFFF',
  ink: '#14110E',         // deep warm black — scrim base
} as const;

export const SERIF = "'Playfair Display', 'Be Vietnam Pro', Georgia, serif";
export const SANS = "'Be Vietnam Pro', system-ui, sans-serif";

/** Soft elegant shadow for legibility over video — replaces the chunky black stroke. */
export const softShadow =
  '0 2px 10px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.75), 0 0 1px rgba(0,0,0,0.9)';

/** Slightly stronger soft shadow for large hero text. */
export const heroShadow =
  '0 4px 18px rgba(0,0,0,0.55), 0 2px 5px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.85)';

/**
 * Soft dark scrim placed BEHIND a text block so it reads cleanly over any
 * background (busy murals, bright skies). A blurred radial ellipse that fades to
 * transparent — no hard box edges, stays elegant. Render as the FIRST child of
 * the text container (text paints on top via DOM order).
 */
export function scrimStyle(): React.CSSProperties {
  return {
    position: 'absolute',
    inset: '-40px -86px',
    borderRadius: 999,
    background:
      'radial-gradient(ellipse at center, rgba(6,5,3,0.8) 0%, rgba(6,5,3,0.68) 36%, rgba(6,5,3,0.38) 60%, rgba(6,5,3,0.12) 76%, rgba(6,5,3,0) 88%)',
    filter: 'blur(18px)',
    pointerEvents: 'none',
  };
}

/**
 * Gentle entrance/exit: fade + upward drift. No bounce, no overshoot, no rotate.
 * Returns { opacity, translateY } — apply translateY in px.
 */
export function luxEnter(
  frame: number,
  fps: number,
  durationSec: number,
  opts: { riseFrom?: number; enterDur?: number; exitDur?: number } = {},
): { opacity: number; translateY: number } {
  const riseFrom = opts.riseFrom ?? 28;
  const enter = Math.round((opts.enterDur ?? 0.55) * fps);
  const exit = Math.round((opts.exitDur ?? 0.4) * fps);
  const total = Math.max(1, Math.round(durationSec * fps));

  const opacity = interpolate(
    frame,
    [0, enter, Math.max(enter + 1, total - exit), total],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );
  const translateY = interpolate(frame, [0, enter], [riseFrom, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return { opacity, translateY };
}

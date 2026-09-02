/**
 * PriceRed3D — white italic price text with thick RED 3D shadow stack.
 * Use for: prices, hero numbers needing maximum punch (e.g. "120Tr/m²", "5%/QUÝ").
 * Style: white fill + scaled red shadow stack (offset right+down) → 3D depth.
 *
 * Overflow guard:
 *   - Hard column 900px inside 1080 canvas, leaving room for -3° rotation
 *     bounding-box widening (~+5%) and the red shadow tail on the right.
 *   - minFontSize dropped to 56 so long Vietnamese strings (e.g. "5 NĂM MIỄN GỐC",
 *     "120 ĐẾN 130 TR/M²") auto-shrink instead of bleeding off canvas.
 *   - fit-text receives the real `letterSpacing` so measurement matches render.
 *   - Shadow depth scales with font size — at 240px it's 14 layers; at 80px it's
 *     6 layers, so the 3D effect stays proportional rather than chunky on small
 *     fitted text.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureTextWidth, useFitTextSize } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type PriceRed3DProps = {
  text: string;
  placement?: Placement;
  durationSec: number;
};

const FONT_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
const MAX_WIDTH = 820;
const MAX_FS = 240;
const MIN_FS = 56;
const FONT_WEIGHT = 900;
const LETTER_SPACING = 1;
const WRAP_THRESHOLD = MAX_WIDTH * 0.95;

const buildRed3DShadow = (depth: number, color = '#e63946'): string =>
  Array.from({ length: depth }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(', ');

function splitBalanced(text: string): string[] {
  const widthAtMin = measureTextWidth(text, MIN_FS, FONT_FAMILY, FONT_WEIGHT, LETTER_SPACING);
  if (widthAtMin <= WRAP_THRESHOLD) return [text];

  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text];

  let bestIdx = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ');
    const right = words.slice(i).join(' ');
    const lw = measureTextWidth(left, MIN_FS, FONT_FAMILY, FONT_WEIGHT, LETTER_SPACING);
    const rw = measureTextWidth(right, MIN_FS, FONT_FAMILY, FONT_WEIGHT, LETTER_SPACING);
    const diff = Math.abs(lw - rw);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(' '), words.slice(bestIdx).join(' ')];
}

export const PriceRed3D: React.FC<PriceRed3DProps> = ({ text, placement = 'top', durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec, { overshoot: 1.12, entryDur: 0.32 });

  const lines = useMemo(() => splitBalanced(text), [text]);
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));

  const fs = useFitTextSize({
    text: longest,
    maxWidth: MAX_WIDTH,
    maxFontSize: MAX_FS,
    minFontSize: MIN_FS,
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT,
    letterSpacing: LETTER_SPACING,
  });

  const shadowDepth = Math.max(6, Math.round(fs * 0.06));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate - 3}deg)`,
          opacity: env.opacity,
          willChange: 'transform, opacity',
          whiteSpace: 'pre-line',
          maxWidth: MAX_WIDTH,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: FONT_WEIGHT,
            fontStyle: 'italic',
            fontSize: fs,
            color: '#ffffff',
            textShadow: buildRed3DShadow(shadowDepth, '#e63946'),
            letterSpacing: LETTER_SPACING,
            lineHeight: 1.05,
            textTransform: 'uppercase',
          }}
        >
          {lines.join('\n')}
        </div>
      </div>
    </AbsoluteFill>
  );
};

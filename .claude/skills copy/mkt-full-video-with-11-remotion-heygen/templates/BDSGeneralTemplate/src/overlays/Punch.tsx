/**
 * Punch — single-line uppercase punch text.
 * Replaces PunchWhite + PunchRed + PunchYellow + PunchSubtle.
 * `color` defaults to white. `italic` defaults true (broker-creator aesthetic).
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureTextWidth, useFitTextSize, textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type PunchProps = {
  text: string;
  color?: string;
  italic?: boolean;
  placement?: Placement;
  durationSec: number;
};

const FONT_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
const MAX_WIDTH = 880;
const MAX_FS = 200;
const MIN_FS = 96;
const FONT_WEIGHT = 900;
const LETTER_SPACING = 0.5;
const WRAP_THRESHOLD = MAX_WIDTH * 0.95;

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

export const Punch: React.FC<PunchProps> = ({
  text,
  color = '#ffffff',
  italic = true,
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec);

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

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate}deg)`,
          opacity: env.opacity,
          fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
          fontWeight: FONT_WEIGHT,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: fs,
          lineHeight: 1.05,
          textAlign: 'center',
          textTransform: 'uppercase',
          color,
          textShadow: textShadowStroke(6, '#000000'),
          whiteSpace: 'pre-line',
          maxWidth: MAX_WIDTH,
          willChange: 'transform, opacity',
          letterSpacing: LETTER_SPACING,
        }}
      >
        {lines.join('\n')}
      </div>
    </AbsoluteFill>
  );
};

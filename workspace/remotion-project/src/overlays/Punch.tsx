/**
 * Punch — single elegant serif statement line (luxury restyle).
 * Warm off-white or champagne gold, soft shadow (no black stroke), gentle
 * fade + upward drift. Long text balance-splits to ≤2 lines; floor pass on the
 * widest word guarantees no overflow.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureTextWidth, useFitTextSize } from '../utils/fit-text';
import { luxEnter, LUX, SERIF, heroShadow, scrimStyle } from './_lux';
import { placementStyle, type Placement } from './_placement';

export type PunchProps = {
  text: string;
  color?: string;
  italic?: boolean;
  placement?: Placement;
  durationSec: number;
};

const MAX_WIDTH = 900;
const MAX_FS = 170;
const MIN_FS = 64;
const FONT_WEIGHT = 700;
const LETTER_SPACING = 0.5;

function luxColor(c: string | undefined): string {
  if (!c) return LUX.cream;
  const v = c.toLowerCase();
  if (v === '#f4b324' || v === '#ffd60a') return LUX.gold;
  // bright red / green / blue / white all resolve to the restrained palette
  if (v === '#ffffff' || v === '#fff') return LUX.cream;
  return LUX.cream;
}

const widestWord = (s: string): string =>
  s.split(/\s+/).filter(Boolean).reduce((acc, w) => (w.length > acc.length ? w : acc), '');

function splitBalanced(text: string): string[] {
  const widthAtMin = measureTextWidth(text, MIN_FS, SERIF, FONT_WEIGHT, LETTER_SPACING);
  if (widthAtMin <= MAX_WIDTH) return [text];
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text];
  let bestIdx = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ');
    const right = words.slice(i).join(' ');
    const lw = measureTextWidth(left, MIN_FS, SERIF, FONT_WEIGHT, LETTER_SPACING);
    const rw = measureTextWidth(right, MIN_FS, SERIF, FONT_WEIGHT, LETTER_SPACING);
    const diff = Math.abs(lw - rw);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(' '), words.slice(bestIdx).join(' ')];
}

export const Punch: React.FC<PunchProps> = ({ text, color, placement = 'top', durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, translateY } = luxEnter(frame, fps, durationSec);
  const fill = luxColor(color);

  const lines = useMemo(() => splitBalanced(text), [text]);
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), '');
  const fsTarget = useFitTextSize({
    text: longest,
    maxWidth: MAX_WIDTH,
    maxFontSize: MAX_FS,
    minFontSize: MIN_FS,
    fontFamily: SERIF,
    fontWeight: FONT_WEIGHT,
    letterSpacing: LETTER_SPACING,
  });
  const fs = useFitTextSize({
    text: widestWord(longest) || longest,
    maxWidth: MAX_WIDTH,
    maxFontSize: fsTarget,
    minFontSize: 48,
    fontFamily: SERIF,
    fontWeight: FONT_WEIGHT,
    letterSpacing: LETTER_SPACING,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) translateY(${translateY}px)`,
          opacity,
          width: 'fit-content',
          maxWidth: MAX_WIDTH,
          fontFamily: SERIF,
          fontWeight: FONT_WEIGHT,
          fontStyle: 'normal',
          fontSize: fs,
          lineHeight: 1.05,
          textAlign: 'center',
          textTransform: 'uppercase',
          color: fill,
          textShadow: heroShadow,
          letterSpacing: LETTER_SPACING,
          willChange: 'transform, opacity',
        }}
      >
        <div style={scrimStyle()} />
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap', position: 'relative' }}>
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

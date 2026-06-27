/**
 * PriceRed3D — LUXURY restyle (name kept for JSON variant compatibility).
 * Renders hero numbers / figures as large champagne-gold serif text with a soft
 * shadow — NO red 3D stack, no black stroke, no italic, no rotation. Gentle
 * fade + upward drift. Balance-split + floor pass guarantee no overflow.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureTextWidth, useFitTextSize } from '../utils/fit-text';
import { luxEnter, LUX, SERIF, heroShadow, scrimStyle } from './_lux';
import { placementStyle, type Placement } from './_placement';

export type PriceRed3DProps = {
  text: string;
  placement?: Placement;
  durationSec: number;
};

const MAX_WIDTH = 900;
const MAX_FS = 200;
const MIN_FS = 64;
const FONT_WEIGHT = 800;
const LETTER_SPACING = 1;

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

export const PriceRed3D: React.FC<PriceRed3DProps> = ({ text, placement = 'top', durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, translateY } = luxEnter(frame, fps, durationSec);

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
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={scrimStyle()} />
        <div
          style={{
            position: 'relative',
            fontFamily: SERIF,
            fontWeight: FONT_WEIGHT,
            fontStyle: 'normal',
            fontSize: fs,
            color: LUX.gold,
            textShadow: heroShadow,
            letterSpacing: LETTER_SPACING,
            lineHeight: 1.04,
            textTransform: 'uppercase',
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

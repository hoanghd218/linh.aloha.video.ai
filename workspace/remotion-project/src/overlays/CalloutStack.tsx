/**
 * CalloutStack — LUXURY eyebrow → hairline → headline lockup.
 *
 * Classic premium real-estate caption: a small wide-tracked uppercase label
 * (gold) sits above a thin gold hairline, with an elegant serif headline below
 * (warm off-white). No black stroke, no bright red, no rotation, no scale-pop —
 * gentle fade + upward drift only.
 *
 * Overflow guard (text must NEVER bleed off the 1080 canvas):
 *   - SAFE_W = 900px usable column.
 *   - Long headline balance-splits into ≤2 lines, then a floor pass on the
 *     widest single word guarantees no token bleeds past the column.
 *   - Eyebrow fits single-line down to 34px.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureTextWidth, useFitTextSize } from '../utils/fit-text';
import { luxEnter, LUX, SERIF, SANS, softShadow, heroShadow, scrimStyle } from './_lux';
import { placementStyle, type Placement } from './_placement';

export type CalloutStackProps = {
  setup_text: string;
  emphasis_text: string;
  emphasis_color?: string;
  setup_color?: string;
  placement?: Placement;
  durationSec: number;
};

const SAFE_W = 900;
const HEAD_WEIGHT = 700;
const HEAD_LS = 0.5;

const widestWord = (s: string): string =>
  s.split(/\s+/).filter(Boolean).reduce((acc, w) => (w.length > acc.length ? w : acc), '');

/** Map loud broker palette → restrained lux palette so no bright red leaks through. */
function luxColor(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  const v = c.toLowerCase();
  if (v === '#e63946' || v === '#ff4757' || v === '#ffd60a' || v === '#2bb24c' || v === '#1f7ae0')
    return fallback;
  if (v === '#f4b324' || v === '#ffffff' || v === '#fff') return v === '#ffffff' || v === '#fff' ? LUX.cream : LUX.gold;
  return fallback;
}

function splitBalanced(text: string, minFs: number): string[] {
  const widthAtMin = measureTextWidth(text, minFs, SERIF, HEAD_WEIGHT, HEAD_LS);
  if (widthAtMin <= SAFE_W) return [text];
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text];
  let bestIdx = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ');
    const right = words.slice(i).join(' ');
    const lw = measureTextWidth(left, minFs, SERIF, HEAD_WEIGHT, HEAD_LS);
    const rw = measureTextWidth(right, minFs, SERIF, HEAD_WEIGHT, HEAD_LS);
    const diff = Math.abs(lw - rw);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(' '), words.slice(bestIdx).join(' ')];
}

export const CalloutStack: React.FC<CalloutStackProps> = ({
  setup_text,
  emphasis_text,
  emphasis_color,
  setup_color,
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, translateY } = luxEnter(frame, fps, durationSec);

  const headColor = luxColor(emphasis_color, LUX.cream);
  const eyebrowColor = luxColor(setup_color, LUX.gold) === LUX.cream ? LUX.gold : luxColor(setup_color, LUX.gold);

  const eyebrowFs = useFitTextSize({
    text: setup_text,
    maxWidth: SAFE_W,
    maxFontSize: 52,
    minFontSize: 34,
    fontWeight: 500,
    fontFamily: SANS,
    letterSpacing: 8,
  });

  const lines = useMemo(() => splitBalanced(emphasis_text, 72), [emphasis_text]);
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), '');
  const headTarget = useFitTextSize({
    text: longest,
    maxWidth: SAFE_W,
    maxFontSize: 168,
    minFontSize: 60,
    fontWeight: HEAD_WEIGHT,
    fontFamily: SERIF,
    letterSpacing: HEAD_LS,
  });
  const headFs = useFitTextSize({
    text: widestWord(longest) || longest,
    maxWidth: SAFE_W,
    maxFontSize: headTarget,
    minFontSize: 48,
    fontWeight: HEAD_WEIGHT,
    fontFamily: SERIF,
    letterSpacing: HEAD_LS,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) translateY(${translateY}px)`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          width: 'fit-content',
          maxWidth: SAFE_W,
          willChange: 'transform, opacity',
        }}
      >
        <div style={scrimStyle()} />
        <div
          style={{
            position: 'relative',
            fontFamily: SANS,
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: eyebrowFs,
            color: eyebrowColor,
            textShadow: softShadow,
            letterSpacing: 8,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {setup_text}
        </div>
        <div
          style={{
            position: 'relative',
            width: 110,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${LUX.gold} 20%, ${LUX.gold} 80%, transparent)`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        />
        <div
          style={{
            position: 'relative',
            fontFamily: SERIF,
            fontWeight: HEAD_WEIGHT,
            fontStyle: 'normal',
            fontSize: headFs,
            color: headColor,
            textShadow: heroShadow,
            letterSpacing: HEAD_LS,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            textAlign: 'center',
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

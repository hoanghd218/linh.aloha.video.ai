/**
 * Punch2Line — hierarchical 2-block headline + subtitle, broker-creator aesthetic.
 *
 * Input: "headline\nsubtitle" (use `\n` to split). The first block renders as a
 * big bold italic punch (weight 900) — wraps naturally to ≤2 visual lines if
 * long. Any remaining lines collapse into a smaller subtitle block below
 * (weight 700). Case is preserved from input — no forced uppercase, so
 * "Vay ngân hàng không mất lãi 2 năm" stays sentence case like the reference.
 *
 * Overflow guard:
 *   - Container locked to MAX_WIDTH (920px) inside the 1080px canvas — leaves
 *     ≥80px breathing room on each edge.
 *   - Headline fit-target = MAX_WIDTH × 1.9 → lets the headline fill up to two
 *     visual lines at the largest acceptable font before shrinking further.
 *   - Floor pass on the widest single word ensures no token bleeds past the
 *     column even after wrap (handles Vietnamese long words like "Nguyễn").
 *   - Subtitle is fit single-line at MAX_WIDTH.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize, textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type Punch2LineProps = {
  text: string;
  color?: string;
  /** color of the 2nd (subtitle) line — defaults to `color` so single-color lockups still work */
  subtitle_color?: string;
  /** 'script' renders the headline in a gold-friendly calligraphy face (Dancing Script), non-italic */
  headline_font?: 'display' | 'script';
  placement?: Placement;
  durationSec: number;
};

const MAX_WIDTH = 920;
const DISPLAY_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
const SCRIPT_FAMILY = "'Dancing Script', 'Mulish', cursive";

const widestWord = (s: string): string =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .reduce((acc, w) => (w.length > acc.length ? w : acc), '');

export const Punch2Line: React.FC<Punch2LineProps> = ({
  text,
  color = '#ffffff',
  subtitle_color,
  headline_font = 'display',
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec);

  const parts = text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const headline = parts[0] ?? '';
  const subtitle = parts.slice(1).join(' ');

  const isScript = headline_font === 'script';
  const MULISH = DISPLAY_FAMILY;
  const headlineFamily = isScript ? SCRIPT_FAMILY : DISPLAY_FAMILY;
  // Dancing Script is much wider per glyph than Mulish — give the fitter the real family + extra max
  const headlineMax = isScript ? 170 : 130;
  const fs1Target = useFitTextSize({
    text: headline,
    maxWidth: MAX_WIDTH * 1.9,
    maxFontSize: headlineMax,
    minFontSize: 60,
    fontWeight: isScript ? 700 : 900,
    fontFamily: headlineFamily,
    letterSpacing: isScript ? 0 : 1,
  });
  const fs1 = useFitTextSize({
    text: widestWord(headline) || headline,
    maxWidth: MAX_WIDTH,
    maxFontSize: fs1Target,
    minFontSize: 44,
    fontWeight: isScript ? 700 : 900,
    fontFamily: headlineFamily,
    letterSpacing: isScript ? 0 : 1,
  });

  const fs2 = useFitTextSize({
    text: subtitle || ' ',
    maxWidth: MAX_WIDTH,
    maxFontSize: 78,
    minFontSize: 36,
    fontWeight: 700,
    fontFamily: MULISH,
    letterSpacing: 0.5,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate}deg)`,
          opacity: env.opacity,
          width: MAX_WIDTH,
          fontFamily: DISPLAY_FAMILY,
          fontStyle: 'italic',
          textAlign: 'center',
          color,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: headlineFamily,
            fontWeight: isScript ? 700 : 900,
            fontStyle: isScript ? 'normal' : 'italic',
            fontSize: fs1,
            lineHeight: isScript ? 1.0 : 1.02,
            textShadow: textShadowStroke(6, '#000000'),
            overflowWrap: 'break-word',
            wordBreak: 'normal',
          }}
        >
          {headline}
        </div>
        {subtitle ? (
          <div
            style={{
              fontWeight: 700,
              fontSize: fs2,
              lineHeight: 1.1,
              marginTop: Math.round(fs2 * 0.18),
              color: subtitle_color ?? color,
              textShadow: textShadowStroke(4, '#000000'),
              overflowWrap: 'break-word',
              wordBreak: 'normal',
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

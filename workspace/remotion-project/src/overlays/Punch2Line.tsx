/**
 * Punch2Line — LUXURY 2-line headline lockup.
 * Line 1 = elegant serif headline (cream, or champagne gold for brand/project
 * moments via headline_font:"script"). Line 2 = smaller serif sub line in a
 * mapped accent color. Soft shadow (no black stroke), gentle fade + drift, no
 * rotation, no italic.
 *
 * Overflow guard: headline floor-pass on widest word + hard column; subtitle
 * fits single-line. Nothing bleeds past the 900px safe column.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize } from '../utils/fit-text';
import { luxEnter, LUX, SERIF, heroShadow, softShadow, scrimStyle } from './_lux';
import { placementStyle, type Placement } from './_placement';

export type Punch2LineProps = {
  text: string;
  color?: string;
  subtitle_color?: string;
  /** 'script' marks a brand/project-name moment → headline renders in champagne gold */
  headline_font?: 'display' | 'script';
  placement?: Placement;
  durationSec: number;
};

const MAX_WIDTH = 900;

const widestWord = (s: string): string =>
  s.split(/\s+/).filter(Boolean).reduce((acc, w) => (w.length > acc.length ? w : acc), '');

function luxColor(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  const v = c.toLowerCase();
  if (v === '#f4b324' || v === '#ffd60a' || v === '#c9a86a') return LUX.gold;
  if (v === '#ffffff' || v === '#fff') return LUX.cream;
  return fallback;
}

export const Punch2Line: React.FC<Punch2LineProps> = ({
  text,
  color,
  subtitle_color,
  headline_font = 'display',
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, translateY } = luxEnter(frame, fps, durationSec);

  const parts = text.split('\n').map((s) => s.trim()).filter(Boolean);
  const headline = parts[0] ?? '';
  const subtitle = parts.slice(1).join(' ');

  const isBrand = headline_font === 'script';
  const headColor = isBrand ? LUX.gold : luxColor(color, LUX.cream);
  const subColor = luxColor(subtitle_color, LUX.gold);

  const fs1Target = useFitTextSize({
    text: headline,
    maxWidth: MAX_WIDTH,
    maxFontSize: 178,
    minFontSize: 60,
    fontWeight: isBrand ? 800 : 700,
    fontFamily: SERIF,
    letterSpacing: 0.5,
  });
  const fs1 = useFitTextSize({
    text: widestWord(headline) || headline,
    maxWidth: MAX_WIDTH,
    maxFontSize: fs1Target,
    minFontSize: 48,
    fontWeight: isBrand ? 800 : 700,
    fontFamily: SERIF,
    letterSpacing: 0.5,
  });
  const fs2 = useFitTextSize({
    text: subtitle || ' ',
    maxWidth: MAX_WIDTH,
    maxFontSize: 76,
    minFontSize: 34,
    fontWeight: 600,
    fontFamily: SERIF,
    letterSpacing: 1,
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
          fontStyle: 'normal',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={scrimStyle()} />
        <div
          style={{
            position: 'relative',
            fontFamily: SERIF,
            fontWeight: isBrand ? 800 : 700,
            fontStyle: 'normal',
            fontSize: fs1,
            lineHeight: 1.02,
            color: headColor,
            textShadow: heroShadow,
            letterSpacing: 0.5,
            textTransform: isBrand ? 'none' : 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {headline}
        </div>
        {subtitle ? (
          <div
            style={{
              position: 'relative',
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: fs2,
              lineHeight: 1.12,
              marginTop: Math.round(fs2 * 0.22),
              color: subColor,
              textShadow: softShadow,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

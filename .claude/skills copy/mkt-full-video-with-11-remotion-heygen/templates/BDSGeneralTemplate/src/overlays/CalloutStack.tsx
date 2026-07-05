/**
 * CalloutStack — small setup line on top + big italic emphasis line below.
 * Use for: "Mức giá ra mắt" → "THẤP HƠN" / "Bàn giao" → "Q2/2029" type beats.
 * Top: white + black stroke ~80px. Bottom: italic cream/yellow + thick black stroke ~180px.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize, textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type CalloutStackProps = {
  setup_text: string;
  emphasis_text: string;
  emphasis_color?: string;
  /** color of the small setup line on top — defaults to white */
  setup_color?: string;
  placement?: Placement;
  durationSec: number;
};

export const CalloutStack: React.FC<CalloutStackProps> = ({
  setup_text,
  emphasis_text,
  emphasis_color = '#ffd60a',
  setup_color = '#ffffff',
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec, { overshoot: 1.10, entryDur: 0.36 });

  const MULISH = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
  const setupFs = useFitTextSize({
    text: setup_text,
    maxWidth: 940,
    maxFontSize: 96,
    minFontSize: 56,
    fontWeight: 700,
    fontFamily: MULISH,
    letterSpacing: 0.5,
  });
  const emphasisFs = useFitTextSize({
    text: emphasis_text,
    maxWidth: 940,
    maxFontSize: 220,
    minFontSize: 80,
    fontWeight: 900,
    fontFamily: MULISH,
    letterSpacing: 1,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate - 3}deg)`,
          opacity: env.opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          willChange: 'transform, opacity',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: setupFs,
            color: setup_color,
            textShadow: textShadowStroke(4, '#000000'),
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          {setup_text}
        </div>
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: emphasisFs,
            color: emphasis_color,
            textShadow: textShadowStroke(8, '#000000'),
            letterSpacing: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {emphasis_text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

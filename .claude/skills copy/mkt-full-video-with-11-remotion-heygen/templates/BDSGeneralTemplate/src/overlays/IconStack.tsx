/**
 * IconStack — optional icon image + 2-line stacked text (screenshot 4 pattern).
 * Use for: "Làm marketing / Truyền thông" with a megaphone icon above.
 * Icon at top center, text lines below in uppercase + thick black stroke.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize, textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type IconStackProps = {
  line1: string;
  line2: string;
  icon_path?: string;
  color?: string;
  placement?: Placement;
  durationSec: number;
};

export const IconStack: React.FC<IconStackProps> = ({
  line1,
  line2,
  icon_path,
  color = '#ffffff',
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec, { entryDur: 0.38, overshoot: 1.10 });

  const widest = line1.length > line2.length ? line1 : line2;
  const fs = useFitTextSize({
    text: widest,
    maxWidth: 920,
    maxFontSize: 140,
    minFontSize: 56,
    fontWeight: 900,
    fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
    letterSpacing: 1,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate}deg)`,
          opacity: env.opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          willChange: 'transform, opacity',
        }}
      >
        {icon_path ? (
          <Img
            src={staticFile(icon_path)}
            style={{
              width: 180,
              height: 180,
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.55))',
            }}
          />
        ) : null}
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: fs * 0.78,
            color,
            textShadow: textShadowStroke(5, '#000000'),
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: fs,
            color,
            textShadow: textShadowStroke(7, '#000000'),
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * PriceWithBrand — PriceRed3D top + white+black-stroke brand label below.
 * Use for: hero price + project context (e.g. "120Tr/m²" + "Vinhomes Cao Xà Lá").
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize, textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';
import { placementStyle, type Placement } from './_placement';

export type PriceWithBrandProps = {
  price_text: string;
  brand_text: string;
  placement?: Placement;
  durationSec: number;
};

const buildRed3DShadow = (depth = 14, color = '#e63946'): string =>
  Array.from({ length: depth }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(', ');

export const PriceWithBrand: React.FC<PriceWithBrandProps> = ({
  price_text,
  brand_text,
  placement = 'top',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec, { overshoot: 1.10, entryDur: 0.34 });

  const MULISH = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
  const priceFs = useFitTextSize({
    text: price_text,
    maxWidth: 940,
    maxFontSize: 220,
    minFontSize: 84,
    fontWeight: 900,
    fontFamily: MULISH,
    letterSpacing: 1,
  });
  const brandFs = useFitTextSize({
    text: brand_text,
    maxWidth: 960,
    maxFontSize: 96,
    minFontSize: 48,
    fontWeight: 800,
    fontFamily: MULISH,
    letterSpacing: 0.5,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          ...placementStyle(placement),
          transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate - 2}deg)`,
          opacity: env.opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          willChange: 'transform, opacity',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: priceFs,
            color: '#ffffff',
            textShadow: buildRed3DShadow(13, '#e63946'),
            letterSpacing: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {price_text}
        </div>
        <div
          style={{
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: brandFs,
            color: '#ffffff',
            textShadow: textShadowStroke(5, '#000000'),
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          {brand_text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

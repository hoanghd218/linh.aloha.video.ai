/**
 * ScenePricePackage — full-screen takeover showing a tiered price list / package table.
 *
 * Layout (1080×1920):
 *   - Top band ~260px: title (yellow stroke-black) + subtitle
 *   - Tier cards stack vertically (2..4 cards) — each card has tier name (left)
 *     + price (right, red 3D), staggered fade-in
 *   - Footer note (e.g. "Đã VAT, đã nội thất") small grey
 *
 * Use case:
 *   - "BẢNG GIÁ" — 1PN / 2PN / 3PN / 4PN tiers
 *   - "GÓI THANH TOÁN" — chuẩn / linh hoạt / cao cấp
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const FONT_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
const ACCENT_YELLOW = '#ffd60a';
const ACCENT_RED = '#e63946';
const DEFAULT_BG = 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)';

export type PriceTier = {
  /** Tier name. e.g. '1PN', 'STUDIO', 'GÓI CHUẨN' */
  tier: string;
  /** Optional small kicker above the tier. e.g. '31.9M²' */
  meta?: string;
  /** Price string. e.g. '4.5 TỶ', '6.8 - 7.5 TỶ' */
  price: string;
  /** Highlight this tier — bigger card + yellow border. */
  highlight?: boolean;
};

export type ScenePricePackageProps = {
  title: string;
  subtitle?: string;
  tiers: PriceTier[];
  /** Footer disclaimer / note. e.g. "Đã VAT - đã đầy đủ nội thất" */
  footer?: string;
  title_color?: string;
  bg_color?: string;
  durationSec: number;
};

export const ScenePricePackage: React.FC<ScenePricePackageProps> = ({
  title,
  subtitle,
  tiers,
  footer,
  title_color = ACCENT_YELLOW,
  bg_color = DEFAULT_BG,
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.max(1, Math.round(durationSec * fps));

  const env = scalePopEnvelope(frame, fps, durationSec, { entryDur: 0.4, overshoot: 1.05 });

  const bgOpacity = interpolate(frame, [0, Math.min(0.25 * fps, total * 0.15)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  const safeTiers = (tiers ?? []).slice(0, 4);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: bg_color, opacity: bgOpacity }} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 40% at 50% 0%, rgba(255,214,10,0.10) 0%, rgba(255,255,255,0) 70%)',
          opacity: bgOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: env.opacity,
          display: 'flex',
          flexDirection: 'column',
          willChange: 'opacity, transform',
        }}
      >
        {/* Title */}
        <div
          style={{
            paddingTop: 160,
            paddingBottom: 24,
            textAlign: 'center',
            transform: `scale(${env.scale}) rotate(${env.rotate}deg)`,
            transformOrigin: 'center top',
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 128,
              color: title_color,
              textTransform: 'uppercase',
              letterSpacing: 1,
              lineHeight: 1,
              textShadow: textShadowStroke(6, '#000000'),
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 14,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 56,
                color: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Tier cards */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: '20px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
          }}
        >
          {safeTiers.map((t, i) => {
            const startFrame = Math.round((0.5 + i * 0.22) * fps);
            const visible = frame >= startFrame;
            const pop = scalePopEnvelope(
              frame - startFrame,
              fps,
              Math.max(1, durationSec - startFrame / fps),
              { entryDur: 0.3, overshoot: 1.06 },
            );

            const cardHeight = t.highlight ? 220 : 170;
            const tierFs = t.highlight ? 96 : 80;
            const priceFs = t.highlight ? 130 : 108;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 30,
                  padding: '20px 32px',
                  minHeight: cardHeight,
                  background: t.highlight
                    ? 'linear-gradient(135deg, #fff8d6 0%, #ffffff 60%)'
                    : '#ffffff',
                  border: t.highlight
                    ? `6px solid ${ACCENT_YELLOW}`
                    : '2px solid rgba(0,0,0,0.08)',
                  borderRadius: 26,
                  boxShadow: t.highlight
                    ? '0 18px 36px rgba(255,214,10,0.35), 0 8px 16px rgba(0,0,0,0.12)'
                    : '0 10px 24px rgba(0,0,0,0.12)',
                  opacity: visible ? pop.opacity : 0,
                  transform: `scale(${visible ? pop.scale : 0.9})`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Left: meta + tier name */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    minWidth: 0,
                    flex: '0 1 auto',
                  }}
                >
                  {t.meta ? (
                    <span
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: 700,
                        fontSize: 38,
                        color: '#7a7a7a',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {t.meta}
                    </span>
                  ) : null}
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontSize: tierFs,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      lineHeight: 1,
                    }}
                  >
                    {t.tier}
                  </span>
                </div>

                {/* Right: price */}
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: priceFs,
                    color: ACCENT_RED,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    textShadow:
                      '3px 3px 0 #000, 4px 4px 0 #000, 5px 5px 0 rgba(0,0,0,0.4)',
                  }}
                >
                  {t.price}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        {footer ? (
          <div
            style={{
              padding: '12px 60px 60px',
              textAlign: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 38,
              color: '#4a4a4a',
              opacity: interpolate(frame, [Math.round(1.0 * fps), Math.round(1.4 * fps)], [0, 1], CLAMP),
            }}
          >
            * {footer}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

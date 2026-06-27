/**
 * SceneSpecRow — full-screen takeover listing 3..6 technical specs of an apartment.
 *
 * Layout (1080×1920):
 *   - Top band ~280px: title (yellow stroke-black)
 *   - Rows: each row = emoji/icon + label : value, stagger fade-in left-to-right
 *
 * Typical use:
 *   - Đặc điểm căn hộ — diện tích / hướng / tầng / view / phòng / nội thất
 *   - Thông số kỹ thuật toà nhà — chiều cao / hầm xe / tiện ích / cư dân
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
const DEFAULT_BG = 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)';

export type SpecRow = {
  /** Emoji or short glyph. e.g. '🏠', '🧭', '🌅' */
  icon?: string;
  /** Left-side label. e.g. 'Diện tích', 'Hướng', 'Tầng' */
  label: string;
  /** Right-side value. e.g. '31.9 M²', 'Đông Nam', '18' */
  value: string;
  /** Value color override. Default red accent for emphasis. */
  value_color?: string;
};

export type SceneSpecRowProps = {
  title: string;
  rows: SpecRow[];
  /** Optional kicker/subtitle under the title */
  subtitle?: string;
  title_color?: string;
  bg_color?: string;
  durationSec: number;
};

export const SceneSpecRow: React.FC<SceneSpecRowProps> = ({
  title,
  rows,
  subtitle,
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

  const safeRows = rows && rows.length > 0 ? rows.slice(0, 6) : [];
  const rowGap = safeRows.length <= 4 ? 36 : 22;
  const rowFs = safeRows.length <= 4 ? 76 : 64;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Background */}
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
          willChange: 'opacity, transform',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        <div
          style={{
            paddingTop: 180,
            paddingBottom: 28,
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

        {/* Rows */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: '40px 70px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: rowGap,
          }}
        >
          {safeRows.map((row, i) => {
            const startFrame = Math.round((0.45 + i * 0.18) * fps);
            const rowOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], CLAMP);
            const rowX = interpolate(
              frame,
              [startFrame, startFrame + 10],
              [-60, 0],
              { ...CLAMP, easing: Easing.out(Easing.cubic) },
            );
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  padding: '24px 36px',
                  background: '#ffffff',
                  borderRadius: 24,
                  borderLeft: `12px solid ${ACCENT_YELLOW}`,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  willChange: 'transform, opacity',
                }}
              >
                {row.icon ? (
                  <span
                    style={{
                      fontSize: rowFs * 0.9,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {row.icon}
                  </span>
                ) : null}
                <span
                  style={{
                    flex: 1,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: rowFs * 0.7,
                    color: '#2a2a2a',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    lineHeight: 1.1,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: rowFs,
                    color: row.value_color ?? '#e63946',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.value}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

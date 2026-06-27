/**
 * SceneFinishingDetail — full-screen interior close-up + 1..4 finishing callouts.
 *
 * Layout (1080×1920):
 *   - Full image fills the frame (objectFit: cover, ken-burns)
 *   - Dark gradient bottom overlay for legibility
 *   - Callouts stagger-pop in from bottom: pill-shaped tags with brand/material name
 *
 * Typical use:
 *   - Bếp: "Caesarstone", "Hafele Đức", "Bosch"
 *   - Phòng tắm: "Toto Nhật", "Marble Carrara"
 *   - Sàn: "Gỗ Sồi Mỹ", "Engineered"
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { textShadowStroke } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const FONT_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";

export type FinishingCallout = {
  /** Top label — small uppercase. e.g. 'Bếp đảo', 'Sàn phòng khách' */
  label: string;
  /** Bottom emphasis — brand/material. e.g. 'CAESARSTONE', 'GỖ SỒI MỸ' */
  brand: string;
  /** Optional emoji prefix on the brand line. e.g. '⭐' */
  icon?: string;
  /** Pill background color. Defaults to red broker accent. */
  color?: string;
};

export type SceneFinishingDetailProps = {
  /** Full-screen background image — interior close-up shot. */
  image_path: string;
  /** Section title shown at top — e.g. 'NỘI THẤT BẾP', 'PHÒNG TẮM'. */
  title?: string;
  /** 1..4 callouts revealed in sequence near bottom. */
  callouts: FinishingCallout[];
  durationSec: number;
};

const PILL_COLORS = ['#e63946', '#0a9396', '#ee9b00', '#9d4edd'];

// Convention: image paths in JSON should be explicit and relative to public/,
// using the per-video slug folder: `broll/<video-slug>/filename.jpg`.
// Bare filenames still resolve to `broll/filename.jpg` as a legacy fallback.
function resolveImage(path: string): string {
  if (path.startsWith('/') || path.startsWith('http')) return path;
  if (path.startsWith('broll/') || path.startsWith('logos/')) return path;
  return `broll/${path}`;
}

export const SceneFinishingDetail: React.FC<SceneFinishingDetailProps> = ({
  image_path,
  title,
  callouts,
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.max(1, Math.round(durationSec * fps));

  const fadeIn = Math.min(0.25 * fps, total * 0.15);
  const fadeOut = Math.min(0.35 * fps, total * 0.2);
  const opacity = interpolate(
    frame,
    [0, fadeIn, total - fadeOut, total],
    [0, 1, 1, 0],
    { ...CLAMP, easing: Easing.inOut(Easing.quad) },
  );
  const scale = interpolate(frame, [0, total], [1.0, 1.08], CLAMP);

  const env = scalePopEnvelope(frame, fps, durationSec, { entryDur: 0.4, overshoot: 1.06 });

  const safeCallouts = (callouts ?? []).slice(0, 4);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, backgroundColor: '#000' }}>
      {/* Background image */}
      <Img
        src={staticFile(resolveImage(image_path))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `scale(${scale})`,
          willChange: 'transform',
        }}
      />

      {/* Bottom dark gradient for callout legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      {/* Top dark gradient if title present */}
      {title ? (
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 30%)',
          }}
        />
      ) : null}

      {/* Title top */}
      {title ? (
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: '50%',
            transform: `translateX(-50%) scale(${env.scale}) rotate(${env.rotate}deg)`,
            transformOrigin: 'center top',
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 110,
            color: '#ffd60a',
            textTransform: 'uppercase',
            letterSpacing: 1,
            lineHeight: 1,
            textAlign: 'center',
            textShadow: textShadowStroke(6, '#000000'),
            opacity: env.opacity,
            maxWidth: 920,
          }}
        >
          {title}
        </div>
      ) : null}

      {/* Callouts pill stack near bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '0 60px',
        }}
      >
        {safeCallouts.map((c, i) => {
          const startFrame = Math.round((0.5 + i * 0.22) * fps);
          const pop = scalePopEnvelope(frame - startFrame, fps, Math.max(1, durationSec - startFrame / fps), {
            entryDur: 0.3,
            overshoot: 1.08,
          });
          const visible = frame >= startFrame;
          const pillColor = c.color ?? PILL_COLORS[i % PILL_COLORS.length];

          return (
            <div
              key={i}
              style={{
                display: visible ? 'flex' : 'none',
                alignItems: 'center',
                gap: 18,
                padding: '20px 40px',
                background: `linear-gradient(180deg, ${pillColor} 0%, rgba(0,0,0,0.25) 130%)`,
                border: '4px solid rgba(255,255,255,0.9)',
                borderRadius: 999,
                boxShadow: '0 14px 30px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.3)',
                transform: `scale(${pop.scale}) rotate(${pop.rotate}deg)`,
                opacity: pop.opacity,
                willChange: 'transform, opacity',
                maxWidth: '90%',
              }}
            >
              {c.icon ? (
                <span style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }}>{c.icon}</span>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: 1.0,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 36,
                    color: 'rgba(255,255,255,0.92)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2,
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: 72,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    textShadow: textShadowStroke(4, '#000000'),
                  }}
                >
                  {c.brand}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

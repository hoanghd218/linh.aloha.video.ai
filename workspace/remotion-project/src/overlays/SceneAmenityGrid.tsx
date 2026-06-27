/**
 * SceneAmenityGrid — full-screen takeover showing 4..6 amenities all at once in a grid.
 *
 * Layout (1080×1920):
 *   - Top band ~280px: title (yellow stroke-black) + subtitle
 *   - Grid 2×2 (4 cells) or 2×3 (6 cells) — each cell = photo + caption pill
 *   - Cells stagger pop-in (left→right, top→bottom)
 *
 * Use case:
 *   - "FULL TIỆN ÍCH 5★" — gym / yoga / pool / clubhouse / sky bar / kids zone
 *   - vs sibling `SceneApartmentPrice` which cycles 1 image at a time
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
const ACCENT_YELLOW = '#ffd60a';
const DEFAULT_BG = 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)';

export type AmenityCell = {
  image_path: string;
  /** Short caption shown as pill at bottom of cell. e.g. 'GYM', 'BỂ BƠI VÔ CỰC' */
  caption: string;
  /** Optional emoji prefix. e.g. '💪' */
  icon?: string;
};

export type SceneAmenityGridProps = {
  title: string;
  subtitle?: string;
  /** 3..6 amenities. 3-4 → 2×2 grid; 5-6 → 2×3 grid. */
  cells: AmenityCell[];
  title_color?: string;
  bg_color?: string;
  durationSec: number;
};

// Convention: image paths in JSON should be explicit and relative to public/,
// using the per-video slug folder: `broll/<video-slug>/filename.jpg`.
// Bare filenames still resolve to `broll/filename.jpg` as a legacy fallback.
function resolveImage(path: string): string {
  if (path.startsWith('/') || path.startsWith('http')) return path;
  if (path.startsWith('broll/') || path.startsWith('logos/')) return path;
  return `broll/${path}`;
}

export const SceneAmenityGrid: React.FC<SceneAmenityGridProps> = ({
  title,
  subtitle,
  cells,
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

  const safeCells = (cells ?? []).slice(0, 6);
  const cols = 2;
  const rows = safeCells.length <= 4 ? 2 : 3;

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
                marginTop: 12,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 52,
                color: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Grid */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: '20px 40px 60px',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 20,
          }}
        >
          {safeCells.map((cell, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const orderDelay = (row + col) * 0.15; // diagonal sweep
            const startFrame = Math.round((0.4 + orderDelay) * fps);
            const cellPop = scalePopEnvelope(
              frame - startFrame,
              fps,
              Math.max(1, durationSec - startFrame / fps),
              { entryDur: 0.3, overshoot: 1.06 },
            );
            const visible = frame >= startFrame;

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 22,
                  background: '#1a1a1a',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
                  opacity: visible ? cellPop.opacity : 0,
                  transform: `scale(${visible ? cellPop.scale : 0.7})`,
                  willChange: 'transform, opacity',
                  border: '4px solid #ffffff',
                }}
              >
                <Img
                  src={staticFile(resolveImage(cell.image_path))}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                {/* Caption gradient + pill */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '10px 18px',
                    background: 'rgba(230,57,70,0.92)',
                    border: '3px solid #ffffff',
                    borderRadius: 999,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
                  }}
                >
                  {cell.icon ? (
                    <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{cell.icon}</span>
                  ) : null}
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontSize: 38,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      lineHeight: 1.05,
                      textShadow: textShadowStroke(3, '#000000'),
                      textAlign: 'center',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {cell.caption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SceneApartmentPrice — full-screen takeover scene reviewing a layout / amenity.
 *
 * Layout (1080×1920):
 *   - Top band  (~360px): icon + title (yellow, black stroke) + optional subtitle/area
 *   - Image area (~1520px): one or more images shown below the title
 *
 * Image strategy:
 *   - 1 image  → full image area, fade-in + gentle ken-burns
 *   - 2 images → both stacked vertically (top + bottom), each gets half the area
 *   - 3+ images → cycle through one-by-one across the scene duration
 *
 * Use cases:
 *   - Review giá / mặt bằng căn hộ (CĂN STUDIO, 1 NGỦ, 2 NGỦ ...)
 *   - Review tiện ích toà chung cư / biệt thự (GYM, YOGA, BỂ BƠI, SÂN TENNIS)
 */
import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { textShadowStroke, useFitTextSize } from '../utils/fit-text';
import { scalePopEnvelope } from './_anim';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const FONT_FAMILY = "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif";
const TITLE_MAX_WIDTH = 980;
const TITLE_MAX_FS = 150;
const TITLE_MIN_FS = 56;
const SUB_MAX_FS = 96;
const SUB_MIN_FS = 56;
const ICON_GAP = 22;

export type SceneApartmentPriceProps = {
  /** Main title — short, uppercase. e.g. "CĂN STUDIO", "1 NGỦ", "GYM", "BỂ BƠI" */
  title: string;
  /** Optional second line — e.g. "(31.9M2)", "(83.2M2 - 95.8M2)", "FULL TIỆN ÍCH" */
  subtitle?: string;
  /** 1..N image paths. Relative `broll/foo.jpg` resolves under `public/broll/`. */
  images: string[];
  /** Emoji / glyph rendered before the title. Default 🏠. Pass empty string '' to hide. */
  icon?: string;
  /** Title fill color. Default yellow. */
  title_color?: string;
  /** Subtitle fill color. Default same yellow as title. */
  subtitle_color?: string;
  /** Background. Default soft cream → white gradient (matches reference style). */
  bg_color?: string;
  /** Image fit. 'contain' for floor plans (default), 'cover' for amenity photos. */
  image_fit?: 'contain' | 'cover';
  durationSec: number;
};

const DEFAULT_BG = 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)';
const ACCENT_YELLOW = '#ffd60a';

// Convention: image paths in JSON should be explicit and relative to public/,
// using the per-video slug folder: `broll/<video-slug>/filename.jpg`.
// Bare filenames still resolve to `broll/filename.jpg` as a legacy fallback
// (will 404 unless the file lives at broll/ root).
function resolveImage(path: string): string {
  if (path.startsWith('/') || path.startsWith('http')) return path;
  if (path.startsWith('broll/') || path.startsWith('logos/')) return path;
  return `broll/${path}`;
}

/**
 * One image rendered with fade + ken-burns. Used standalone (1 image) or
 * stacked (2 images) or as the active slide in a cycle (3+ images).
 */
const ImageSlot: React.FC<{
  path: string;
  fit: 'contain' | 'cover';
  /** local frame 0..total for this slot's visibility window */
  localFrame: number;
  totalFrames: number;
  fadeFrames?: number;
}> = ({ path, fit, localFrame, totalFrames, fadeFrames = 8 }) => {
  const opacity = interpolate(
    localFrame,
    [0, fadeFrames, totalFrames - fadeFrames, totalFrames],
    [0, 1, 1, 0],
    { ...CLAMP, easing: Easing.inOut(Easing.quad) },
  );
  const scale = interpolate(localFrame, [0, totalFrames], [1.0, 1.05], CLAMP);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 20,
        background: '#e9eaee',
        boxShadow: '0 14px 36px rgba(0,0,0,0.18)',
        opacity,
      }}
    >
      <Img
        src={staticFile(resolveImage(path))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: 'center',
          transform: `scale(${scale})`,
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
};

export const SceneApartmentPrice: React.FC<SceneApartmentPriceProps> = ({
  title,
  subtitle,
  images,
  icon = '🏠',
  title_color = ACCENT_YELLOW,
  subtitle_color,
  bg_color = DEFAULT_BG,
  image_fit = 'contain',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = Math.max(1, Math.round(durationSec * fps));
  const env = scalePopEnvelope(frame, fps, durationSec, { entryDur: 0.4, overshoot: 1.06 });

  // Background fade-in
  const bgOpacity = interpolate(frame, [0, Math.min(0.25 * fps, total * 0.15)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  // Auto-fit title font size based on text length.
  // Icon (when present) is rendered at titleFs * 0.95 with ICON_GAP padding —
  // reserve ~24% of the container width for it so the title doesn't overflow.
  const titleBudget = icon ? Math.round(TITLE_MAX_WIDTH * 0.76) : TITLE_MAX_WIDTH;
  const titleFs = useFitTextSize({
    text: title,
    maxWidth: titleBudget,
    maxFontSize: TITLE_MAX_FS,
    minFontSize: TITLE_MIN_FS,
    fontFamily: FONT_FAMILY,
    fontWeight: 900,
  });
  const subFs = useFitTextSize({
    text: subtitle || '',
    maxWidth: TITLE_MAX_WIDTH,
    maxFontSize: SUB_MAX_FS,
    minFontSize: SUB_MIN_FS,
    fontFamily: FONT_FAMILY,
    fontWeight: 900,
  });

  const safeImages = images && images.length > 0 ? images : [];
  const n = safeImages.length;

  // Image area layout
  const imageBlock = useMemo(() => {
    if (n === 0) return null;

    if (n === 1) {
      return (
        <div style={{ width: '100%', height: '100%', padding: '0 36px 40px' }}>
          <ImageSlot path={safeImages[0]} fit={image_fit} localFrame={frame} totalFrames={total} />
        </div>
      );
    }

    if (n === 2) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: '0 36px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {safeImages.map((p, i) => (
            <div key={i} style={{ flex: 1, minHeight: 0 }}>
              <ImageSlot
                path={p}
                fit={image_fit}
                localFrame={Math.max(0, frame - Math.round(i * 0.18 * fps))}
                totalFrames={total - Math.round(i * 0.18 * fps)}
              />
            </div>
          ))}
        </div>
      );
    }

    // 3+ images — cycle one at a time across duration
    const perSlot = Math.max(1, Math.floor(total / n));
    const idx = Math.min(n - 1, Math.floor(frame / perSlot));
    const slotLocalFrame = frame - idx * perSlot;
    return (
      <div style={{ width: '100%', height: '100%', padding: '0 36px 40px' }}>
        <ImageSlot
          key={idx}
          path={safeImages[idx]}
          fit={image_fit}
          localFrame={slotLocalFrame}
          totalFrames={perSlot}
        />
      </div>
    );
  }, [n, safeImages, frame, total, fps, image_fit]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Background */}
      <AbsoluteFill style={{ background: bg_color, opacity: bgOpacity }} />

      {/* Top decorative ribbon (very subtle, mimics reference) */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 40% at 50% 0%, rgba(255,214,10,0.10) 0%, rgba(255,255,255,0) 70%)',
          opacity: bgOpacity,
        }}
      />

      {/* Content frame */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          opacity: env.opacity,
          willChange: 'opacity, transform',
        }}
      >
        {/* Title block */}
        <div
          style={{
            paddingTop: 140,
            paddingBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            transform: `scale(${env.scale}) rotate(${env.rotate}deg)`,
            transformOrigin: 'center top',
          }}
        >
          {/* Icon + title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: ICON_GAP,
              maxWidth: TITLE_MAX_WIDTH,
              padding: '0 24px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {icon ? (
              <span
                style={{
                  fontSize: titleFs * 0.95,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.18))',
                }}
              >
                {icon}
              </span>
            ) : null}
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: titleFs,
                lineHeight: 1.0,
                color: title_color,
                textTransform: 'uppercase',
                letterSpacing: 1,
                textShadow: textShadowStroke(6, '#000000'),
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
          </div>

          {/* Subtitle */}
          {subtitle ? (
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: subFs,
                lineHeight: 1.0,
                color: subtitle_color ?? title_color,
                textTransform: 'uppercase',
                letterSpacing: 1,
                textShadow: textShadowStroke(5, '#000000'),
                maxWidth: TITLE_MAX_WIDTH,
                textAlign: 'center',
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Image area — takes remaining space */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>{imageBlock}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

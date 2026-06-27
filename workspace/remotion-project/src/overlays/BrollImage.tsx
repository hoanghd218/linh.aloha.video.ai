/**
 * BrollImage — full-screen b-roll takeover with subtle ken-burns zoom + fade in/out.
 * Use to insert project visuals (real-estate shots, product photos, charts) over the avatar.
 * z-index: matches other overlays (80). Image covers full 1080x1920 frame.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export type BrollImageProps = {
  imagePath: string;
  durationSec: number;
  caption?: string;
};

export const BrollImage: React.FC<BrollImageProps> = ({ imagePath, durationSec, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.max(1, Math.round(durationSec * fps));

  const fadeIn = Math.min(0.25 * fps, total * 0.2);
  const fadeOut = Math.min(0.35 * fps, total * 0.25);
  const opacity = interpolate(
    frame,
    [0, fadeIn, total - fadeOut, total],
    [0, 1, 1, 0],
    { ...CLAMP, easing: Easing.inOut(Easing.quad) }
  );

  // Ken-burns zoom 1.00 → 1.08
  const scale = interpolate(frame, [0, total], [1.0, 1.08], CLAMP);

  // Convention: imagePath should be explicit relative path under public/, e.g.
  // `broll/<video-slug>/filename.jpg`. Bare filenames legacy-fallback to `broll/<file>`.
  const src = imagePath.startsWith('broll/') || imagePath.startsWith('/')
    ? imagePath
    : `broll/${imagePath}`;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, backgroundColor: '#000' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `scale(${scale})`,
          willChange: 'transform, opacity',
        }}
      />
      {/* Cinematic scrim — darkens top + bottom so serif overlays read cleanly
          over bright skies/facades without needing a chunky black stroke. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,6,4,0.46) 0%, rgba(8,6,4,0.10) 26%, rgba(8,6,4,0.0) 50%, rgba(8,6,4,0.18) 78%, rgba(8,6,4,0.5) 100%)',
        }}
      />
      {caption ? (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            transformOrigin: 'center bottom',
            fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
            fontWeight: 900,
            fontStyle: 'normal',
            fontSize: 110,
            color: '#ffffff',
            letterSpacing: 1,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            textAlign: 'center',
            maxWidth: 980,
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
            hyphens: 'none',
            // White fill + thick black stroke + red 3D shadow stack (8 layers)
            textShadow: [
              // Black stroke
              '-3px -3px 0 #000', '3px -3px 0 #000', '-3px 3px 0 #000', '3px 3px 0 #000',
              '-3px 0 0 #000', '3px 0 0 #000', '0 -3px 0 #000', '0 3px 0 #000',
              // Red 3D shadow (down/right)
              '4px 4px 0 #e63946', '5px 5px 0 #e63946', '6px 6px 0 #e63946', '7px 7px 0 #e63946',
              '8px 8px 0 #e63946', '9px 9px 0 #e63946', '10px 10px 0 #e63946', '11px 11px 0 #e63946',
            ].join(', '),
          }}
        >
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

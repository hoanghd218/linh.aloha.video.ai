/**
 * ContactCard — full-screen end-of-video contact card.
 * Layout: avatar circle on top, QR code below, optional caption between.
 * Covers full 1080x1920 with branded background — replaces talking avatar at the end.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { scalePopEnvelope } from './_anim';
import { LUX, SERIF, SANS, heroShadow, softShadow } from './_lux';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export type ContactCardProps = {
  avatar_path: string;
  qr_path: string;
  name?: string;
  cta_text?: string;
  hotline?: string;
  /** Any CSS `background` value — solid colour or gradient. Defaults to luxury navy gradient. */
  bg_color?: string;
  /** Accent border colour around the card (gold by default). Set 'none' to disable. */
  accent?: string;
  durationSec: number;
};

const LUXURY_NAVY = 'linear-gradient(160deg, #1a2540 0%, #0a0e1f 60%, #050810 100%)';

export const ContactCard: React.FC<ContactCardProps> = ({
  avatar_path,
  qr_path,
  name,
  cta_text = 'QUÉT MÃ LIÊN HỆ',
  hotline,
  bg_color = LUXURY_NAVY,
  accent = '#c9a961',
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const env = scalePopEnvelope(frame, fps, durationSec, { entryDur: 0.45, overshoot: 1.05 });

  const total = Math.max(1, Math.round(durationSec * fps));
  const fadeIn = Math.min(0.3 * fps, total * 0.15);
  const bgOpacity = interpolate(frame, [0, fadeIn], [0, 1], { ...CLAMP, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Full-screen background — luxury gradient + soft radial vignette + optional gold accent border */}
      <AbsoluteFill style={{ background: bg_color, opacity: bgOpacity }} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(60% 50% at 50% 35%, rgba(201,169,97,0.18) 0%, rgba(0,0,0,0) 70%)',
          opacity: bgOpacity,
        }}
      />
      {accent !== 'none' ? (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: `4px solid ${accent}`,
            borderRadius: 32,
            opacity: bgOpacity * 0.85,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {/* Card content */}
      <AbsoluteFill
        style={{
          opacity: env.opacity,
          transform: `scale(${env.scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 120,
          gap: 28,
          willChange: 'transform, opacity',
        }}
      >
        {/* Avatar circle on top */}
        <div
          style={{
            width: 460,
            height: 460,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `10px solid ${accent}`,
            boxShadow: '0 24px 56px rgba(0,0,0,0.65)',
            background: '#000',
          }}
        >
          <Img
            src={staticFile(avatar_path)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 28%',
            }}
          />
        </div>

        {/* Name */}
        {name ? (
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 88,
              color: LUX.cream,
              textTransform: 'uppercase',
              textShadow: heroShadow,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            {name}
          </div>
        ) : null}

        {/* Hotline — elegant dark pill with gold border + gold serif numerals */}
        {hotline ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 22,
              padding: '20px 52px',
              background: 'linear-gradient(180deg, rgba(20,17,14,0.92) 0%, rgba(10,8,6,0.95) 100%)',
              border: `2px solid ${accent}`,
              borderRadius: 999,
              boxShadow: '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,106,0.35)',
            }}
          >
            <span style={{ fontSize: 64, lineHeight: 1, filter: 'saturate(0.6) brightness(1.1)' }}>📞</span>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: 82,
                color: LUX.gold,
                textShadow: softShadow,
                letterSpacing: 3,
                lineHeight: 1,
              }}
            >
              {hotline}
            </span>
          </div>
        ) : null}

        {/* CTA text — tracked uppercase eyebrow in gold */}
        {cta_text ? (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 42,
              color: LUX.gold,
              textTransform: 'uppercase',
              textShadow: softShadow,
              letterSpacing: 8,
            }}
          >
            {cta_text}
          </div>
        ) : null}

        {/* QR code */}
        <div
          style={{
            padding: 28,
            background: '#ffffff',
            borderRadius: 32,
            boxShadow: '0 24px 56px rgba(0,0,0,0.6)',
          }}
        >
          <Img
            src={staticFile(qr_path)}
            style={{
              width: 600,
              height: 600,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

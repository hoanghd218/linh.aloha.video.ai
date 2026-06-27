/**
 * Video.tsx — root composition.
 *
 * Layer stack (z-index):
 *   100 captions
 *   80  overlay punches (one Sequence each)
 *   1   avatar (full-frame backdrop, transform: scale via zoom hooks)
 *
 * Audio:
 *   voiceover.mp3 — full duration, primary audio
 *   sfx/* — short Sequences per cue
 */
import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import type { OverlaysData } from './types';
import { renderOverlay, FULL_SCREEN_VARIANTS } from './overlays';
import { Avatar } from './Avatar';
import { Captions, type CaptionGroup } from './Captions';
import { SfxTrack } from './SfxTrack';

export type VideoProps = {
  data: OverlaysData;
  captionGroups?: CaptionGroup[];
};

export const Video: React.FC<VideoProps> = ({ data, captionGroups }) => {
  const { fps } = useVideoConfig();
  // captions_enabled:false in overlays.json → hide the running bottom subtitle pill
  const captionsEnabled = data.captions_enabled !== false;
  const groups = captionsEnabled ? (captionGroups ?? data.caption_groups ?? []) : [];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Layer 1: avatar (full-frame) */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        <Avatar src={data.assets.source_video} zoomHooks={data.zoom_hooks} />
      </AbsoluteFill>

      {/* Layer 60: b-roll images (full-screen) — render below text overlays so text stays visible */}
      {/* Layer 80: text overlays — render on top of b-roll */}
      {data.overlays.map((overlay) => {
        const from = Math.max(0, Math.round(overlay.t_start * fps));
        const durFrames = Math.max(1, Math.round(overlay.duration * fps));
        const element = renderOverlay(overlay);
        if (!element) return null;
        const z = FULL_SCREEN_VARIANTS.includes(overlay.variant) ? 60 : 80;
        return (
          <Sequence
            key={overlay.id}
            from={from}
            durationInFrames={durFrames}
            layout="none"
            name={`${overlay.variant}: ${overlay.id}`}
          >
            <AbsoluteFill style={{ zIndex: z }}>{element}</AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Layer 100: captions */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Captions groups={groups} />
      </AbsoluteFill>

      {/* Layer 110: persistent hotline footer */}
      {data.hotline_footer ? (
        <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 40px',
                background: 'rgba(0,0,0,0.62)',
                borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.18)',
              }}
            >
              <span style={{ fontSize: 44, lineHeight: 1 }}>📞</span>
              <span
                style={{
                  fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 52,
                  color: '#ffffff',
                  letterSpacing: 2,
                  lineHeight: 1,
                }}
              >
                {data.hotline_footer}
              </span>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Audio: source.mp4 (HeyGen) provides the voiceover natively */}

      {/* Background music — loop, ducked low so voiceover stays dominant */}
      <Html5Audio src={staticFile('bgm/coconut-groove.wav')} loop volume={0.12} />

      {/* SFX cues */}
      {data.sfx_cues && data.sfx_cues.length > 0 ? <SfxTrack cues={data.sfx_cues} /> : null}
    </AbsoluteFill>
  );
};

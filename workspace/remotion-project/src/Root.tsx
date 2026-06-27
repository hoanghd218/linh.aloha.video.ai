/**
 * Root.tsx — composition registry. Two templates share the same `Video` engine.
 *
 *   BdsGeneralReview     → public/overlays-general.json
 *     Use case: video review chung về dự án BĐS (so sánh giá, hook urgency,
 *     CTA inbox môi giới). Component pool: Punch / PriceRed3D / PriceWithBrand
 *     / CalloutStack / BrollImage / CommentBubble / ContactCard.
 *
 *   BdsApartmentDetail   → public/overlays-apartment.json
 *     Use case: walkthrough chi tiết 1 căn hộ — diện tích / hướng / view,
 *     bảng giá theo tier, gallery tiện ích, close-up nội thất + finishing.
 *     Component pool: SceneApartmentPrice / SceneSpecRow / ScenePricePackage
 *     / SceneAmenityGrid / SceneFinishingDetail (+ shared text variants).
 *
 * Both compositions:
 *   - Read fps/width/height/duration from their JSON (single source of truth).
 *   - Fall back to a stub composition if the JSON is missing so Studio still
 *     loads with a helpful error.
 *   - Share `public/source.mp4`, `public/voiceover.mp3`, `public/caption-groups.json`.
 */
import React from 'react';
import { Composition, staticFile, AbsoluteFill } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import type { OverlaysData } from './types';
import type { CaptionGroup } from './Captions';
import { Video, type VideoProps } from './Video';

const FALLBACK_DATA: OverlaysData = {
  aesthetic: 'broker_creator',
  video_duration: 5.0,
  fps: 30,
  width: 1080,
  height: 1920,
  assets: {
    source_video: 'source.mp4',
    voiceover: 'voiceover.mp3',
  },
  overlays: [],
  zoom_hooks: [],
  sfx_cues: [],
};

const MissingAssets: React.FC<{ jsonName: string }> = ({ jsonName }) => (
  <AbsoluteFill
    style={{
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: 80,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 80, fontWeight: 900 }}>{jsonName} not found</div>
    <div style={{ fontSize: 36, maxWidth: 800, lineHeight: 1.4 }}>
      Drop a valid <code>{jsonName}</code> into <code>public/</code> to render this composition.
    </div>
  </AbsoluteFill>
);

function makeMetadataFn(jsonName: string): CalculateMetadataFunction<VideoProps> {
  return async ({ props, abortSignal }) => {
    let data: OverlaysData = FALLBACK_DATA;
    let captionGroups: CaptionGroup[] | undefined = props.captionGroups;

    if (props.data && Array.isArray(props.data.overlays) && props.data.overlays.length > 0) {
      data = props.data;
      console.log(`[Root:${jsonName}] using inputProps with`, data.overlays.length, 'overlays');
    } else {
      const overlaysUrl = staticFile(jsonName);
      console.log(`[Root:${jsonName}] fetching`, overlaysUrl);
      try {
        const res = await fetch(overlaysUrl, { signal: abortSignal });
        if (res.ok) {
          data = (await res.json()) as OverlaysData;
          console.log(
            `[Root:${jsonName}] loaded`,
            data.overlays?.length,
            'overlays, duration',
            data.video_duration,
          );
        } else {
          console.warn(`[Root:${jsonName}] fetch status ${res.status} — using fallback stub`);
        }
      } catch (err) {
        console.error(`[Root:${jsonName}] fetch failed:`, err);
      }
    }

    if (!captionGroups) {
      try {
        const captionsUrl = staticFile('caption-groups.json');
        const res = await fetch(captionsUrl, { signal: abortSignal });
        if (res.ok) captionGroups = (await res.json()) as CaptionGroup[];
      } catch {
        // captions optional
      }
    }

    const fps = data.fps || 30;
    const width = data.width || 1080;
    const height = data.height || 1920;
    const durationInFrames = Math.max(1, Math.ceil((data.video_duration || 5) * fps));

    return {
      durationInFrames,
      fps,
      width,
      height,
      props: { data, captionGroups },
    };
  };
}

function makeComponent(jsonName: string): React.FC<VideoProps> {
  return (props) => {
    if (
      props.data.overlays.length === 0 &&
      props.data.video_duration === FALLBACK_DATA.video_duration
    ) {
      return <MissingAssets jsonName={jsonName} />;
    }
    return <Video {...props} />;
  };
}

const GeneralReviewComponent = makeComponent('overlays-general.json');
const ApartmentDetailComponent = makeComponent('overlays-apartment.json');

const calculateGeneralMetadata = makeMetadataFn('overlays-general.json');
const calculateApartmentMetadata = makeMetadataFn('overlays-apartment.json');

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BdsGeneralReview"
        component={GeneralReviewComponent}
        durationInFrames={FALLBACK_DATA.video_duration * FALLBACK_DATA.fps}
        fps={FALLBACK_DATA.fps}
        width={FALLBACK_DATA.width}
        height={FALLBACK_DATA.height}
        defaultProps={{
          data: FALLBACK_DATA,
          captionGroups: undefined,
        }}
        calculateMetadata={calculateGeneralMetadata}
      />
      <Composition
        id="BdsApartmentDetail"
        component={ApartmentDetailComponent}
        durationInFrames={FALLBACK_DATA.video_duration * FALLBACK_DATA.fps}
        fps={FALLBACK_DATA.fps}
        width={FALLBACK_DATA.width}
        height={FALLBACK_DATA.height}
        defaultProps={{
          data: FALLBACK_DATA,
          captionGroups: undefined,
        }}
        calculateMetadata={calculateApartmentMetadata}
      />
    </>
  );
};

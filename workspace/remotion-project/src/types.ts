/**
 * types.ts — root data contract.
 *
 * Mirrors the shape written to `public/assets/overlays.json` by the Phase 3 packager.
 * The schema is documented in `references/overlays-schema.md`.
 *
 * IMPORTANT: keep this in sync with `scripts/validate.py` ALLOWED_VARIANTS + required
 * field checks per variant.
 */

import type { OverlayEntry } from './overlays';
import type { ZoomHook } from './zoom-hooks';
import type { CaptionGroup } from './Captions';
import type { SfxCue } from './SfxTrack';

export type OverlaysData = {
  $schema?: string;
  aesthetic: 'broker_creator';
  slug?: string;
  video_duration: number;
  fps: number;
  width: number;
  height: number;
  assets: {
    source_video: string; // 'source.mp4'
    voiceover?: string; // optional — if absent, source.mp4 audio is used
    captions?: string; // 'caption-groups.json' (relative to public/assets)
  };
  overlays: OverlayEntry[];
  zoom_hooks: ZoomHook[];
  sfx_cues?: SfxCue[];
  /** Inline caption groups (alternative to `assets.captions` JSON). */
  caption_groups?: CaptionGroup[];
  /** Set false to hide the running bottom subtitle pill (sparse luxury layout). */
  captions_enabled?: boolean;
  /** Persistent hotline footer shown bottom-center for the full video duration. */
  hotline_footer?: string;
};

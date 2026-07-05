/**
 * _placement — shared positioning helper for text overlays.
 *
 * Caption pill sits at `bottom: 30%` of 1920 = bottom 576..~680px (y≈1240..1344).
 * Avatar face anchors center. To avoid clipping either, every text overlay
 * positions in one of two safe zones (well clear of caption pill):
 *
 *   - top:    y≈280..520           → CSS top: 280
 *   - bottom: y≈1560..1840         → CSS bottom: 80 (well below caption pill, 80px from screen edge)
 */
import type React from 'react';

export type Placement = 'top' | 'bottom';

export function placementStyle(p: Placement = 'top'): React.CSSProperties {
  if (p === 'bottom') {
    return {
      position: 'absolute',
      bottom: 80,
      left: '50%',
      transformOrigin: 'center bottom',
    };
  }
  return {
    position: 'absolute',
    top: 280,
    left: '50%',
    transformOrigin: 'center top',
  };
}

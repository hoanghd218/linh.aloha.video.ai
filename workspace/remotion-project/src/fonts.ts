import { loadFont as loadBeVietnam } from '@remotion/google-fonts/BeVietnamPro';
import { loadFont as loadMulish } from '@remotion/google-fonts/Mulish';
import { loadFont as loadDancingScript } from '@remotion/google-fonts/DancingScript';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';

// Refined sans — used for tracked uppercase eyebrow labels (luxury lockup) + body.
loadBeVietnam('normal', { weights: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['vietnamese', 'latin'] });
loadBeVietnam('italic', { weights: ['700', '800', '900'], subsets: ['vietnamese', 'latin'] });

loadMulish('normal', { weights: ['700', '800', '900'], subsets: ['vietnamese', 'latin'] });

// Luxury serif display — high-contrast, full Vietnamese diacritic support.
// Used for hero headlines + brand/project names (replaces the broker black-stroke look).
loadPlayfair('normal', { weights: ['500', '600', '700', '800', '900'], subsets: ['vietnamese', 'latin'] });
loadPlayfair('italic', { weights: ['500', '600', '700'], subsets: ['vietnamese', 'latin'] });

// Calligraphy accent (kept for optional script moments; no longer the default brand style)
loadDancingScript('normal', { weights: ['600', '700'], subsets: ['vietnamese', 'latin'] });

import { loadFont as loadBeVietnam } from '@remotion/google-fonts/BeVietnamPro';
import { loadFont as loadMulish } from '@remotion/google-fonts/Mulish';
import { loadFont as loadDancingScript } from '@remotion/google-fonts/DancingScript';

loadBeVietnam('normal', { weights: ['600', '700', '800', '900'], subsets: ['vietnamese', 'latin'] });
loadBeVietnam('italic', { weights: ['700', '800', '900'], subsets: ['vietnamese', 'latin'] });

loadMulish('normal', { weights: ['700', '800', '900'], subsets: ['vietnamese', 'latin'] });
loadMulish('italic', { weights: ['700', '800', '900'], subsets: ['vietnamese', 'latin'] });

// Gold calligraphy accent for brand/project name moments (e.g. "Cao Xà Lá")
loadDancingScript('normal', { weights: ['600', '700'], subsets: ['vietnamese', 'latin'] });

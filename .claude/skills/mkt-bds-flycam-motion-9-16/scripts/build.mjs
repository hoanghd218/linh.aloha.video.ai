// Sinh index.html (HyperFrames 0.9.37, 1080x1920) cho video flycam + motion BĐS thương hiệu Linh Aloha từ <dự án>/video.json.
// Màu theo bộ luxury của repo (workspace/remotion-project/src/overlays/_lux.ts): navy #0A0E1F, đồng #A67C3D (nền ô nhấn, chữ trắng), vàng champagne #C9A86A.
// Khung mẫu đóng gói từ "OCP2-3 #01 Bay 60 giây" (2026-11-12). Chạy: node build.mjs <thư mục dự án>
// Ghi: index.html, nguon/phu-de.json (cụm phụ đề + mốc). In cảnh báo (cụm dài, chữ quá dài, mốc lệch) ra stderr.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(process.argv[2] || '.');
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'video.json'), 'utf8'));
const f2 = (x) => Math.round(x * 1000) / 1000;
const warn = (m) => console.error('CẢNH BÁO:', m);
const esc = (s) => String(s).replace(/&(?!nbsp;|amp;)/g, '&amp;').replace(/</g, '&lt;');

// ---------- thời lượng & mốc khối giọng ----------
const DUR = CFG.duration || f2(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(ROOT, CFG.voice || 'assets/audio/voice.wav')]).toString().trim());
const MOC = fs.existsSync(path.join(ROOT, CFG.moc || 'nguon/moc.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, CFG.moc || 'nguon/moc.json'), 'utf8')) : [];
const blk = (i) => MOC.find((b) => b.i === i);

// ---------- cảnh & clip (cùng công thức với cat_clip.py) ----------
const PRE = 0.25, POST = 0.12, TD = 0.37;
const SC = CFG.scenes;
const CLIPS = SC.map((s, k) => {
  const st = k === 0 ? 0 : s.at - PRE;
  let end = k === SC.length - 1 ? DUR : SC[k + 1].at + POST;
  if (s.max) end = Math.min(end, st + s.max);
  return { id: `c${String(k).padStart(2, '0')}`, k, st: f2(st), du: f2(end - st), tr: k ? s.tr || 'fade' : null, fadeOut: end < DUR - 0.05 && k === SC.length - 1 };
});

const HK = CFG.hook || null;
const HK_END = HK ? HK.until : 0;
const CTA = CFG.cta;
// Thương hiệu: mặc định Linh Aloha; ghi đè bằng video.json → brand {name, tag, avatar}.
const BRAND = { name: 'LINH ALOHA', tag: 'BĐS HÀNG HIỆU', avatar: 'assets/img/linh.jpg', ...(CFG.brand || {}) };
// Dòng liên hệ ở end card: hotline (brand Linh: "gọi hotline trên màn hình") và/hoặc Zalo. Số do chị Linh cung cấp, không tự điền.
const CONTACT = [CTA.hotline && `Hotline ${CTA.hotline}`, CTA.zalo && (CTA.zalo === CTA.hotline ? 'Zalo' : `Zalo ${CTA.zalo}`)].filter(Boolean).join(' · ');
const RC = CFG.recap || null;
const ZONES = (CFG.zones || []).map((z, i) => ({ ...z, n: i + 1 }));
const NZ = ZONES.length;
const pad2 = (n) => String(n).padStart(2, '0');
const HUD = { from: f2(Math.min(3.55, HK_END * 0.54 || 0.5)), to: CTA.at, total: null, ...(CFG.hud || {}) };
if (!HUD.total) { const t = Math.round(DUR / 5) * 5; HUD.total = `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`; }
const MAP_END = RC ? RC.at : CTA.at;
const TAGS = CFG.tags || [];
const CREDITS = CFG.credits || [];

// ---------- phụ đề: chia cụm + mốc theo âm tiết ----------
const SYL = { Ocean: 2, Park: 1, shophouse: 2, Venice: 3, gondola: 3, Vincom: 2, Mega: 2, Mall: 1, Vinhomes: 2, villa: 2, ...(CFG.syl || {}) };
const PAUSE = 1.2, MAXC = 30;
function autoSplit(text) {
  // không có dấu | → tách theo dấu câu, cụm > MAXC ký tự thì tách đôi ở khoảng trắng gần giữa
  const parts = [];
  for (const p of text.split(/(?<=[.,;:?!])\s+/)) {
    // gộp mẩu ngắn liền nhau ("Điểm 1, cửa ngõ.") nếu tổng ≤ 24 ký tự
    const prev = parts.at(-1);
    if (prev && (prev + ' ' + p).replace(/[[\]]/g, '').length <= 24) parts[parts.length - 1] = prev + ' ' + p; else parts.push(p);
  }
  const out = [];
  for (const p of parts) {
    const plain = p.replace(/[[\]]/g, '');
    if (plain.length <= MAXC) { out.push(p); continue; }
    const ws = p.split(/\s+/); let best = 1, bd = 1e9;
    for (let i = 1; i < ws.length; i++) {
      const a = ws.slice(0, i).join(' ');
      if ((a.match(/\[/g) || []).length !== (a.match(/\]/g) || []).length) continue; // không cắt giữa từ khoá
      const d = Math.abs(a.length - p.length / 2); if (d < bd) { bd = d; best = i; }
    }
    out.push(ws.slice(0, best).join(' '), ws.slice(best).join(' '));
  }
  return out.join(' | ');
}
function capWords(text) {
  const out = []; let kw = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let s = raw, open = false, close = false;
    if (s.startsWith('[')) { open = true; s = s.slice(1); }
    if (s.includes(']')) { close = true; s = s.replace(']', ''); }
    if (open) kw = true;
    out.push({ w: s, kw: s === '|' ? false : kw });
    if (close) kw = false;
  }
  return out;
}
const PHRASES = [];
for (const [bi, text0] of Object.entries(CFG.captions || {})) {
  const b = blk(+bi);
  if (!b) { warn(`phụ đề khối ${bi}: không có trong moc.json — bỏ qua`); continue; }
  const text = text0.includes('|') ? text0 : autoSplit(text0);
  const ws = capWords(text);
  const tw = ws.filter((w) => w.w !== '|');
  const endP = (w) => /[.,;:?!]$/.test(w.w);
  const wt = tw.map((w) => SYL[w.w.replace(/[.,;:?!]/g, '')] || 1);
  const tot = wt.reduce((x, y) => x + y, 0) + tw.filter(endP).length * PAUSE - (endP(tw.at(-1)) ? PAUSE : 0);
  let cum = 0;
  tw.forEach((w, i) => { w.t = f2(b.start + (cum / tot) * (b.end - b.start)); cum += wt[i] + (endP(w) ? PAUSE : 0); });
  let cur = [];
  for (const w of ws) { if (w.w === '|') { if (cur.length) PHRASES.push({ b: +bi, ws: cur }); cur = []; continue; } cur.push(w); }
  if (cur.length) PHRASES.push({ b: +bi, ws: cur });
}
PHRASES.forEach((p, i) => {
  p.st = f2(Math.max(p.ws[0].t - 0.08, i ? PHRASES[i - 1].ws.at(-1).t + 0.1 : 0));
  const nx = PHRASES[i + 1];
  const bEnd = blk(p.b).end + 0.3;
  p.en = f2(nx && nx.b === p.b ? nx.ws[0].t - 0.08 : Math.min(bEnd, nx ? nx.ws[0].t - 0.1 : bEnd));
  const len = p.ws.map((w) => w.w).join(' ').length;
  if (len > MAXC + 4) warn(`cụm phụ đề dài ${len} ký tự (nên ≤ ${MAXC}): "${p.ws.map((w) => w.w).join(' ')}"`);
});
for (let i = 0; i < PHRASES.length - 1; i++) if (PHRASES[i].en > PHRASES[i + 1].st) PHRASES[i].en = PHRASES[i + 1].st;
function phraseHTML(p, i) {
  const segs = [];
  p.ws.forEach((w, j) => {
    const span = `<span class="w" id="p${i}w${j}">${esc(w.w)}</span>`;
    const last = segs.at(-1);
    if (last && last.kw && w.kw) last.items.push(span); else segs.push({ kw: w.kw, items: [span] });
  });
  return `<div class="cap" id="cap${i}"><div class="cb">${segs.map((s) => (s.kw ? `<span class="kw">${s.items.join(' ')}</span>` : s.items.join(' '))).join(' ')}</div></div>`;
}
const kwHTML = (text, id) => esc(text).replace(/\[([^\]]+)\]/, `<span class="ik" id="${id}"><i></i><span>$1</span></span>`);

// ---------- tự co cỡ chữ khi chữ dài (khung chữ quan trọng 900px) ----------
const fit = (s, base, k = 0.62, w = 900) => Math.min(base, Math.floor(w / Math.max(1, String(s).replace(/&nbsp;/g, ' ').length * k)));

// ---------- mốc hook (mặc định = #01, co giãn theo hook.until) ----------
let HT = null;
if (HK) {
  const sc = HK.until / 6.6; const S = (x) => f2(x * sc);
  const d = { setup: (HK.setup || []).map((_, i) => S(0.17 + i * 0.12)), big: S(0.64), strike: S(1.72), kicker: S(1.88), boxes: (HK.boxes || []).map((_, i) => S(1.92 + i * 0.5)), counter: S(3.27), count: S(4.7), out: f2(HK.until - 0.4) };
  HT = { ...d, ...(HK.times || {}) };
}

// ---------- SFX tự sinh theo cấu trúc ----------
const SFX = [];
if (HK) {
  SFX.push(['whoosh-short', 0.05, 0.57, 0.3]);
  if (HK.kicker) SFX.push(['impact-bass-1', HT.kicker, 1.6, 0.42]);
  SFX.push(['pop', HUD.from, 0.7, 0.3]);
  if (HK.counter) SFX.push(['sparkle', HT.count, 1.6, 0.22]);
}
CLIPS.slice(1).forEach((c) => { if (c.st > CTA.at - 0.5) return; SFX.push([c.tr === 'fade' ? 'whoosh-short' : 'whoosh', f2(c.st - 0.05), 0.57, c.tr === 'fade' ? 0.14 : 0.3]); });
ZONES.forEach((z) => SFX.push(['click-soft', f2(z.at + 0.27), 0.36, 0.32]));
TAGS.forEach((t) => SFX.push(['pop', f2(t[1]), 0.7, 0.2]));
if (RC) RC.lines.forEach((l, i) => SFX.push(['click-soft', f2((l.at ?? RC.at + 0.35 + i * 1.5) + 0.03), 0.36, 0.22]));
if (CTA.at > 4) SFX.push(['riser', f2(CTA.at - 3.0), 3.0, 0.24, 1.75]);
SFX.push(['impact-bass-1', CTA.at, 1.6, 0.3]);
SFX.push(['chime', f2(CTA.keyword_at ?? CTA.at + 1.15), 2.4, 0.4]);
for (const x of CFG.extra_sfx || []) SFX.push(x);
SFX.forEach((s) => { if (s[1] + 0.2 > DUR) warn(`SFX ${s[0]} ở ${s[1]}s sát/vượt cuối video`); s[2] = f2(Math.min(s[2], DUR - s[1])); });

// ---------- mini-map & sơ đồ recap (minh hoạ, không theo tỉ lệ) ----------
function zig(n, x0, x1, y0, y1, amp) {
  if (n === 5 && amp < 50) return [[34, 168], [92, 112], [160, 146], [204, 80], [236, 34]]; // preset #01
  if (n === 5) return [[110, 560], [260, 410], [470, 470], [600, 270], [740, 120]];
  if (n === 1) return [[(x0 + x1) / 2, (y0 + y1) / 2]];
  return Array.from({ length: n }, (_, i) => [f2(x0 + (i * (x1 - x0)) / (n - 1)), f2(y0 + (i * (y1 - y0)) / (n - 1) + (i % 2 ? amp : 0))]);
}
const MM = zig(NZ, 34, 236, 168, 34, 30);
const RM = zig(NZ, 110, 740, 560, 120, 70);
const segLen = (P) => P.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
const MM_LEN = segLen(MM) || 1, RM_LEN = segLen(RM) || 1;
const mmUpTo = (k) => segLen(MM.slice(0, k + 1));
const RM_LBL = RM.map(([x, y], i) => (i === NZ - 1 ? [x, y - 46, 'middle'] : [x + 28, y + 12, 'start']));

// ---------- CSS ----------
const FONTS = [['Light', 300], ['Regular', 400], ['Medium', 500], ['SemiBold', 600], ['Bold', 700], ['ExtraBold', 800]]
  .map(([n, w]) => `@font-face{font-family:"BVP";src:url("assets/fonts/BeVietnamPro-${n}.ttf");font-weight:${w};}`).join('\n');
const zt = Math.min(...ZONES.map((z) => fit(z.title, 74, 0.64)), 74);
const CSS = `${FONTS}
:root{--navy:#0A0E1F;--acc:#A67C3D;--gold:#C9A86A;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0A0E1F;}
#root{position:absolute;inset:0;overflow:hidden;font-family:BVP,sans-serif;color:#fff;background:#0A0E1F;}
.vw{position:absolute;inset:0;overflow:hidden;will-change:transform;}
.vw video{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;transform-origin:50% 50%;}
.ab{position:absolute;}
#scrT{left:0;top:0;width:1080px;height:640px;background:linear-gradient(180deg,rgba(10,14,31,.86) 0%,rgba(10,14,31,.7) 30%,rgba(10,14,31,.34) 62%,rgba(10,14,31,0) 100%);}
#scrB{left:0;top:900px;width:1080px;height:1020px;background:linear-gradient(180deg,rgba(10,14,31,0) 0%,rgba(10,14,31,.58) 35%,rgba(10,14,31,.8) 100%);}
#hookDim,#rcDim,#ecDim{inset:0;opacity:0;}
#hookDim{background:rgba(10,14,31,.46);} #rcDim{background:rgba(10,14,31,.8);} #ecDim{background:rgba(10,14,31,.82);}
#brand{left:90px;top:214px;font-size:28px;font-weight:700;letter-spacing:.14em;white-space:nowrap;opacity:0;text-shadow:0 1px 8px rgba(0,0,0,.45);}
#brand em{font-style:normal;font-weight:500;color:var(--gold);letter-spacing:.1em;}
#timer{right:90px;top:210px;font-size:34px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;opacity:0;text-align:right;text-shadow:0 1px 8px rgba(0,0,0,.45);}
#timer small{font-size:28px;font-weight:500;color:rgba(255,255,255,.72);}
#bar{left:90px;top:276px;width:900px;height:8px;opacity:0;}
#barT{position:absolute;inset:0;border-radius:4px;background:rgba(255,255,255,.26);}
#barF{position:absolute;inset:0;border-radius:4px;background:linear-gradient(90deg,#A67C3D,#C9A86A);transform-origin:0 50%;}
.cp{position:absolute;top:-5px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#232A40;border:3px solid rgba(255,255,255,.75);}
#mm{left:690px;top:318px;width:300px;height:300px;border-radius:24px;background:rgba(10,14,31,.8);border:1.5px solid rgba(255,255,255,.18);opacity:0;padding:16px 18px;}
#mm .hd{font-size:18px;font-weight:700;letter-spacing:.14em;color:var(--gold);}
#mm svg{position:absolute;left:20px;top:44px;}
#mm .ft{position:absolute;left:18px;right:14px;bottom:36px;height:30px;}
#mm .ft div{position:absolute;left:0;top:0;font-size:21px;font-weight:700;white-space:nowrap;opacity:0;}
#mm .ft b{color:var(--gold);}
#mm .sc{position:absolute;left:18px;bottom:12px;font-size:18px;font-weight:500;color:rgba(255,255,255,.62);letter-spacing:.04em;}
.hk{position:absolute;left:90px;white-space:nowrap;font-weight:800;}
#hk1{top:540px;font-size:${HK ? fit((HK.setup || []).join(' '), 84, 0.66) : 84}px;}
#hk1 span{display:inline-block;opacity:0;margin-right:22px;text-shadow:0 2px 16px rgba(0,0,0,.35);}
#hk2{top:640px;font-size:${HK ? fit(HK.big || '', 150, 0.6) : 150}px;letter-spacing:-.01em;opacity:0;text-shadow:0 3px 20px rgba(0,0,0,.35);}
#hkS{position:absolute;left:84px;top:735px;width:${HK ? Math.min(900, Math.round(String(HK.big || '').length * 0.64 * fit(HK.big || '', 150, 0.6))) : 0}px;height:16px;background:var(--acc);transform-origin:0 50%;border-radius:3px;}
#hk3{top:868px;font-size:46px;font-weight:700;color:var(--gold);letter-spacing:.12em;opacity:0;}
.hb{position:absolute;left:78px;font-weight:800;line-height:1;padding:14px 22px 20px;white-space:nowrap;}
.hb i{position:absolute;inset:0;background:var(--acc);border-radius:14px;transform-origin:0 50%;}
.hb span{position:relative;opacity:0;}
#hk4{top:1236px;font-size:40px;font-weight:600;opacity:0;display:flex;align-items:center;gap:18px;}
#hk4 .n{font-size:92px;font-weight:800;color:#fff;font-variant-numeric:tabular-nums;}
#hk4 .u{font-size:44px;font-weight:800;color:var(--gold);letter-spacing:.08em;}
.zl{position:absolute;left:90px;top:1012px;opacity:0;}
.zl .zk{display:inline-block;font-size:26px;font-weight:700;letter-spacing:.22em;color:#fff;background:rgba(10,14,31,.82);border-left:5px solid var(--acc);padding:6px 14px;border-radius:6px;}
.zl .zt{font-size:${zt}px;font-weight:800;line-height:1.08;margin-top:4px;white-space:nowrap;text-shadow:0 3px 18px rgba(0,0,0,.42);}
.zl .zb{width:150px;height:8px;margin-top:14px;background:var(--acc);border-radius:4px;transform-origin:0 50%;}
.zl .zs{display:inline-block;margin-top:16px;padding:8px 18px;border-radius:10px;background:rgba(10,14,31,.86);font-size:28px;font-weight:600;letter-spacing:.06em;}
.tg{position:absolute;left:90px;top:1150px;opacity:0;display:flex;align-items:center;gap:16px;padding:14px 30px 16px 22px;border-radius:44px;background:rgba(10,14,31,.86);border:1.5px solid rgba(201,168,106,.35);font-size:40px;font-weight:600;white-space:nowrap;}
.tg i{width:18px;height:18px;border-radius:50%;background:var(--acc);box-shadow:0 0 0 5px rgba(201,168,106,.28);}
.cap{position:absolute;left:0;top:1290px;width:1080px;text-align:center;opacity:0;visibility:hidden;}
.cb{display:inline-block;max-width:900px;padding:14px 28px 16px;border-radius:18px;background:rgba(10,14,31,.88);font-size:46px;font-weight:700;line-height:1.25;white-space:nowrap;}
.cb .w{color:rgba(255,255,255,.42);}
.cb .kw{background:var(--acc);border-radius:10px;padding:0 10px 4px;margin:0 2px;}
.cb .kw .w{color:rgba(255,255,255,.62);}
.cr{position:absolute;left:90px;top:1458px;font-size:24px;font-weight:500;color:rgba(255,255,255,.78);text-shadow:0 1px 6px rgba(0,0,0,.6);white-space:nowrap;opacity:0;}
#rc{left:90px;top:330px;width:900px;opacity:0;}
#rc .hd{font-size:24px;font-weight:700;letter-spacing:.16em;color:var(--gold);}
#rc .hd small{font-weight:500;color:rgba(255,255,255,.66);letter-spacing:.06em;font-size:24px;margin-left:12px;}
#rc svg{display:block;margin-top:14px;}
.rt{position:absolute;left:90px;white-space:nowrap;opacity:0;}
.rt.s{font-size:46px;font-weight:600;color:rgba(255,255,255,.86);}
.rt.l{font-size:64px;font-weight:800;}
.rt.m{font-size:56px;font-weight:700;}
.ik{position:relative;display:inline-block;padding:0 14px 6px;}
.ik i{position:absolute;inset:0;background:var(--acc);border-radius:12px;transform-origin:0 50%;}
.ik span{position:relative;}
#ec{inset:0;opacity:0;}
#ecAv{position:absolute;left:400px;top:330px;width:280px;height:280px;}
#ecAv img{position:absolute;left:14px;top:14px;width:252px;height:252px;border-radius:50%;object-fit:cover;}
#ecAv svg{position:absolute;left:0;top:0;}
#ecN{position:absolute;left:0;width:1080px;top:650px;text-align:center;font-size:42px;font-weight:700;letter-spacing:.16em;opacity:0;}
#ecN small{display:block;font-size:28px;font-weight:500;color:var(--gold);letter-spacing:.2em;margin-top:6px;}
#ecL1{position:absolute;left:0;width:1080px;top:850px;text-align:center;font-size:${fit((CTA.lead || []).join(' '), 66, 0.6)}px;font-weight:700;white-space:nowrap;}
#ecL1 span{display:inline-block;opacity:0;margin:0 9px;}
#ecChip{position:absolute;left:0;width:1080px;top:960px;text-align:center;}
#ecChip .in{position:relative;display:inline-flex;align-items:center;gap:26px;padding:22px 52px 30px 40px;}
#ecChip i{position:absolute;inset:0;background:var(--acc);border-radius:28px;transform-origin:0 50%;}
#ecChip svg,#ecChip b{position:relative;opacity:0;}
#ecChip b{font-size:${fit(CTA.keyword, 128, 0.66, 760)}px;font-weight:800;line-height:1;white-space:nowrap;}
#ecL3{position:absolute;left:0;width:1080px;top:1196px;text-align:center;font-size:${fit(CTA.line || '', 44, 0.52)}px;font-weight:600;color:rgba(255,255,255,.9);opacity:0;}
#ecZ{position:absolute;left:0;width:1080px;top:1272px;text-align:center;font-size:${fit(CONTACT, 40, 0.6)}px;font-weight:700;color:var(--gold);letter-spacing:.06em;opacity:0;}
#ecL4{position:absolute;left:0;width:1080px;top:${CONTACT ? 1350 : 1290}px;text-align:center;font-size:28px;font-weight:500;color:rgba(255,255,255,.66);letter-spacing:.06em;opacity:0;}
`;

// ---------- HTML ----------
const vids = CLIPS.map((c) => `<div class="vw" id="w${c.id}"><video id="${c.id}" class="clip" src="assets/video/${c.id}.mp4" muted playsinline data-layout-allow-overflow data-start="${c.st}" data-duration="${c.du}" data-track-index="${c.k % 2}"></video></div>`).join('\n      ');
const cps = ZONES.map((z) => `<div class="cp" id="cp${z.n}" style="left:${f2(((z.at - HUD.from) / (HUD.to - HUD.from)) * 100)}%"></div>`).join('');
const mmSvg = `<svg width="262" height="200" viewBox="0 0 262 200" data-layout-ignore>
  <polyline points="${MM.map((p) => p.join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
  <polyline id="mmP" points="${MM.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#C9A86A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f2(MM_LEN)}" stroke-dashoffset="${f2(MM_LEN)}"/>
  ${MM.map((p, i) => `<g><circle id="mmN${i + 1}" cx="${p[0]}" cy="${p[1]}" r="13" fill="#0A0E1F" stroke="rgba(255,255,255,.7)" stroke-width="2.5"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" font-family="BVP" font-weight="700" font-size="14" fill="#fff">${i + 1}</text></g>`).join('\n  ')}
  <g id="mmDot" transform="translate(${MM[0] ? MM[0].join(',') : '0,0'})" opacity="0"><circle r="20" fill="rgba(201,168,106,.28)"/><circle r="8" fill="#fff"/></g>
</svg>`;
const rmSvg = `<svg width="900" height="640" viewBox="0 0 900 640">
  <polyline points="${RM.map((p) => p.join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
  <polyline id="rmP" points="${RM.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#C9A86A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f2(RM_LEN)}" stroke-dashoffset="${f2(RM_LEN)}"/>
  ${RM.map((p, i) => `<g id="rmN${i + 1}" style="transform-origin:${p[0]}px ${p[1]}px"><circle cx="${p[0]}" cy="${p[1]}" r="22" fill="#A67C3D" stroke="#fff" stroke-width="4"/><text x="${p[0]}" y="${p[1] + 8}" text-anchor="middle" font-family="BVP" font-weight="800" font-size="22" fill="#fff">${i + 1}</text></g>`).join('\n  ')}
  ${RM_LBL.map(([x, y, a], i) => `<text id="rmL${i + 1}" x="${x}" y="${y}" text-anchor="${a}" font-family="BVP" font-weight="700" font-size="32" fill="#fff" opacity="0">${esc(ZONES[i].mm)}</text>`).join('\n  ')}
</svg>`;
const pinSvg = (w, c = '#fff') => `<svg width="${w}" height="${f2(w * 1.3)}" viewBox="0 0 84 110"><path d="M42 104 C42 104 8 64 8 40 A34 34 0 1 1 76 40 C76 64 42 104 42 104 Z" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/><circle cx="42" cy="40" r="13" fill="${c}"/></svg>`;
const audio = [
  `<audio id="vo" class="clip" src="${CFG.voice || 'assets/audio/voice.wav'}" data-start="0" data-duration="${DUR}" data-volume="1" data-track-index="10"></audio>`,
  CFG.bgm ? `<audio id="bgm" class="clip" src="${CFG.bgm.file}" data-start="0" data-duration="${DUR}" data-volume="${CFG.bgm.volume ?? 0.34}" data-track-index="11"></audio>` : '',
  ...SFX.map(([f, t, d, v, ms], i) => `<audio id="sx${i}" class="clip" src="assets/sfx/${f}.mp3" data-start="${t}" data-duration="${d}" data-volume="${v}"${ms ? ` data-media-start="${ms}"` : ''} data-track-index="${20 + (i % 6)}"></audio>`),
].filter(Boolean).join('\n      ');
const hookHTML = !HK ? '' : `
      <div class="hk" id="hk1">${(HK.setup || []).map((w) => `<span>${esc(w)}</span>`).join('')}</div>
      <div class="hk" id="hk2" data-layout-allow-occlusion>${esc(HK.big || '')}</div>
      ${HK.strike ? '<div id="hkS"></div>' : ''}
      ${HK.kicker ? `<div class="hk" id="hk3">${esc(HK.kicker)}</div>` : ''}
      ${(HK.boxes || []).map((b, i) => `<div class="hb" id="hb${i + 1}" style="top:${928 + i * 140}px;font-size:${fit(b, 108, 0.64, 880)}px"><i></i><span>${esc(b)}</span></div>`).join('\n      ')}
      ${HK.counter ? `<div class="hk" id="hk4">${HK.counter.label} <span class="n" id="hkN">0</span><span class="u">${esc(HK.counter.unit || 'GIÂY')}</span></div>` : ''}`;
const RCL = RC ? RC.lines.map((l, i) => ({ ...l, at: l.at ?? f2(RC.at + 0.35 + i * 1.5), top: [1110, 1190, 1300, 1400][i] ?? 1400 + (i - 3) * 90 })) : [];
const recapHTML = !RC ? '' : `
      ${RC.map !== false && NZ ? `<div class="ab" id="rc"><div class="hd">SƠ ĐỒ MINH HỌA<small>không theo tỉ lệ · vị trí ước lượng</small></div>${rmSvg}</div>` : ''}
      ${RCL.map((l, i) => `<div class="rt ${l.size || 'm'}" id="rt${i + 1}" style="top:${l.top}px">${kwHTML(l.text, `rk${i + 1}`)}</div>`).join('\n      ')}`;
const ctaLead = CTA.lead || ['Inbox', 'em', 'Linh', 'chữ'];

const html = `<!doctype html>
<html lang="vi" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>${CSS}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
      ${vids}
      <div class="ab" id="hookDim"></div>
      <div class="ab" id="rcDim"></div>
      <div class="ab" id="ecDim"></div>
      <div class="ab" id="scrT"></div>
      <div class="ab" id="scrB"></div>

      <div class="ab" id="brand">${esc(BRAND.name)} <em>/ ${esc(BRAND.tag)}</em></div>
      <div class="ab" id="timer"><span id="tm">00:${pad2(Math.floor(HUD.from))}</span> <small>/ ${HUD.total}</small></div>
      <div class="ab" id="bar"><div id="barT"></div><div id="barF"></div>${cps}</div>
      ${NZ ? `<div class="ab" id="mm"><div class="hd">SƠ ĐỒ MINH HỌA</div>${mmSvg}
        <div class="ft">${ZONES.map((z) => `<div id="mmF${z.n}"><b>${pad2(z.n)}</b> · ${esc(z.mm)}</div>`).join('')}</div>
        <div class="sc">Không theo tỉ lệ</div></div>` : ''}
${hookHTML}

      ${ZONES.map((z) => `<div class="zl" id="zl${z.n}"><div class="zk">ĐIỂM ${pad2(z.n)} / ${pad2(NZ)}</div><div class="zt">${esc(z.title)}</div><div class="zb"></div><div class="zs">${esc(z.sub)}</div></div>`).join('\n      ')}
      ${TAGS.map((t, i) => `<div class="tg" id="tg${i}"><i></i><span>${esc(t[0])}</span></div>`).join('\n      ')}
      ${PHRASES.map(phraseHTML).join('\n      ')}
      ${CREDITS.map((c, i) => `<div class="cr" id="cr${i}">${esc(c[0])}</div>`).join('\n      ')}
${recapHTML}

      <div class="ab" id="ec">
        <div id="ecAv"><img src="${esc(BRAND.avatar)}" alt="${esc(BRAND.name)}"/><svg width="280" height="280" viewBox="0 0 280 280"><circle id="ecRing" cx="140" cy="140" r="134" fill="none" stroke="#C9A86A" stroke-width="8" stroke-linecap="round" stroke-dasharray="842" stroke-dashoffset="842" transform="rotate(-90 140 140)"/></svg></div>
        <div id="ecN">${esc(BRAND.name)}<small>${esc(BRAND.tag)}</small></div>
        <div id="ecL1">${ctaLead.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
        <div id="ecChip"><div class="in"><i></i>${pinSvg(78)}<b>${esc(CTA.keyword)}</b></div></div>
        ${CTA.line ? `<div id="ecL3">${esc(CTA.line)}</div>` : ''}
        ${CONTACT ? `<div id="ecZ">${esc(CONTACT)}</div>` : ''}
        ${CTA.footer ? `<div id="ecL4">${esc(CTA.footer)}</div>` : ''}
      </div>

      ${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const E = 'power3.out';
${buildTimeline()}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;

function buildTimeline() {
  const L = [];
  const a = (s) => L.push('      ' + s);
  // --- video: ken burns + chuyển cảnh khớp lưới nhạc ---
  CLIPS.forEach((c, i) => {
    a(`tl.fromTo('#${c.id}',{scale:1.04},{scale:1.13,duration:${c.du},ease:'none'},${c.st});`);
    if (c.fadeOut) a(`tl.to('#w${c.id}',{opacity:0,duration:0.3,ease:'none'},${f2(c.st + c.du - 0.3)});`);
    if (!c.tr) return;
    const s = c.st, prev = CLIPS[i - 1];
    if (c.tr === 'zoom') {
      a(`tl.fromTo('#w${c.id}',{opacity:0,scale:1.28,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:${TD},ease:'power3.out'},${s});`);
      a(`tl.to('#w${prev.id}',{scale:1.18,filter:'blur(8px)',duration:${TD},ease:'power2.in'},${s});`);
    } else if (c.tr === 'whip' || c.tr === 'whipU') {
      const ax = c.tr === 'whip' ? 'xPercent' : 'yPercent';
      a(`tl.fromTo('#w${c.id}',{${ax}:100,filter:'blur(18px)'},{${ax}:0,filter:'blur(0px)',duration:${TD},ease:'power3.inOut'},${s});`);
      a(`tl.to('#w${prev.id}',{${ax}:-32,filter:'blur(10px)',duration:${TD},ease:'power3.inOut'},${s});`);
    } else {
      a(`tl.fromTo('#w${c.id}',{opacity:0},{opacity:1,duration:${TD + 0.05},ease:'sine.inOut'},${s});`);
    }
  });

  // --- HUD: nhãn thương hiệu, đồng hồ, thanh tiến độ ---
  a(`tl.fromTo('#brand',{opacity:0,y:-12},{opacity:1,y:0,duration:0.28,ease:E},0.3);`);
  a(`tl.to('#brand',{opacity:0,duration:0.25},${f2(CTA.at - 0.1)});`);
  a(`tl.fromTo(['#timer','#bar'],{opacity:0,y:-16},{opacity:1,y:0,duration:0.28,ease:E,stagger:0.06},${HUD.from});`);
  a(`tl.fromTo('#barF',{scaleX:0},{scaleX:1,duration:${f2(HUD.to - HUD.from - 0.05)},ease:'none'},${f2(HUD.from + 0.05)});`);
  a(`tl.to(['#timer','#bar'],{opacity:0,y:-12,duration:0.25,ease:'power2.in'},${f2(HUD.to - 0.05)});`);
  for (let s = Math.ceil(HUD.from + 0.01); s <= Math.floor(HUD.to); s++) a(`tl.set('#tm',{textContent:'${pad2(Math.floor(s / 60))}:${pad2(s % 60)}'},${s});`);
  ZONES.forEach((z) => a(`tl.to('#cp${z.n}',{backgroundColor:'#A67C3D',borderColor:'#FFFFFF',scale:1.25,duration:0.22,ease:'back.out(2)'},${z.at});`));

  // --- mini-map ---
  if (NZ) {
    a(`tl.fromTo('#mm',{opacity:0,y:-18,scale:0.96},{opacity:1,y:0,scale:1,duration:0.3,ease:E},${f2(Math.max(ZONES[0].at - 0.18, HK_END - 0.18, 0))});`);
    a(`tl.to('#mm',{opacity:0,y:-14,duration:0.25,ease:'power2.in'},${f2(MAP_END - 0.2)});`);
    ZONES.forEach((z, i) => {
      const t = f2(z.at + 0.05);
      if (i === 0) a(`tl.fromTo('#mmDot',{opacity:0},{opacity:1,duration:0.2},${t});`);
      else {
        a(`tl.to('#mmDot',{attr:{transform:'translate(${MM[i][0]},${MM[i][1]})'},duration:0.6,ease:'power2.inOut'},${t});`);
        a(`tl.to('#mmP',{attr:{'stroke-dashoffset':${f2(MM_LEN - mmUpTo(i))}},duration:0.6,ease:'power2.inOut'},${t});`);
      }
      a(`tl.to('#mmN${z.n}',{attr:{fill:'#A67C3D',stroke:'#FFFFFF'},duration:0.2},${f2(t + (i ? 0.5 : 0.1))});`);
      a(`tl.fromTo('#mmF${z.n}',{opacity:0,y:10},{opacity:1,y:0,duration:0.25,ease:E},${f2(t + 0.2)});`);
      const nx = ZONES[i + 1];
      if (nx) a(`tl.to('#mmF${z.n}',{opacity:0,y:-8,duration:0.18},${f2(nx.at)});`);
    });
  }

  // --- hook ---
  if (HK) {
    a(`tl.fromTo('#hookDim',{opacity:0},{opacity:1,duration:0.35},0);`);
    a(`tl.to('#hookDim',{opacity:0,duration:0.35},${f2(HK.until - 0.25)});`);
    HT.setup.forEach((t, i) => a(`tl.fromTo('#hk1 span:nth-child(${i + 1})',{opacity:0,y:36},{opacity:1,y:0,duration:0.24,ease:E},${t});`));
    a(`tl.fromTo('#hk2',{opacity:0,y:40,scale:1.06},{opacity:1,y:0,scale:1,duration:0.3,ease:E,transformOrigin:'0% 50%'},${HT.big});`);
    if (HK.strike) {
      a(`tl.fromTo('#hkS',{scaleX:0},{scaleX:1,duration:0.22,ease:'power2.out'},${HT.strike});`);
      a(`tl.to(['#hk2','#hk1'],{opacity:0.42,duration:0.2},${f2(HT.strike + 0.14)});`);
    }
    if (HK.kicker) a(`tl.fromTo('#hk3',{opacity:0,x:-24},{opacity:1,x:0,duration:0.24,ease:E},${HT.kicker});`);
    (HK.boxes || []).forEach((_, i) => {
      const t = HT.boxes[i];
      a(`tl.fromTo('#hb${i + 1} i',{scaleX:0},{scaleX:1,duration:0.25,ease:'power3.out'},${t});`);
      a(`tl.fromTo('#hb${i + 1} span',{opacity:0,y:20},{opacity:1,y:0,duration:0.24,ease:E},${f2(t + 0.08)});`);
    });
    if (HK.counter) {
      a(`tl.fromTo('#hk4',{opacity:0,y:24},{opacity:1,y:0,duration:0.28,ease:E},${HT.counter});`);
      for (let k = 0; k <= 12; k++) a(`tl.set('#hkN',{textContent:'${Math.round((k / 12) * HK.counter.to)}'},${f2(HT.count + k * 0.035)});`);
    }
    const ids = ['#hk1', '#hk2', HK.strike && '#hkS', HK.kicker && '#hk3', ...(HK.boxes || []).map((_, i) => `#hb${i + 1}`), HK.counter && '#hk4'].filter(Boolean);
    a(`tl.to(${JSON.stringify(ids)},{opacity:0,y:-36,filter:'blur(8px)',duration:0.28,ease:'power2.in',stagger:0.03},${HT.out});`);
  }

  // --- nhãn khu, thẻ chi tiết, nguồn ---
  ZONES.forEach((z) => {
    const s = f2(z.at + 0.15), e = z.until;
    a(`tl.fromTo('#zl${z.n}',{opacity:0,x:-28},{opacity:1,x:0,duration:0.28,ease:E},${s});`);
    a(`tl.fromTo('#zl${z.n} .zb',{scaleX:0},{scaleX:1,duration:0.25,ease:E},${f2(s + 0.12)});`);
    a(`tl.fromTo('#zl${z.n} .zs',{opacity:0,y:10},{opacity:1,y:0,duration:0.22,ease:E},${f2(s + 0.22)});`);
    a(`tl.to('#zl${z.n}',{opacity:0,x:-24,duration:0.22,ease:'power2.in'},${f2(e - 0.22)});`);
  });
  TAGS.forEach(([, s, e], i) => {
    a(`tl.fromTo('#tg${i}',{opacity:0,x:-24},{opacity:1,x:0,duration:0.26,ease:E},${s});`);
    a(`tl.to('#tg${i}',{opacity:0,x:-18,duration:0.2,ease:'power2.in'},${f2(e - 0.2)});`);
  });
  CREDITS.forEach(([, s, e], i) => {
    a(`tl.fromTo('#cr${i}',{opacity:0},{opacity:1,duration:0.3},${s});`);
    a(`tl.to('#cr${i}',{opacity:0,duration:0.2},${f2(e - 0.2)});`);
  });

  // --- phụ đề karaoke ---
  PHRASES.forEach((p, i) => {
    a(`tl.fromTo('#cap${i}',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:0.16,ease:E},${p.st});`);
    a(`tl.set('#cap${i}',{autoAlpha:0},${p.en});`);
    p.ws.forEach((w, j) => a(`tl.to('#p${i}w${j}',{color:'#FFFFFF',duration:0.08},${f2(Math.max(p.st, w.t))});`));
  });

  // --- recap ---
  if (RC) {
    a(`tl.fromTo('#rcDim',{opacity:0},{opacity:1,duration:0.4},${f2(RC.at - 0.05)});`);
    if (RC.map !== false && NZ) {
      a(`tl.fromTo('#rc',{opacity:0,y:30},{opacity:1,y:0,duration:0.35,ease:E},${f2(RC.at + 0.1)});`);
      a(`tl.to('#rmP',{attr:{'stroke-dashoffset':0},duration:1.0,ease:'power2.inOut'},${f2(RC.at + 0.25)});`);
      RM.forEach((_, i) => {
        a(`tl.fromTo('#rmN${i + 1}',{scale:0},{scale:1,duration:0.26,ease:'back.out(2.2)'},${f2(RC.at + 0.3 + i * 0.2)});`);
        a(`tl.fromTo('#rmL${i + 1}',{opacity:0},{opacity:1,duration:0.22},${f2(RC.at + 0.4 + i * 0.2)});`);
      });
    }
    RCL.forEach((l, i) => {
      a(`tl.fromTo('#rt${i + 1}',{opacity:0,y:18},{opacity:1,y:0,duration:0.26,ease:E},${l.at});`);
      if (/\[/.test(l.text)) a(`tl.fromTo('#rk${i + 1} i',{scaleX:0},{scaleX:1,duration:0.25,ease:E},${f2(l.kw_at ?? l.at + 0.5)});`);
    });
    const ids = [RC.map !== false && NZ && '#rc', ...RCL.map((_, i) => `#rt${i + 1}`)].filter(Boolean);
    a(`tl.to(${JSON.stringify(ids)},{opacity:0,y:-20,duration:0.26,ease:'power2.in',stagger:0.03},${f2(CTA.at - 0.22)});`);
    a(`tl.to('#rcDim',{opacity:0,duration:0.3},${f2(CTA.at - 0.1)});`);
  }

  // --- end card CTA ---
  const C = CTA.at, kwAt = CTA.keyword_at ?? f2(C + 1.15), lineAt = CTA.line_at ?? f2(kwAt + 0.37);
  const leadAt = CTA.lead_at || ctaLead.map((_, i) => f2(C + 0.1 + i * 0.25));
  a(`tl.fromTo('#ecDim',{opacity:0},{opacity:1,duration:0.35},${f2(C - 0.15)});`);
  a(`tl.fromTo('#ec',{opacity:0},{opacity:1,duration:0.2},${C});`);
  a(`tl.fromTo('#ecAv',{scale:0.7,opacity:0},{scale:1,opacity:1,duration:0.36,ease:'back.out(1.8)'},${f2(C + 0.02)});`);
  a(`tl.to('#ecRing',{attr:{'stroke-dashoffset':0},duration:0.8,ease:'power2.inOut'},${f2(C + 0.1)});`);
  a(`tl.fromTo('#ecN',{opacity:0,y:14},{opacity:1,y:0,duration:0.28,ease:E},${f2(C + 0.25)});`);
  leadAt.forEach((t, i) => a(`tl.fromTo('#ecL1 span:nth-child(${i + 1})',{opacity:0,y:26},{opacity:1,y:0,duration:0.24,ease:E},${t});`));
  a(`tl.fromTo('#ecChip i',{scaleX:0},{scaleX:1,duration:0.26,ease:'power3.out'},${kwAt});`);
  a(`tl.fromTo(['#ecChip svg','#ecChip b'],{opacity:0,y:20},{opacity:1,y:0,duration:0.26,ease:E,stagger:0.05},${f2(kwAt + 0.08)});`);
  if (CTA.line) a(`tl.fromTo('#ecL3',{opacity:0,y:16},{opacity:1,y:0,duration:0.28,ease:E},${lineAt});`);
  if (CONTACT) a(`tl.fromTo('#ecZ',{opacity:0,y:12},{opacity:1,y:0,duration:0.28,ease:E},${f2(CTA.contact_at ?? lineAt + 0.35)});`);
  if (CTA.footer) a(`tl.fromTo('#ecL4',{opacity:0},{opacity:1,duration:0.3},${f2(lineAt + 0.68)});`);
  for (const t of [kwAt + 2.45, kwAt + 3.95]) if (t + 0.6 < DUR) a(`tl.to('#ecChip .in',{scale:1.04,duration:0.28,ease:'sine.inOut',yoyo:true,repeat:1},${f2(t)});`);
  return L.join('\n');
}

// ---------- kiểm logic cơ bản ----------
if (CLIPS.at(-1).st + CLIPS.at(-1).du < DUR - 0.05 && !CLIPS.at(-1).fadeOut) warn('clip cuối kết thúc trước video');
SC.forEach((s, k) => { if (k && s.at <= SC[k - 1].at) warn(`scene ${k}: at không tăng dần`); });
ZONES.forEach((z) => { if (z.until <= z.at + 0.6) warn(`khu ${z.n}: until quá sát at`); });
TAGS.forEach(([t, s, e]) => ZONES.forEach((z) => { if (s < z.until && e > z.at + 0.15) warn(`thẻ "${t}" (${s}–${e}s) trùng lúc nhãn khu ${z.n} (${z.at}–${z.until}s) → đè chữ; cho thẻ hiện sau until của khu`); }));
if (CTA.at > DUR - 2.5) warn(`CTA bắt đầu ${CTA.at}s, còn < 2,5 s tới cuối (${DUR}s)`);
for (const [k, v] of [['hotline', CTA.hotline], ['zalo', CTA.zalo]]) if (v && !/^[0-9 .]{9,14}$/.test(v)) warn(`số ${k} có ký tự lạ: "${v}"`);
if (!CONTACT) warn('CTA chưa có hotline/Zalo — brand Linh Aloha mời "gọi hotline trên màn hình"; điền cta.hotline bằng số chị Linh cung cấp (không tự bịa)');
if (!fs.existsSync(path.join(ROOT, BRAND.avatar))) warn(`thiếu avatar ${BRAND.avatar} (tao_du_an.sh chép từ workspace/assets/brand/linh avatar.jpg)`);

fs.mkdirSync(path.join(ROOT, 'nguon'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'index.html'), html);
fs.writeFileSync(path.join(ROOT, 'nguon/phu-de.json'), JSON.stringify(PHRASES.map((p) => ({ st: p.st, en: p.en, text: p.ws.map((w) => w.w).join(' ') })), null, 1));
console.log('ok index.html', { duration: DUR, clips: CLIPS.length, zones: NZ, phrases: PHRASES.length, sfx: SFX.length });

#!/usr/bin/env node
// Tạo trang HTML "chọn hiệu ứng" (Bước 4) hoặc "storyboard" (Bước 5) từ template của skill.
//
//   node tao-trang.mjs chon       <du-lieu.json> --ra <video>/output/chon-hieu-ung.html
//   node tao-trang.mjs storyboard <du-lieu.json> --ra <video>/output/storyboard.html
//
// <du-lieu.json> = đối tượng DỮ LIỆU của trang, KHÔNG cần trường "base" (script tự tính):
//   chon:       {"preset":"cam_kem","scenes":[{"id":1,"t_in":0,"t_out":5,"say":"…","suggest":["typo_gold","count_up"]}]}
//   storyboard: {"preset":"cam_kem","scenes":[{"id":1,"t_in":0,"t_out":4.1,"say":"…","effect":"typo_gold","need":[{"k":"ảnh dự án","ok":false}]}]}
//
// "base" = đường dẫn từ nơi đặt tệp HTML tới assets/effects/thumbs của skill (dùng "/" để mở bằng Chrome).
// Thoát mã 1 nếu dữ liệu sai; chỉ CẢNH BÁO (không dừng) khi thiếu hình xem trước của một mã hiệu ứng.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const K = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EFF = path.join(K, 'assets', 'effects');
const PRESETS = ['xanh_gradient', 'cam_kem', 'neon_toi'];
const TEMPLATE = { chon: 'picker_template.html', storyboard: 'storyboard_template.html' };

const die = (m) => { console.error('LỖI: ' + m); process.exit(1); };
const [mode, dataFile, ...rest] = process.argv.slice(2);
if (!TEMPLATE[mode] || !dataFile) die('Dùng: node tao-trang.mjs <chon|storyboard> <du-lieu.json> --ra <tệp.html>');
const iRa = rest.indexOf('--ra');
if (iRa < 0 || !rest[iRa + 1]) die('Thiếu --ra <tệp.html>');
const out = path.resolve(rest[iRa + 1]);

let data;
try { data = JSON.parse(fs.readFileSync(dataFile, 'utf8').replace(/^﻿/, '')); }
catch (e) { die(`Không đọc được ${dataFile}: ${e.message}`); }

if (!PRESETS.includes(data.preset)) die(`preset "${data.preset}" không có. Chọn: ${PRESETS.join(' | ')}`);
if (!Array.isArray(data.scenes) || !data.scenes.length) die('"scenes" phải là mảng có ít nhất 1 cảnh');

const errs = [], warns = [];
let prevEnd = -Infinity;
const ids = new Set();
data.scenes.forEach((s, i) => {
  const w = `cảnh #${i + 1}`;
  if (s.id == null) errs.push(`${w}: thiếu id`);
  else if (ids.has(s.id)) errs.push(`${w}: id ${s.id} trùng`);
  else ids.add(s.id);
  if (!(typeof s.t_in === 'number' && typeof s.t_out === 'number' && s.t_in < s.t_out)) errs.push(`${w}: t_in/t_out phải là số và t_in < t_out`);
  else {
    if (s.t_in < prevEnd - 0.05) warns.push(`${w}: bắt đầu ${s.t_in}s trước khi cảnh trước hết (${prevEnd}s)`);
    prevEnd = s.t_out;
  }
  if (!s.say || typeof s.say !== 'string') errs.push(`${w}: thiếu "say" (lời nói của cảnh)`);
  const codes = mode === 'chon' ? s.suggest : [s.effect];
  if (mode === 'chon' && !(Array.isArray(s.suggest) && s.suggest.length)) errs.push(`${w}: "suggest" phải là mảng 1–4 mã`);
  if (mode === 'storyboard' && !s.effect) errs.push(`${w}: thiếu "effect"`);
  for (const c of codes || []) {
    if (c && c !== 'speaker_only' && !fs.existsSync(path.join(EFF, 'thumbs', data.preset, c + '.jpg'))) warns.push(`${w}: không có hình xem trước cho mã "${c}" (preset ${data.preset})`);
  }
});
if (errs.length) { console.error('Dữ liệu sai:\n - ' + errs.join('\n - ')); process.exit(1); }

let rel = path.relative(path.dirname(out), path.join(EFF, 'thumbs'));
rel = path.isAbsolute(rel) ? pathToFileURL(path.join(EFF, 'thumbs')).href : rel.split(path.sep).join('/'); // khác ổ đĩa → file://
data.base = rel;

const tpl = fs.readFileSync(path.join(EFF, TEMPLATE[mode]), 'utf8');
const RE = /\/\*DATA\*\/[\s\S]*?\/\*END\*\//;
if (!RE.test(tpl)) die(`template ${TEMPLATE[mode]} không có cặp /*DATA*/ … /*END*/`);
const BS = String.fromCharCode(92); // dấu gạch chéo ngược — dựng bằng mã để mã nguồn không chứa chuỗi thoát unicode
const esc = (c) => BS + 'u' + c.charCodeAt(0).toString(16).padStart(4, '0');
const json = JSON.stringify(data).replace(/</g, esc('<')).replace(new RegExp('[' + String.fromCharCode(0x2028, 0x2029) + ']', 'g'), esc); // chặn </script> và ký tự phân dòng Unicode trong JSON nhúng
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, tpl.replace(RE, () => '/*DATA*/' + json + '/*END*/'), 'utf8');

console.log(`Đã tạo: ${out}`);
console.log(`  ${data.scenes.length} cảnh · preset ${data.preset} · base = ${rel}`);
warns.forEach((w) => console.log('  CẢNH BÁO: ' + w));

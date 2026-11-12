#!/usr/bin/env node
// Kiểm skill Claude Code. Dùng: node kiem-skill.mjs <thư-mục-skill>...   (hoặc --all <gốc .claude/skills>)
// Ra: bảng + danh sách LỖI (E) và CẢNH BÁO (W). Thoát mã 1 nếu có E.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let dirs = [];
if (args[0] === '--all') {
  const root = args[1];
  dirs = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(root, d.name));
} else dirs = args;

function parseFront(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const km = lines[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!km) continue;
    let [, k, v] = km;
    if (/^[>|][-+]?$/.test(v.trim())) {
      const buf = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) buf.push(lines[++i].trim());
      v = buf.join(' ');
    } else if (/^["']/.test(v)) {
      const q = v[0];
      v = v.slice(1);
      while (!v.trimEnd().endsWith(q) && i + 1 < lines.length) v += ' ' + lines[++i].trim();
      v = v.trimEnd().slice(0, -1);
    }
    out[k] = v;
  }
  return { fm: out, body: text.slice(m[0].length), frontLines: m[0].split('\n').length - 1 };
}

const SECRET = /(api[_-]?key|token|secret|password)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{24,}/i;
const ABS = /(\/Users\/[A-Za-z0-9_.-]+|[A-Z]:\\\\?Users\\\\?[A-Za-z0-9_.-]+|\/home\/[a-z0-9_.-]+)/;
let hasE = false;
const rows = [];

for (const dir of dirs) {
  const skill = path.join(dir, 'SKILL.md');
  const name = path.basename(dir);
  const E = [], W = [];
  if (!fs.existsSync(skill)) { rows.push({ name, lines: 0, desc: 0, E: ['thiếu SKILL.md'], W: [] }); hasE = true; continue; }
  const text = fs.readFileSync(skill, 'utf8');
  const p = parseFront(text);
  if (!p) { rows.push({ name, lines: 0, desc: 0, E: ['không có frontmatter'], W: [] }); hasE = true; continue; }
  const { fm, body } = p;
  const bodyLines = body.split('\n').length;
  if (fm.name !== name) E.push(`name "${fm.name}" ≠ tên thư mục "${name}"`);
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(fm.name || '')) E.push('name sai dạng (a-z 0-9 gạch ngang, ≤ 64)');
  const d = (fm.description || '').length;
  if (!d) E.push('thiếu description');
  if (d > 1024) E.push(`description ${d} ký tự > 1024`);
  else if (d > 900) W.push(`description ${d} ký tự (gần trần 1024)`);
  if (d && d < 120) W.push(`description chỉ ${d} ký tự — thiếu trigger / loại trừ?`);
  if (fm.description && !/(Dùng khi|USE WHEN|Use when|Use this|Trigger|khi (Hoàng|người dùng|user))/i.test(fm.description)) W.push('description chưa có câu "dùng khi…"');
  if (fm.description && !/(Không dùng|Don't use|Do NOT use|NOT for|Not for)/i.test(fm.description)) W.push('description chưa nêu loại trừ ("Không dùng cho…")');
  if (bodyLines > 500) E.push(`SKILL.md ${bodyLines} dòng > 500`);
  else if (bodyLines > 350) W.push(`SKILL.md ${bodyLines} dòng (nên ≤ 350, đẩy chi tiết sang references/)`);

  // liên kết markdown tương đối
  for (const m of body.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
    const t = m[1];
    if (/^(https?:|mailto:|<)/.test(t)) continue;
    if (!fs.existsSync(path.join(dir, decodeURIComponent(t)))) E.push(`liên kết gãy: ${t}`);
  }
  // đường dẫn trong dấu huyền
  const seen = new Set();
  for (const m of body.matchAll(/`((?:references|scripts|assets|templates|profiles|evals)\/[A-Za-z0-9_.\-\/À-ỹ ]+?)`/g)) {
    const t = m[1].replace(/[.,;:]+$/, '');
    if (seen.has(t) || /[*<>{}$]/.test(t)) continue;
    seen.add(t);
    if (!fs.existsSync(path.join(dir, t))) W.push(`đường dẫn không có: ${t}`);
  }
  // mọi tệp text trong skill: khoá lộ + đường dẫn tuyệt đối
  const walk = (p0) => fs.readdirSync(p0, { withFileTypes: true }).flatMap(e => {
    const f = path.join(p0, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' || e.name === '__pycache__' ? [] : walk(f);
    return [f];
  });
  for (const f of walk(dir)) {
    if (!/\.(md|py|sh|mjs|js|ts|tsx|json|yaml|yml|txt)$/i.test(f)) continue;
    if (fs.statSync(f).size > 600_000) continue;
    const t = fs.readFileSync(f, 'utf8');
    const rel = path.relative(dir, f);
    if (SECRET.test(t)) E.push(`có thể lộ khoá trong ${rel}`);
    if (ABS.test(t)) W.push(`đường dẫn tuyệt đối theo máy trong ${rel}`);
  }
  if (E.length) hasE = true;
  rows.push({ name, lines: bodyLines, desc: d, E, W });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('skill', 58) + pad('dòng', 6) + pad('desc', 6) + 'E  W');
for (const r of rows) console.log(pad(r.name, 58) + pad(r.lines, 6) + pad(r.desc, 6) + `${r.E.length}  ${r.W.length}`);
console.log('');
for (const r of rows) {
  if (!r.E.length && !r.W.length) continue;
  console.log(`## ${r.name}`);
  for (const e of r.E) console.log('  E ' + e);
  for (const w of r.W.slice(0, 12)) console.log('  W ' + w);
  if (r.W.length > 12) console.log(`  W … thêm ${r.W.length - 12} cảnh báo`);
}
process.exit(hasE ? 1 : 0);

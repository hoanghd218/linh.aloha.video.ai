# Agent đăng bài đa kênh + auto-reply — Thiết kế (Hermes)

> Trạng thái: TƯ VẤN (chưa build). Đã có Blotato; thiếu API inbound từng kênh.
> Kênh: Facebook, YouTube, TikTok, Instagram.

## 0. Nguyên tắc cốt lõi (đọc trước)

- **Blotato = OUTBOUND (đăng bài).** Nó KHÔNG đọc/được trả lời comment. Auto-reply phải dùng API gốc từng nền tảng.
- **Skill `mkt-blotato-publish-social` hiện bị khóa chỉ Facebook.** Đa kênh ⇒ làm skill mới `blotato-multi-publish` (Blotato hỗ trợ FB/IG/TikTok/YouTube/X/LinkedIn — chỉ cần accountId/pageId từng kênh trong Blotato dashboard).
- Đây là hành động RA NGOÀI, lên tài khoản thật ⇒ tách rõ DRAFT vs PUBLISH, có người duyệt ở giai đoạn đầu.

## 1. Profile: `community-manager`

```
hermes profile create community-manager      # gpt-5.5 (hoặc Opus cho reply khéo)
```
SOUL.md: brand voice trả lời comment (xưng hô, tone, điều cấm). Trim skill thừa, giữ: media (blotato), social-media, productivity (notion), research.

## 2. PUBLISH (outbound) — đã gần xong nhờ Blotato

| Kênh | Blotato | Việc cần làm |
|---|---|---|
| Facebook | ✅ connect sẵn (page 704841222706761) | mở khóa skill |
| YouTube | cần connect trong Blotato | lấy accountId |
| TikTok | cần connect trong Blotato | lấy accountId |
| Instagram | cần connect trong Blotato (IG Business) | lấy accountId |

**Luồng:** video render xong ở `workspace/content/<date>/<slug>/` → Kanban tạo 1 task/kênh:
```
hermes kanban create "Đăng <slug> lên TikTok" --assignee community-manager --body "<path mp4 + caption + hashtag>"
hermes kanban daemon --max 4     # đăng 4 kênh song song
```
Caption/hashtag mỗi kênh khác nhau → agent tự adapt từ script.

## 3. ENGAGE (inbound / auto-reply) — KHOẢNG TRỐNG, cần API mới

### Facebook (real-time, NÊN làm webhook)
- Cần: **Meta App** (developers.facebook.com) + **Page Access Token** (long-lived) + quyền `pages_manage_engagement`, `pages_read_engagement`.
- Subscribe webhook field `feed` (chứa comment) trỏ tới endpoint công khai.
- `hermes webhook` nhận event → agent sinh reply → `POST /{comment-id}/comments` (Graph API).
- Cần URL public: VPS, hoặc ngrok/cloudflared khi chạy laptop.

### YouTube (BẮT BUỘC poll — không có webhook comment)
- Cần: **YouTube Data API v3** bật trong Google Cloud + **OAuth client** (scope `youtube.force-ssl`).
- `hermes cron` mỗi 5–15 phút → `commentThreads.list` (video gần đây) → lọc comment chưa trả lời (lưu state đã xử lý) → `comments.insert`.
- Quota: mỗi insert ~50 đơn vị / hạn mức 10.000/ngày → đủ cho vài trăm reply/ngày.

### Instagram (webhook, chung Meta App với FB)
- Cần: IG **Business/Creator** account liên kết Facebook Page + quyền `instagram_manage_comments`.
- Webhook field `comments` → reply qua Graph API. Dùng chung app + endpoint với FB.

### TikTok (hạn chế — bán tự động)
- API comment public chưa mở reply ổn định. Phương án: poll qua API lấy comment để agent SOẠN reply nháp → người duyệt dán, hoặc bỏ auto-reply TikTok giai đoạn đầu.

## 4. TRAFFIC / REPORT
- `hermes cron` daily → kéo insights mỗi kênh (FB Graph insights, YouTube Analytics API, TikTok/IG insights) → tổng hợp → `hermes send --to telegram` hoặc ghi Notion.

## 5. Ánh xạ tính năng Hermes
| Nhu cầu | Hermes |
|---|---|
| Đăng song song nhiều kênh | `kanban` + `daemon --max N` |
| Auto-reply FB/IG real-time | `webhook` (subscribe Meta) |
| Auto-reply YouTube | `cron` (poll commentThreads) |
| Report traffic định kỳ | `cron` + `send` (Telegram/Notion) |
| Chạy độc lập laptop | profile trên VPS + gateway (tùy chọn) |

## 6. CHECKLIST CREDENTIALS (cái anh đang thiếu)

**Publishing (Blotato dashboard):**
- [ ] Connect YouTube channel → lấy `accountId`
- [ ] Connect TikTok → lấy `accountId`
- [ ] Connect Instagram Business → lấy `accountId`
- [ ] (FB đã có: account 30606 / page 704841222706761)

**Auto-reply Facebook + Instagram (1 Meta App dùng chung):**
- [ ] Tạo Meta App (developers.facebook.com), thêm sản phẩm Webhooks + Graph API
- [ ] Page Access Token long-lived (FB page)
- [ ] Quyền: pages_manage_engagement, pages_read_engagement, instagram_manage_comments
- [ ] App review nếu cần (quyền nâng cao)
- [ ] Endpoint webhook public (VPS / ngrok) + verify token

**Auto-reply YouTube:**
- [ ] Google Cloud project → bật YouTube Data API v3
- [ ] OAuth 2.0 Client ID (Desktop/Web) + consent screen
- [ ] OAuth scope youtube.force-ssl, lưu refresh token

**Env cần thêm vào `~/.hermes/profiles/community-manager/.env`:**
```
BLOTATO_API_KEY=...                  # đã có
META_APP_ID=...  META_APP_SECRET=...
FB_PAGE_ACCESS_TOKEN=...  FB_WEBHOOK_VERIFY_TOKEN=...
IG_BUSINESS_ACCOUNT_ID=...
YT_OAUTH_CLIENT_ID=...  YT_OAUTH_CLIENT_SECRET=...  YT_REFRESH_TOKEN=...
```

## 7. Lộ trình đề xuất (giảm rủi ro)
1. **Phase A — Publish đa kênh** (chỉ cần Blotato): mở khóa skill, test đăng 1 video lên 4 kênh. An toàn, không cần API mới.
2. **Phase B — Auto-reply Facebook** (webhook) — kênh anh mạnh nhất, có sẵn page.
3. **Phase C — Auto-reply YouTube** (cron poll).
4. **Phase D — Instagram** (thêm vào Meta App), **TikTok** bán tự động.
5. **Phase E — Report traffic** daily.

> Giai đoạn đầu nên để chế độ "draft reply → người duyệt" rồi mới bật full-auto, tránh agent trả lời sai/nhạy cảm trên tài khoản thật.

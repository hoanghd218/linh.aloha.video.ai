# HeyGen presenter segment prompts

Tạo riêng từng đoạn presenter để có thể sửa cục bộ. Dùng chung avatar, voice, background, camera distance và lighting cho cả video.

## Base prompt

```text
Create a portrait 9:16 presenter-only clip for a Vietnamese real-estate short video.
The selected presenter speaks Vietnamese in a confident, warm, conversational tone.
Target duration: {duration_seconds} seconds.

MESSAGE TO CONVEY IN VIETNAMESE:
{segment_script}

This script is a concept and theme to convey — not a verbatim transcript. You have full creative freedom to phrase it naturally and fit the target duration. Do not pad with silence or pauses.

PRESENTER DIRECTION:
- Medium close-up, natural eye contact, restrained hand gestures.
- Keep the presenter clearly visible and leave safe space for portrait captions.
- Maintain the same premium, modern real-estate studio background across all segments.
- End on a neutral pose that can cut cleanly into property footage.

NEGATIVE DIRECTIONS:
- No stock footage, AI-generated inserts, B-roll, motion graphics, charts, maps, text, subtitles, logos, lower thirds, music, or sound effects.
- Do not describe the presenter's physical appearance.
- Do not invent prices, legal status, progress, location facts, or amenities.
```

Frame Check corrections from `heygen-video` must be appended after this prompt, never replaced.

## Hook

Use 2.5–4.5 seconds. State one specific tension or payoff. Avoid greeting, name introduction and “hôm nay Linh sẽ…”. End on a noun/verb that can match-cut to the strongest property shot.

## Bridge

Use 2–4 seconds. Reframe the argument or introduce the next proof. Do not summarize the prior block. One video normally needs zero to two bridges.

## CTA

Use 4–7 seconds. Request one action only: xem nhà, nhận bảng hàng, nhận phân tích hoặc đặt lịch. Do not stack phone, inbox, comment and follow in one line.

## After generation

Transcribe each returned clip and use actual speech timing. If wording changes a factual claim, reject and regenerate that segment with a safer concept. Store prompt, output path, transcript and identifiers in `heygen-segments.json`.

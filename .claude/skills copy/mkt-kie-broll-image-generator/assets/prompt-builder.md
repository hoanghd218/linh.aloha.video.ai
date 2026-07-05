# Prompt builder template

A KIE AI image prompt = SCENE + STYLE + NEGATIVE.

- **SCENE** — 1-2 sentences describing what is in the frame (subject, action, lighting hint, framing). Can be Vietnamese or English; image models handle both. Be concrete (`mẹ cong lưng nhặt rau trong bếp gia đình`) instead of abstract (`tình mẫu tử`).
- **STYLE** — appended automatically when `--profile <name>` is set. Reads `profiles/<name>/style.md` and concatenates as suffix. Defines palette / lighting / aesthetic / camera language.
- **NEGATIVE** — implicit tail appended by the builder: `avoid: text overlays, watermarks, AI artifacts, distorted hands, oversaturated colors, modern minimalist aesthetic`.

## Final assembled prompt shape

```
<SCENE> .

<STYLE block from profile> .

avoid: text overlays, watermarks, AI artifacts, distorted hands, oversaturated colors.
```

## Provider-specific notes

- **Nano Banana 2** — strong for photorealistic warm editorial, fine with multilingual prompts. Default for Thu / GEIN. Output format = `png`.
- **GPT Image 2** — better when prompt explicitly needs text rendered into the image (typography overlays, signage, book covers with title). Smaller aspect-ratio enum set.

## Examples

### Example 1 — Thu / GEIN family scene
```
SCENE: Người mẹ Việt Nam khoảng 50 tuổi, cong lưng nhặt rau bên bếp gas, ánh nắng chiều xuyên qua cửa sổ chiếu lên vai. Close-up từ phía sau, lấy nét vào bàn tay mẹ.

STYLE: <appended from profiles/thu-gein/style.md>

avoid: text overlays, watermarks, AI artifacts, distorted hands, oversaturated colors.
```

### Example 2 — Brand book callout
```
SCENE: Quyển sách bìa cứng tựa "Hành trình khắc tên mình lên đá" đặt trên bàn gỗ, cạnh tách trà ấm, ánh nắng nghiêng. Bố cục tĩnh vật.

STYLE: <appended from profile>

avoid: text overlays, watermarks, AI artifacts.
```

## Tips

- Keep SCENE short. The STYLE block carries most of the aesthetic work.
- For people, name relationship + action + framing. Avoid naming brands of clothes or face features (model will hallucinate).
- For text-in-image requests (book covers, signs, banners), switch to `--provider gpt-image`.
- If you need 4K output, note that Nano Banana supports 1K / 2K / 4K; GPT Image 2 supports 1K / 2K / 4K except 1:1 cannot be 4K.

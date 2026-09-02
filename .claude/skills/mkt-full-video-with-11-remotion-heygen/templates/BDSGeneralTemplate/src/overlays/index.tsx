/**
 * overlays/index.tsx — variant registry (9 components, broker-creator aesthetic).
 *
 * Text variants:
 *   - punch              single-line uppercase italic, color prop
 *   - punch-2line        2-line stacked uppercase italic, color prop
 *   - price-red-3d       hero price/number with red 3D shadow stack
 *   - price-with-brand   price-red-3d + brand label below
 *   - callout-stack      setup line (top) + emphasis (bottom, color)
 *   - icon-stack         optional icon + 2-line stacked text
 *
 * Media variants:
 *   - broll-image            full-screen project image with ken-burns
 *
 * CTA variants:
 *   - comment-bubble         social CTA bubble
 *   - contact-card           full-screen avatar (top) + QR (bottom) end card
 */
import React from 'react';

import { Punch } from './Punch';
import { Punch2Line } from './Punch2Line';
import { PriceRed3D } from './PriceRed3D';
import { PriceWithBrand } from './PriceWithBrand';
import { CalloutStack } from './CalloutStack';
import { IconStack } from './IconStack';
import { BrollImage } from './BrollImage';
import { CommentBubble } from './CommentBubble';
import { ContactCard } from './ContactCard';
import type { Placement } from './_placement';

export type OverlayVariant =
  | 'punch'
  | 'punch-2line'
  | 'price-red-3d'
  | 'price-with-brand'
  | 'callout-stack'
  | 'icon-stack'
  | 'broll-image'
  | 'comment-bubble'
  | 'contact-card';

type OverlayBase = {
  id: string;
  t_start: number;
  duration: number;
};

export type OverlayEntry =
  | (OverlayBase & { variant: 'punch'; text: string; color?: string; italic?: boolean; placement?: Placement })
  | (OverlayBase & {
      variant: 'punch-2line';
      text: string;
      color?: string;
      subtitle_color?: string;
      headline_font?: 'display' | 'script';
      placement?: Placement;
    })
  | (OverlayBase & { variant: 'price-red-3d'; text: string; placement?: Placement })
  | (OverlayBase & { variant: 'price-with-brand'; price_text: string; brand_text: string; placement?: Placement })
  | (OverlayBase & {
      variant: 'callout-stack';
      setup_text: string;
      emphasis_text: string;
      emphasis_color?: string;
      setup_color?: string;
      placement?: Placement;
    })
  | (OverlayBase & {
      variant: 'icon-stack';
      line1: string;
      line2: string;
      icon_path?: string;
      color?: string;
      placement?: Placement;
    })
  | (OverlayBase & { variant: 'broll-image'; image_path: string; caption?: string })
  | (OverlayBase & { variant: 'comment-bubble'; username?: string; comment_text: string })
  | (OverlayBase & {
      variant: 'contact-card';
      avatar_path: string;
      qr_path: string;
      name?: string;
      cta_text?: string;
      hotline?: string;
      bg_color?: string;
      accent?: string;
    });

export const ALLOWED_VARIANTS: OverlayVariant[] = [
  'punch',
  'punch-2line',
  'price-red-3d',
  'price-with-brand',
  'callout-stack',
  'icon-stack',
  'broll-image',
  'comment-bubble',
  'contact-card',
];

export function renderOverlay(entry: OverlayEntry): React.ReactElement | null {
  switch (entry.variant) {
    case 'punch':
      return (
        <Punch
          text={entry.text}
          color={entry.color}
          italic={entry.italic}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'punch-2line':
      return (
        <Punch2Line
          text={entry.text}
          color={entry.color}
          subtitle_color={entry.subtitle_color}
          headline_font={entry.headline_font}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'price-red-3d':
      return (
        <PriceRed3D
          text={entry.text}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'price-with-brand':
      return (
        <PriceWithBrand
          price_text={entry.price_text}
          brand_text={entry.brand_text}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'callout-stack':
      return (
        <CalloutStack
          setup_text={entry.setup_text}
          emphasis_text={entry.emphasis_text}
          emphasis_color={entry.emphasis_color}
          setup_color={entry.setup_color}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'icon-stack':
      return (
        <IconStack
          line1={entry.line1}
          line2={entry.line2}
          icon_path={entry.icon_path}
          color={entry.color}
          placement={entry.placement}
          durationSec={entry.duration}
        />
      );
    case 'broll-image':
      return (
        <BrollImage
          imagePath={entry.image_path}
          caption={entry.caption}
          durationSec={entry.duration}
        />
      );
    case 'comment-bubble':
      return (
        <CommentBubble
          username={entry.username}
          commentText={entry.comment_text}
          durationSec={entry.duration}
        />
      );
    case 'contact-card':
      return (
        <ContactCard
          avatar_path={entry.avatar_path}
          qr_path={entry.qr_path}
          name={entry.name}
          cta_text={entry.cta_text}
          hotline={entry.hotline}
          bg_color={entry.bg_color}
          accent={entry.accent}
          durationSec={entry.duration}
        />
      );
    default:
      return null;
  }
}

export {
  Punch,
  Punch2Line,
  PriceRed3D,
  PriceWithBrand,
  CalloutStack,
  IconStack,
  BrollImage,
  CommentBubble,
  ContactCard,
};

/**
 * CommentBubble — LUXURY restyle (name kept for JSON variant compatibility).
 * Was a loud white TikTok comment bubble; now a refined dark-glass quote card
 * with a thin gold left rule, gold handle, and cream serif text in sentence
 * case. Gentle fade + upward drift, no rotation, no scale-pop, no black stroke.
 *
 * Sits low (bottom 150) so its top edge clears the caption pill. See
 * lessons-learned § 7.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFitTextSize } from '../utils/fit-text';
import { luxEnter, LUX, SERIF, SANS, softShadow } from './_lux';

export type CommentBubbleProps = {
  username?: string;
  commentText: string;
  durationSec: number;
};

export const CommentBubble: React.FC<CommentBubbleProps> = ({
  username = '@user',
  commentText,
  durationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, translateY } = luxEnter(frame, fps, durationSec);

  const commentFs = useFitTextSize({
    text: commentText,
    maxWidth: 700,
    maxFontSize: 64,
    minFontSize: 40,
    fontWeight: 600,
    fontFamily: SERIF,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: '50%',
          transform: `translateX(-50%) translateY(${translateY}px)`,
          transformOrigin: 'center bottom',
          opacity,
          maxWidth: 820,
          padding: '34px 46px 34px 42px',
          background: 'linear-gradient(180deg, rgba(20,17,14,0.86) 0%, rgba(10,8,6,0.9) 100%)',
          borderLeft: `4px solid ${LUX.gold}`,
          borderRadius: 22,
          boxShadow: '0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,106,0.25)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 34,
            color: LUX.gold,
            letterSpacing: 4,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {username}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: commentFs,
            color: LUX.cream,
            lineHeight: 1.18,
            textShadow: softShadow,
            overflowWrap: 'break-word',
          }}
        >
          {commentText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

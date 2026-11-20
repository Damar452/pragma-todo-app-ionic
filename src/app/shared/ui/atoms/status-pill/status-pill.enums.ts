export const StatusPillTone = {
  Success: 'success',
  Primary: 'primary',
  Neutral: 'neutral',
} as const;

export type StatusPillTone = (typeof StatusPillTone)[keyof typeof StatusPillTone];

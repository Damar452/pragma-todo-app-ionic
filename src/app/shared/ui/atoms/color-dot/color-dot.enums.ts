export const ColorDotSize = { Sm: 'sm', Md: 'md', Lg: 'lg' } as const;

export type ColorDotSize = (typeof ColorDotSize)[keyof typeof ColorDotSize];

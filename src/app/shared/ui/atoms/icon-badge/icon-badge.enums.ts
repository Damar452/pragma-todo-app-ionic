export const IconBadgeSize = { Sm: 'sm', Md: 'md' } as const;

export type IconBadgeSize = (typeof IconBadgeSize)[keyof typeof IconBadgeSize];

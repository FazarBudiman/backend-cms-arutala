export const Roles = ['ADMIN', 'SUPER_ADMIN'] as const
export type Role = (typeof Roles)[number]

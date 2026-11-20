export type TaskFilter =
  | { readonly kind: 'all' }
  | { readonly kind: 'uncategorized' }
  | { readonly kind: 'category'; readonly categoryId: string };

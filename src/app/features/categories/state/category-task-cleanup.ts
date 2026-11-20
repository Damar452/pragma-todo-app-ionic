/**
 * The only thing the categories state needs from tasks: dropping a deleted
 * category from them. A narrow contract (ISP) so the categories state never
 * imports the tasks feature; the app root binds it (see `provideCategoryTaskCleanup`).
 */
export abstract class CategoryTaskCleanup {
  abstract unassignCategory(categoryId: string): Promise<void>;
}

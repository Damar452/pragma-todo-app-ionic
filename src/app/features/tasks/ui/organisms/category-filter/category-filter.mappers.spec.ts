import { ALL_CHIP_ID, UNCATEGORIZED_CHIP_ID } from './category-filter.constants';
import { toChipId, toTaskFilter } from './category-filter.mappers';

import { TaskFilterKind } from '@features/tasks/domain/task-filter.enums';

describe('category filter mappers', () => {
  describe('toChipId', () => {
    it('maps the "all" filter to the reserved all id', () => {
      // Arrange / Act
      const result = toChipId({ kind: TaskFilterKind.All });

      // Assert
      expect(result).toBe(ALL_CHIP_ID);
    });

    it('maps the "uncategorized" filter to the reserved none id', () => {
      // Arrange / Act
      const result = toChipId({ kind: TaskFilterKind.Uncategorized });

      // Assert
      expect(result).toBe(UNCATEGORIZED_CHIP_ID);
    });

    it('maps a category filter to its category id', () => {
      // Arrange / Act
      const result = toChipId({ kind: TaskFilterKind.Category, categoryId: 'c1' });

      // Assert
      expect(result).toBe('c1');
    });
  });

  describe('toTaskFilter', () => {
    it('maps the reserved ids back to their filters', () => {
      // Arrange / Act
      const all = toTaskFilter(ALL_CHIP_ID);
      const none = toTaskFilter(UNCATEGORIZED_CHIP_ID);

      // Assert
      expect(all).toEqual({ kind: TaskFilterKind.All });
      expect(none).toEqual({ kind: TaskFilterKind.Uncategorized });
    });

    it.each(['c1', 'constructor', 'toString'])('treats %s as a category id', (id) => {
      // Arrange / Act
      const result = toTaskFilter(id);

      // Assert
      expect(result).toEqual({ kind: TaskFilterKind.Category, categoryId: id });
    });
  });
});

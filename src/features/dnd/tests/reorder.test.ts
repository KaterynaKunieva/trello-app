import { calculateNewPositions, normalizePositions, ReorderAction } from '../utils/reorder';

describe('reorder utilities', () => {
  describe('normalizePositions', () => {
    it('sorts and normalizes positions to 0, 1, 2...', () => {
      const items = [
        { id: '3', title: 'Third', position: 5 },
        { id: '1', title: 'First', position: 2 },
        { id: '2', title: 'Second', position: 10 },
      ];

      const normalized = normalizePositions(items);

      expect(normalized).toEqual([
        { id: '1', title: 'First', position: 0 },
        { id: '3', title: 'Third', position: 1 },
        { id: '2', title: 'Second', position: 2 },
      ]);
    });
  });

  describe('calculateNewPositions', () => {
    const initialItems = [
      { id: 'a', position: 0 },
      { id: 'b', position: 1 },
      { id: 'c', position: 2 },
      { id: 'd', position: 3 },
    ];

    it('handles REORDER forward (moving item from 0 to 2)', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'REORDER',
        payload: { id: 'a', oldPosition: 0, newPosition: 2 },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatedItems).toEqual([
        { id: 'b', position: 0 },
        { id: 'c', position: 1 },
        { id: 'a', position: 2 },
        { id: 'd', position: 3 },
      ]);

      expect(updatesForApi).toEqual([
        { id: 'a', position: 2 },
        { id: 'b', position: 0 },
        { id: 'c', position: 1 },
      ]);
    });

    it('handles REORDER backward (moving item from 2 to 0)', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'REORDER',
        payload: { id: 'c', oldPosition: 2, newPosition: 0 },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatedItems).toEqual([
        { id: 'c', position: 0 },
        { id: 'a', position: 1 },
        { id: 'b', position: 2 },
        { id: 'd', position: 3 },
      ]);

      expect(updatesForApi).toEqual([
        { id: 'a', position: 1 },
        { id: 'b', position: 2 },
        { id: 'c', position: 0 },
      ]);
    });

    it('handles DELETE item', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'DELETE',
        payload: { id: 'b' },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatedItems).toEqual([
        { id: 'a', position: 0 },
        { id: 'c', position: 1 },
        { id: 'd', position: 2 },
      ]);

      expect(updatesForApi).toEqual([
        { id: 'c', position: 1 },
        { id: 'd', position: 2 },
      ]);
    });

    it('handles CREATE item', () => {
      const newItem = { id: 'e', position: 1 };
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'CREATE',
        payload: { id: 'e', item: newItem },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatedItems).toEqual([
        { id: 'a', position: 0 },
        { id: 'e', position: 1 },
        { id: 'b', position: 2 },
        { id: 'c', position: 3 },
        { id: 'd', position: 4 },
      ]);

      expect(updatesForApi).toEqual([
        { id: 'b', position: 2 },
        { id: 'c', position: 3 },
        { id: 'd', position: 4 },
      ]);
    });

    it('handles REORDER when oldPosition equals newPosition', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'REORDER',
        payload: { id: 'b', oldPosition: 1, newPosition: 1 },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatesForApi).toEqual([]);
      expect(updatedItems).toEqual(initialItems);
    });

    it('handles DELETE when item does not exist', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'DELETE',
        payload: { id: 'non-existent' },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(initialItems, action);

      expect(updatesForApi).toEqual([]);
      expect(updatedItems).toEqual(initialItems);
    });

    it('handles REORDER moving first item to the last position (oldPosition: 0, newPosition: 3)', () => {
      const action: ReorderAction<{ id: string; position: number }> = {
        type: 'REORDER',
        payload: { id: 'a', oldPosition: 0, newPosition: 3 },
      };

      const { updatedItems } = calculateNewPositions(initialItems, action);

      expect(updatedItems).toEqual([
        { id: 'b', position: 0 },
        { id: 'c', position: 1 },
        { id: 'd', position: 2 },
        { id: 'a', position: 3 },
      ]);
    });
  });

  describe('card position calculations (same-list and cross-list)', () => {
    it('calculates position updates correctly for same-list card reordering', () => {
      const listCards = [
        { id: 'c1', title: 'Card 1', position: 0 },
        { id: 'c2', title: 'Card 2', position: 1 },
        { id: 'c3', title: 'Card 3', position: 2 },
      ];

      const action: ReorderAction<{ id: string; title: string; position: number }> = {
        type: 'REORDER',
        payload: { id: 'c1', oldPosition: 0, newPosition: 2 },
      };

      const { updatedItems, updatesForApi } = calculateNewPositions(listCards, action);
      const apiUpdates = updatesForApi.map((u) => ({ ...u, list_id: 'list-1' }));

      expect(updatedItems).toEqual([
        { id: 'c2', title: 'Card 2', position: 0 },
        { id: 'c3', title: 'Card 3', position: 1 },
        { id: 'c1', title: 'Card 1', position: 2 },
      ]);

      expect(apiUpdates).toEqual([
        { id: 'c1', position: 2, list_id: 'list-1' },
        { id: 'c2', position: 0, list_id: 'list-1' },
        { id: 'c3', position: 1, list_id: 'list-1' },
      ]);
    });

    it('calculates position updates correctly for cross-list card movement', () => {
      const oldListCards = [
        { id: 'c1', title: 'Card 1', position: 0 },
        { id: 'c2', title: 'Card 2', position: 1 },
      ];
      const targetListCards = [{ id: 'c3', title: 'Card 3', position: 0 }];

      // 1. Delete from old list
      const deleteAction: ReorderAction<{ id: string; title: string; position: number }> = {
        type: 'DELETE',
        payload: { id: 'c2' },
      };
      const { updatedItems: oldListUpdated, updatesForApi: oldListUpdates } = calculateNewPositions(
        oldListCards,
        deleteAction
      );
      const oldApiUpdates = oldListUpdates.map((u) => ({ ...u, list_id: 'list-old' }));

      // 2. Create in target list at position 1
      const movingCard = { id: 'c2', title: 'Card 2', position: 1 };
      const createAction: ReorderAction<{ id: string; title: string; position: number }> = {
        type: 'CREATE',
        payload: { id: 'c2', item: movingCard },
      };
      const { updatedItems: targetListUpdated, updatesForApi: targetListUpdates } = calculateNewPositions(
        targetListCards,
        createAction
      );
      const targetApiUpdates = targetListUpdates.map((u) => ({ ...u, list_id: 'list-target' }));

      const movedCardUpdate = { id: 'c2', position: 1, list_id: 'list-target' };
      const allApiUpdates = [movedCardUpdate, ...oldApiUpdates, ...targetApiUpdates];

      expect(oldListUpdated).toEqual([{ id: 'c1', title: 'Card 1', position: 0 }]);

      expect(targetListUpdated).toEqual([
        { id: 'c3', title: 'Card 3', position: 0 },
        { id: 'c2', title: 'Card 2', position: 1 },
      ]);

      expect(allApiUpdates).toContainEqual({ id: 'c2', position: 1, list_id: 'list-target' });
    });
  });
});

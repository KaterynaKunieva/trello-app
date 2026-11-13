import { getSameListCardUpdates, getCrossListCardUpdates, getDeleteCardUpdates } from '../data/cardPosition';
import ICard from '../types/ICard';
import IList from '../../lists/types/IList';
import { Id } from '../../../common/interfaces/common';

const createMockCard = (id: Id, position: number, listId: Id = 1): ICard => ({
  id,
  title: `Card ${id}`,
  position,
  color: '',
  list_id: listId,
  description: '',
  custom: { deadline: '' },
  created_at: new Date(0),
});

const createMockList = (id: Id, cards: ICard[]): IList => ({
  id,
  title: `List ${id}`,
  position: 0,
  cards,
});

describe('cardPosition utils', () => {
  describe('getSameListCardUpdates', () => {
    it('should correctly calculate updates when moving card forward', () => {
      const list = createMockList(10, [
        createMockCard('c1', 0, 10),
        createMockCard('c2', 1, 10),
        createMockCard('c3', 2, 10),
      ]);

      const { updatedCards, apiUpdates } = getSameListCardUpdates(list, 'c1', 0, 2);

      expect(updatedCards.map((c) => ({ id: c.id, position: c.position }))).toEqual([
        { id: 'c2', position: 0 },
        { id: 'c3', position: 1 },
        { id: 'c1', position: 2 },
      ]);

      expect(apiUpdates).toEqual([
        { id: 'c1', position: 2, list_id: 10 },
        { id: 'c2', position: 0, list_id: 10 },
        { id: 'c3', position: 1, list_id: 10 },
      ]);
    });

    it('should correctly calculate updates when moving card backward', () => {
      const list = createMockList(10, [
        createMockCard('c1', 0, 10),
        createMockCard('c2', 1, 10),
        createMockCard('c3', 2, 10),
      ]);

      const { updatedCards, apiUpdates } = getSameListCardUpdates(list, 'c3', 2, 0);

      expect(updatedCards.map((c) => ({ id: c.id, position: c.position }))).toEqual([
        { id: 'c3', position: 0 },
        { id: 'c1', position: 1 },
        { id: 'c2', position: 2 },
      ]);

      expect(apiUpdates).toEqual([
        { id: 'c1', position: 1, list_id: 10 },
        { id: 'c2', position: 2, list_id: 10 },
        { id: 'c3', position: 0, list_id: 10 },
      ]);
    });
  });

  describe('getCrossListCardUpdates', () => {
    it('should remove card from source list and insert into target list with correct positions', () => {
      const oldList = createMockList(1, [
        createMockCard('c1', 0, 1),
        createMockCard('c2', 1, 1),
        createMockCard('c3', 2, 1),
      ]);
      const targetList = createMockList(2, [createMockCard('c4', 0, 2), createMockCard('c5', 1, 2)]);

      const movedCard = oldList.cards[1]; // c2

      const { oldListUpdatedCards, targetListUpdatedCards, allApiUpdates } = getCrossListCardUpdates(
        oldList,
        targetList,
        movedCard,
        1
      );

      // Old list should have c1 and c3 shifted down to 1
      expect(oldListUpdatedCards.map((c) => ({ id: c.id, position: c.position }))).toEqual([
        { id: 'c1', position: 0 },
        { id: 'c3', position: 1 },
      ]);

      // Target list should have c4 (0), c2 (1), c5 (2)
      expect(targetListUpdatedCards.map((c) => ({ id: c.id, position: c.position }))).toEqual([
        { id: 'c4', position: 0 },
        { id: 'c2', position: 1 },
        { id: 'c5', position: 2 },
      ]);

      // All API updates should include moved card update, old list updates, and target list updates
      expect(allApiUpdates).toContainEqual({ id: 'c2', position: 1, list_id: 2 });
      expect(allApiUpdates).toContainEqual({ id: 'c3', position: 1, list_id: 1 });
      expect(allApiUpdates).toContainEqual({ id: 'c5', position: 2, list_id: 2 });
    });
  });

  describe('getDeleteCardUpdates', () => {
    it('should remove deleted card and shift subsequent cards down', () => {
      const list = createMockList(5, [
        createMockCard('c1', 0, 5),
        createMockCard('c2', 1, 5),
        createMockCard('c3', 2, 5),
      ]);

      const { updatedCards, apiUpdates } = getDeleteCardUpdates(list, 'c2');

      expect(updatedCards.map((c) => ({ id: c.id, position: c.position }))).toEqual([
        { id: 'c1', position: 0 },
        { id: 'c3', position: 1 },
      ]);

      expect(apiUpdates).toEqual([{ id: 'c3', position: 1, list_id: 5 }]);
    });
  });
});

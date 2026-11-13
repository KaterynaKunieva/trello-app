import { Id } from '../../../common/interfaces/common';

export type PositionsDto = {
  id: Id;
  position: number;
};

type ReorderFactory<AType extends string, APayload> = {
  type: AType;
  payload: APayload;
};

export type ReorderAction<T> =
  | ReorderFactory<
      'REORDER',
      {
        id: Id;
        oldPosition: number;
        newPosition: number;
      }
    >
  | ReorderFactory<'DELETE', { id: Id }>
  | ReorderFactory<'CREATE', { id: Id; item: T }>;

type ReorderOutput<T> = {
  updatedItems: T[];
  updatesForApi: PositionsDto[];
};

type PositionItem = {
  id: Id;
  position: number;
};

function getReorderDiff<T extends PositionItem>(
  items: T[],
  id: Id,
  oldPosition: number,
  newPosition: number
): PositionsDto[] {
  if (oldPosition === newPosition) return [];

  const isForward = newPosition > oldPosition;

  return items.reduce<PositionsDto[]>((acc, el) => {
    if (el.id === id) {
      acc.push({ id: el.id, position: newPosition });
      return acc;
    }

    if (isForward && el.position > oldPosition && el.position <= newPosition) {
      acc.push({ id: el.id, position: el.position - 1 });
    } else if (!isForward && el.position >= newPosition && el.position < oldPosition) {
      acc.push({ id: el.id, position: el.position + 1 });
    }

    return acc;
  }, []);
}

function getDeleteDiff<T extends PositionItem>(items: T[], id: Id): PositionsDto[] {
  const elPosition = items.find((el) => el.id === id)?.position;
  if (elPosition === undefined) return [];

  return items.reduce<PositionsDto[]>((acc, el) => {
    if (el.id !== id && el.position > elPosition) {
      acc.push({ id: el.id, position: el.position - 1 });
    }
    return acc;
  }, []);
}

function getCreateDiff<T extends PositionItem>(items: T[], position: number): PositionsDto[] {
  return items.reduce<PositionsDto[]>((acc, el) => {
    if (el.position >= position) {
      acc.push({ id: el.id, position: el.position + 1 });
    }
    return acc;
  }, []);
}

function getDiffForApi<T extends PositionItem>(items: T[], action: ReorderAction<T>): PositionsDto[] {
  switch (action.type) {
    case 'REORDER': {
      const { id, oldPosition, newPosition } = action.payload;
      return getReorderDiff(items, id, oldPosition, newPosition);
    }
    case 'DELETE': {
      return getDeleteDiff(items, action.payload.id);
    }
    case 'CREATE': {
      return getCreateDiff(items, action.payload.item.position);
    }
    default: {
      return [];
    }
  }
}

function getBaseItems<T extends { id: Id }>(items: T[], action: ReorderAction<T>): T[] {
  switch (action.type) {
    case 'CREATE':
      return [...items, action.payload.item];
    case 'DELETE':
      return items.filter((item) => item.id !== action.payload.id);
    case 'REORDER':
      return items;
    default:
      return [];
  }
}

function applyPositionUpdates<T extends PositionItem>(items: T[], updatesMap: Map<Id, number>): T[] {
  return items
    .map((item) => {
      const newPos = updatesMap.get(item.id);
      return newPos !== undefined ? { ...item, position: newPos } : item;
    })
    .sort((a, b) => a.position - b.position);
}

export function calculateNewPositions<T extends PositionItem>(items: T[], action: ReorderAction<T>): ReorderOutput<T> {
  const updatesForApi = getDiffForApi(items, action);
  const updatesMap = new Map(updatesForApi.map((u) => [u.id, u.position]));

  const baseItems = getBaseItems(items, action);
  const updatedItems = applyPositionUpdates(baseItems, updatesMap);

  return { updatedItems, updatesForApi };
}

export function normalizePositions<T extends { position: number }>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({
      ...item,
      position: index,
    }));
}

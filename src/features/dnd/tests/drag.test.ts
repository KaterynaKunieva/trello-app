import { DndEvent } from '../DragNDrop';
import { calculateDndState, getMouseOffset } from '../utils/drag';
import { createItemRecord, createRect } from './mock';

describe('calculateDndState (with real console data)', () => {
  const list0 = createItemRecord('1789392791720', 0, createRect(55, 92.27, 300, 416.87)); // "first"
  const list1 = createItemRecord('1789393035975', 1, createRect(375, 92.27, 300, 279.73)); // "good"
  const list2 = createItemRecord('1789392808364', 2, createRect(695, 92.27, 300, 170.73)); // "will be third"
  const list3 = createItemRecord('1790369835169', 3, createRect(1015, 92.27, 300, 170.73)); // "rututbm"

  const draggableLists = [list0, list1, list2, list3];

  const card0 = createItemRecord('1789392855333', 0, createRect(55, 179.6, 300, 130.13), '1789392791720');
  const card1 = createItemRecord('1789392839962', 1, createRect(55, 316.73, 300, 130.13), '1789392791720');
  const card2 = createItemRecord('1790370343355', 0, createRect(375, 179.6, 300, 130.13), '1789393035975');

  const draggableCards = [card0, card1, card2];

  it('returns empty state if card does not intersect any list', () => {
    const draggingItem = card0;
    const coordinates = { x: 2000, y: 2000 };

    const result = calculateDndState({
      coordinates,
      draggingItem,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result).toEqual({
      activeContainerId: null,
      intersectedIds: new Set(),
      targetPlaceholderIndex: null,
    });
  });

  it('returns targetPlaceholderIndex = null if card is in its initial position', () => {
    const draggingItem = card0;
    const coordinates = { x: 55, y: 179.6 };

    const result = calculateDndState({
      coordinates,
      draggingItem,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392791720');
    expect(result.targetPlaceholderIndex).toBeNull();
  });

  it('correctly calculates new index when moving item below second item', () => {
    const draggingItem = card0;
    const coordinates = { x: 55, y: 390 };

    const result = calculateDndState({
      coordinates,
      draggingItem,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392791720');
    expect(result.intersectedIds.has('1789392839962')).toBe(true);
    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('works correctly with horizontal orientation when dragging lists', () => {
    const result = calculateDndState({
      coordinates: { x: 380, y: 92 },
      draggingItem: list0,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.intersectedIds.has('1789393035975')).toBe(true);
    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('returns targetPlaceholderIndex = null when overlapping a neighbor without position change', () => {
    const result = calculateDndState({
      coordinates: { x: 120, y: 92 },
      draggingItem: list0,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBeNull();
  });

  it('calculates target position correctly when list boundaries extend vertically beyond the target list', () => {
    const tallList = createItemRecord('1789392791720', 0, createRect(55, 0, 300, 700));

    const result = calculateDndState({
      coordinates: { x: 380, y: 0 },
      draggingItem: tallList,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.intersectedIds.has('1789393035975')).toBe(true);
    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('calculates targetPlaceholderIndex = 0 when moving list to the very start', () => {
    const result = calculateDndState({
      coordinates: { x: 0, y: 92 },
      draggingItem: list2,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(0);
  });

  it('calculates targetPlaceholderIndex = last index when moving list to the very end', () => {
    const result = calculateDndState({
      coordinates: { x: 1020, y: 92 },
      draggingItem: list0,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(draggableLists.length);
  });

  it('calculates targetPlaceholderIndex = max index when dragging list0 far right into whitespace', () => {
    const result = calculateDndState({
      coordinates: { x: 1200, y: 92 },
      draggingItem: list0,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(draggableLists.length);
  });

  it('calculates targetPlaceholderIndex = containers.length when dragging list0 far right past all containers into whitespace', () => {
    const result = calculateDndState({
      coordinates: { x: 2000, y: 92 },
      draggingItem: list0,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(draggableLists.length);
  });

  it('calculates targetPlaceholderIndex = null when holding center list over its initial position', () => {
    const result = calculateDndState({
      coordinates: { x: 375, y: 92 },
      draggingItem: list1,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBeNull();
  });

  it('calculates targetPlaceholderIndex = 0 when dragging card into an empty list (cards = [])', () => {
    const result = calculateDndState({
      coordinates: { x: 700, y: 100 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392808364');
    expect(result.targetPlaceholderIndex).toBe(0);
  });

  it('calculates targetPlaceholderIndex = 0 when dragging card to the top of a non-empty list', () => {
    const result = calculateDndState({
      coordinates: { x: 380, y: 100 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789393035975');
    expect(result.targetPlaceholderIndex).toBe(0);
  });

  it('calculates index at the end of a list without overlapping other cards', () => {
    const result = calculateDndState({
      coordinates: { x: 55, y: 500 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392791720');
    expect(result.intersectedIds.size).toBe(0);
    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('calculates index at the end of a list while overlapping the last card', () => {
    const result = calculateDndState({
      coordinates: { x: 55, y: 390 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392791720');
    expect(result.intersectedIds.has('1789392839962')).toBe(true);
    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('returns targetPlaceholderIndex = null when card1 (position 1) is dragged at its initial position', () => {
    const result = calculateDndState({
      coordinates: { x: 55, y: 316.73 },
      draggingItem: card1,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789392791720');
    expect(result.targetPlaceholderIndex).toBeNull();
  });

  it('returns targetPlaceholderIndex = null when card2 (position 0 in list 1789393035975) is dragged at its initial position', () => {
    const result = calculateDndState({
      coordinates: { x: 375, y: 179.6 },
      draggingItem: card2,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789393035975');
    expect(result.targetPlaceholderIndex).toBeNull();
  });

  it('correctly calculates target container and placeholder index when moving card across lists', () => {
    const result = calculateDndState({
      coordinates: { x: 375, y: 120 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789393035975');
    expect(result.intersectedIds.has('1790370343355')).toBe(true);
    expect(result.targetPlaceholderIndex).toBe(0);
  });

  it('correctly picks active container using draggedCenter when card overlaps multiple lists', () => {
    const result = calculateDndState({
      coordinates: { x: 230, y: 179.6 },
      draggingItem: card0,
      draggableItems: draggableCards,
      containers: draggableLists,
      orientation: 'vertical',
    });

    expect(result.activeContainerId).toBe('1789393035975');
  });

  it('calculates correct targetPlaceholderIndex when list cursor is in the gap between lists (outside containers)', () => {
    const result = calculateDndState({
      coordinates: { x: 365, y: 92 },
      draggingItem: list2,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(1);
  });

  it('calculates targetPlaceholderIndex correctly when dragging the last list past all containers into whitespace', () => {
    const result = calculateDndState({
      coordinates: { x: 2000, y: 92 },
      draggingItem: list3,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(draggableLists.length);
  });

  it('calculates targetPlaceholderIndex correctly when list overlaps multiple lists and activeContainer picks the first one incorrectly', () => {
    const overlappingList = createItemRecord('1789392808364', 3, createRect(200, 92, 300, 170.73));

    const result = calculateDndState({
      coordinates: { x: 380, y: 92 },
      draggingItem: overlappingList,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(2);
  });

  it('calculates correct targetPlaceholderIndex when dragging list with real user state between lists', () => {
    const draggingList = createItemRecord('1787012323530', 2, createRect(715, 92, 300, 170.203125));
    const result = calculateDndState({
      coordinates: { x: 365, y: 92 },
      draggingItem: draggingList,
      draggableItems: draggableLists,
      containers: draggableLists,
      orientation: 'horizontal',
    });

    expect(result.targetPlaceholderIndex).toBe(1);
  });
});

describe('getMouseOffset', () => {
  it('correctly calculates cursor offset relative to element', () => {
    const mockEvent = {
      clientX: 150,
      clientY: 200,
      currentTarget: {
        getBoundingClientRect: (): DOMRect => ({
          x: 55,
          y: 92.27,
          top: 92.27,
          left: 55,
          width: 300,
          height: 416.87,
          bottom: 509.13,
          right: 355,
          toJSON: (): void => {},
        }),
      },
    } as unknown as DndEvent;

    const offset = getMouseOffset(mockEvent);

    expect(offset.x).toBeCloseTo(95, 4);
    expect(offset.y).toBeCloseTo(107.73, 4);
  });

  it('correctly calculates offset when cursor is to the top-left of the element (negative values)', () => {
    const mockEvent = {
      clientX: 20,
      clientY: 50,
      currentTarget: {
        getBoundingClientRect: (): DOMRect =>
          ({
            x: 55,
            y: 92.27,
            left: 55,
            top: 92.27,
          }) as DOMRect,
      },
    } as unknown as DndEvent;

    const offset = getMouseOffset(mockEvent);

    expect(offset.x).toBeCloseTo(-35, 4);
    expect(offset.y).toBeCloseTo(-42.27, 4);
  });

  it('returns { x: 0, y: 0 } when cursor is exactly at the top-left corner of the element', () => {
    const mockEvent = {
      clientX: 55,
      clientY: 92.27,
      currentTarget: {
        getBoundingClientRect: (): DOMRect =>
          ({
            x: 55,
            y: 92.27,
            left: 55,
            top: 92.27,
          }) as DOMRect,
      },
    } as unknown as DndEvent;

    const offset = getMouseOffset(mockEvent);

    expect(offset.x).toBeCloseTo(0, 5);
    expect(offset.y).toBeCloseTo(0, 5);
  });

  it('correctly calculates offset when client coordinates are zero', () => {
    const mockEvent = {
      clientX: 0,
      clientY: 0,
      currentTarget: {
        getBoundingClientRect: (): DOMRect =>
          ({
            x: 100,
            y: 150,
            left: 100,
            top: 150,
          }) as DOMRect,
      },
    } as unknown as DndEvent;

    const offset = getMouseOffset(mockEvent);

    expect(offset.x).toBe(-100);
    expect(offset.y).toBe(-150);
  });

  it('correctly handles fractional client coordinates', () => {
    const mockEvent = {
      clientX: 120.75,
      clientY: 210.25,
      currentTarget: {
        getBoundingClientRect: (): DOMRect =>
          ({
            x: 50.25,
            y: 100.5,
            left: 50.25,
            top: 100.5,
          }) as DOMRect,
      },
    } as unknown as DndEvent;

    const offset = getMouseOffset(mockEvent);

    expect(offset.x).toBeCloseTo(70.5, 4);
    expect(offset.y).toBeCloseTo(109.75, 4);
  });
});

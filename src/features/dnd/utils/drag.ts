import { Id } from '../../../common/interfaces/common';
import {
  DndEvent,
  Coordinates,
  Rect,
  Orientation,
  CalculateDndStateParams,
  DndStateResult,
  ItemRecord,
} from '../DragNDrop';

export function getMouseOffset(e: DndEvent): Coordinates {
  const objRect = e.currentTarget.getBoundingClientRect();

  return {
    x: e.clientX - objRect.x,
    y: e.clientY - objRect.y,
  };
}

const isIntersected = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

function getDraggedRect(coordinates: Coordinates, dimensions: Pick<Rect, 'width' | 'height'>): Rect {
  return {
    top: coordinates.y,
    left: coordinates.x,
    bottom: coordinates.y + dimensions.height,
    right: coordinates.x + dimensions.width,
    ...dimensions,
  };
}

const findIntersectedItems = <T extends ItemRecord>(
  items: T[],
  rect: Rect,
  excludeId?: Id | null,
  insideContainerId?: Id | null
): T[] =>
  items
    .filter((currentItem) => {
      if (excludeId != null && currentItem.item.id === excludeId) return false;
      if (
        insideContainerId != null &&
        currentItem.containerId != null &&
        (currentItem.containerId ?? null) !== insideContainerId
      )
        return false;
      return isIntersected(rect, currentItem.rect);
    })
    .sort((a, b) => a.item.position - b.item.position);

const getIndexOfDominantItem = (
  intersected: ItemRecord[],
  draggedRect: Rect,
  draggedDimensions: Pick<Rect, 'width' | 'height'>,
  orientation: Orientation
): number => {
  if (intersected.length === 0) {
    return 0;
  }

  const isVertical = orientation === 'vertical';

  const draggedCenter = isVertical
    ? draggedRect.top + draggedDimensions.height / 2
    : draggedRect.left + draggedDimensions.width / 2;

  const target = intersected.reduce((closest, current) => {
    const closestCenter = isVertical
      ? closest.rect.top + closest.rect.height / 2
      : closest.rect.left + closest.rect.width / 2;
    const currentCenter = isVertical
      ? current.rect.top + current.rect.height / 2
      : current.rect.left + current.rect.width / 2;

    return Math.abs(currentCenter - draggedCenter) < Math.abs(closestCenter - draggedCenter) ? current : closest;
  }, intersected[0]);

  const targetCenter = isVertical ? target.rect.top + target.rect.height / 2 : target.rect.left + target.rect.width / 2;

  return draggedCenter < targetCenter ? target.item.position : target.item.position + 1;
};

function getDominantContainer(activeContainers: ItemRecord[], draggedRect: Rect, orientation: Orientation): ItemRecord {
  if (activeContainers.length <= 1) {
    return activeContainers[0];
  }

  const isVertical = orientation === 'vertical';
  const draggedCenter = isVertical
    ? draggedRect.top + draggedRect.height / 2
    : draggedRect.left + draggedRect.width / 2;

  const containing = activeContainers.find((c) => {
    const start = isVertical ? c.rect.top : c.rect.left;
    const end = isVertical ? c.rect.bottom : c.rect.right;
    return draggedCenter >= start && draggedCenter <= end;
  });

  if (containing) return containing;

  return activeContainers.reduce((closest, current) => {
    const closestCenter = isVertical
      ? closest.rect.top + closest.rect.height / 2
      : closest.rect.left + closest.rect.width / 2;
    const currentCenter = isVertical
      ? current.rect.top + current.rect.height / 2
      : current.rect.left + current.rect.width / 2;

    return Math.abs(currentCenter - draggedCenter) < Math.abs(closestCenter - draggedCenter) ? current : closest;
  }, activeContainers[0]);
}

function getOutOfContainersState(
  containers: ItemRecord[],
  draggedRect: Rect,
  draggingItem: ItemRecord,
  orientation: Orientation
): DndStateResult {
  if (orientation === 'horizontal') {
    const maxContainerRight = Math.max(...containers.map((c) => c.rect.right));
    const calculatedIndex = draggedRect.left > maxContainerRight ? containers.length : 0;
    const isInitialPosition = draggingItem.item.position === calculatedIndex;

    return {
      activeContainerId: null,
      intersectedIds: new Set(),
      targetPlaceholderIndex: isInitialPosition ? null : calculatedIndex,
    };
  }

  return {
    activeContainerId: null,
    intersectedIds: new Set(),
    targetPlaceholderIndex: null,
  };
}

function getBoundaryIndex(
  draggableItems: ItemRecord[],
  draggedRect: Rect,
  draggingItem: ItemRecord,
  activeContainerId: Id | null,
  orientation: Orientation
): number {
  const isVertical = orientation === 'vertical';

  if (activeContainerId != null && isVertical) {
    const allItemsInContainer = draggableItems.filter((item) => (item.containerId ?? null) === activeContainerId);
    if (allItemsInContainer.length === 0) {
      return 0;
    }

    const maxBottom = Math.max(...allItemsInContainer.map((i) => i.rect.bottom));
    const minTop = Math.min(...allItemsInContainer.map((i) => i.rect.top));
    const currentCoord = draggedRect.top;

    if (currentCoord > maxBottom) return allItemsInContainer.length;
    if (currentCoord < minTop) return 0;
    return draggingItem.item.position;
  }

  const otherItems = draggableItems.filter((i) => i.item.id !== draggingItem.item.id);
  if (otherItems.length === 0) {
    return 0;
  }

  const maxPosCoord = isVertical
    ? Math.max(...otherItems.map((i) => i.rect.bottom))
    : Math.max(...otherItems.map((i) => i.rect.right));
  const minPosCoord = isVertical
    ? Math.min(...otherItems.map((i) => i.rect.top))
    : Math.min(...otherItems.map((i) => i.rect.left));
  const currentCoord = isVertical ? draggedRect.top : draggedRect.left;

  if (currentCoord > maxPosCoord) return draggableItems.length;
  if (currentCoord < minPosCoord) return 0;
  return draggingItem.item.position;
}

function checkIsInitialPosition(
  calculatedIndex: number,
  draggingItem: ItemRecord,
  activeContainerId: Id | null,
  isCard: boolean
): boolean {
  const isSameContainer = isCard
    ? draggingItem.containerId === activeContainerId
    : (draggingItem.containerId ?? null) === activeContainerId || activeContainerId === draggingItem.item.id;

  if (isCard) {
    return (
      isSameContainer &&
      (calculatedIndex === draggingItem.item.position || calculatedIndex === draggingItem.item.position + 1)
    );
  }

  return calculatedIndex === draggingItem.item.position || calculatedIndex === draggingItem.item.position + 1;
}

export const calculateDndState = ({
  coordinates,
  draggingItem,
  draggableItems,
  containers,
  orientation,
}: CalculateDndStateParams): DndStateResult => {
  const { width, height } = draggingItem.rect;
  const draggedRect = getDraggedRect(coordinates, { width, height });

  const activeContainers = findIntersectedItems(containers, draggedRect);
  const activeContainer =
    activeContainers.length > 0 ? getDominantContainer(activeContainers, draggedRect, 'horizontal') : undefined;

  if (containers.length !== 0 && !activeContainer) {
    return getOutOfContainersState(containers, draggedRect, draggingItem, orientation);
  }

  const isCard = draggingItem.containerId != null;
  const activeContainerId = isCard && activeContainer ? activeContainer.item.id : null;

  const intersectedItems = findIntersectedItems(draggableItems, draggedRect, draggingItem.item.id, activeContainerId);

  const calculatedIndex =
    intersectedItems.length > 0
      ? getIndexOfDominantItem(intersectedItems, draggedRect, { width, height }, orientation)
      : getBoundaryIndex(draggableItems, draggedRect, draggingItem, activeContainerId, orientation);

  const isInitial = checkIsInitialPosition(calculatedIndex, draggingItem, activeContainerId, isCard);
  const intersectedIds = new Set(intersectedItems.map((d) => d.item.id));

  return {
    activeContainerId,
    intersectedIds,
    targetPlaceholderIndex: isInitial ? null : calculatedIndex,
  };
};

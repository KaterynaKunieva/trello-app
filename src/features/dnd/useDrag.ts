import { useRef, useState, useCallback, useMemo } from 'react';
import { Coordinates, DragItem, OnDropCallback, Orientation, UseDragReturn, ItemRecord } from './DragNDrop';
import { calculateDndState } from './utils/drag';
import { Id } from '../../common/interfaces/common';

export function useDrag<T extends DragItem, C extends DragItem = T>(
  onDrop: OnDropCallback<T>,
  orientation: Orientation
): UseDragReturn<T, C> {
  const draggableItems = useRef<Map<Id, ItemRecord>>(new Map()); // Persistent Map
  const containers = useRef<Map<Id, ItemRecord<C>>>(new Map()); // Persistent Map

  const draggingItem = useRef<T | null>(null);
  const activeContainerIdRef = useRef<Id | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false); // useRef mirroring to register items one time (not every isDragging state change)
  isDraggingRef.current = isDragging;

  const isDroppingRef = useRef(false); // dropping lock

  const [draggingOverIds, setDraggingOverIds] = useState<Set<Id>>(new Set());
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [targetContainerId, setTargetContainerId] = useState<Id | null>(null);

  const handleDropItem = useCallback(async (): Promise<void> => {
    if (isDroppingRef.current) return;
    isDroppingRef.current = true;

    const currentItem = draggingItem.current;
    const currentTargetContainerId = activeContainerIdRef.current;
    const targetPlaceholder = placeholderIndex;

    draggingItem.current = null;
    activeContainerIdRef.current = null;
    setIsDragging(false);
    setDraggingOverIds(new Set());
    setPlaceholderIndex(null);
    setTargetContainerId(null);

    if (!currentItem || targetPlaceholder === null) {
      isDroppingRef.current = false;
      return;
    }

    const currentDraggableItem = draggableItems.current.get(currentItem.id);
    if (!currentDraggableItem) {
      isDroppingRef.current = false;
      return;
    }

    const oldPosition = currentDraggableItem.item.position;
    const oldContainerId = currentDraggableItem.containerId;

    const inSameContainer = oldContainerId === currentTargetContainerId;
    let newPosition = targetPlaceholder;

    if (inSameContainer && oldPosition === newPosition) {
      isDroppingRef.current = false;
      return;
    }

    if (inSameContainer && newPosition > oldPosition) {
      newPosition -= 1;
    }

    try {
      await onDrop(currentItem, newPosition, currentTargetContainerId);
    } finally {
      isDroppingRef.current = false;
    }
  }, [placeholderIndex, onDrop]);

  const registerDraggingItem = useCallback(
    (node: HTMLDivElement | null, item: T): void => {
      if (node && item) {
        draggingItem.current = item;
        setIsDragging(true);
      } else {
        handleDropItem();
      }
    },
    [handleDropItem]
  );

  const registerContainer = useCallback((node: HTMLDivElement | null, container: C) => {
    if (isDraggingRef.current) return;
    if (node) {
      const existing = containers.current.get(container.id);
      const rect = node.getBoundingClientRect();
      if (
        !existing ||
        existing.rect.width !== rect.width ||
        existing.rect.height !== rect.height ||
        existing.rect.left !== rect.left ||
        existing.rect.top !== rect.top
      ) {
        containers.current.set(container.id, {
          rect,
          item: container,
        });
      }
    } else {
      containers.current.delete(container.id);
    }
  }, []);

  const onDragItem = useCallback(
    (coordinates: Coordinates): void => {
      if (!draggingItem.current) return;

      const draggingId = draggingItem.current.id;
      const currentDraggableItem = draggableItems.current.get(draggingId);
      if (!currentDraggableItem) return;

      const { activeContainerId, intersectedIds, targetPlaceholderIndex } = calculateDndState({
        coordinates,
        draggingItem: currentDraggableItem,
        draggableItems: Array.from(draggableItems.current.values()),
        containers: Array.from(containers.current.values()),
        orientation,
      });

      activeContainerIdRef.current = activeContainerId;
      setTargetContainerId(activeContainerId);

      setDraggingOverIds((prev) => {
        if (prev.size !== intersectedIds.size) return intersectedIds;
        const isSame = Array.from(intersectedIds).every((id) => prev.has(id));
        return isSame ? prev : intersectedIds;
      });

      setPlaceholderIndex(targetPlaceholderIndex);
    },
    [orientation]
  );

  const registerItem = useCallback((node: HTMLDivElement | null, item: T, containerId?: Id | null) => {
    if (isDraggingRef.current) return;
    if (node) {
      const existing = draggableItems.current.get(item.id);
      const rect = node.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) return;

      if (
        existing?.item.position !== item.position ||
        existing?.containerId !== (containerId ?? null) ||
        existing?.rect.width !== rect.width ||
        existing?.rect.height !== rect.height ||
        existing?.rect.left !== rect.left ||
        existing?.rect.top !== rect.top
      ) {
        draggableItems.current.set(item.id, {
          rect,
          item,
          containerId: containerId ?? null,
        });
      }
    } else {
      draggableItems.current.delete(item.id);
    }
  }, []);

  const draggingItemHeight = useMemo(() => {
    if (!isDragging || !draggingItem.current) return 400;
    return draggableItems.current.get(draggingItem.current.id)?.rect.height || 400;
  }, [isDragging]);

  const draggingItemWidth = useMemo(() => {
    if (!isDragging || !draggingItem.current) return 400;
    return draggableItems.current.get(draggingItem.current.id)?.rect.width || 400;
  }, [isDragging]);

  return useMemo(
    () => ({
      registerItem,
      registerContainer,
      placeholderIndex,
      targetContainerId,
      draggingItemHeight,
      draggingItemWidth,
      registerDraggingItem,
      onDragItem,
      draggingOverIds,
      isDragging,
    }),
    [
      registerItem,
      registerContainer,
      placeholderIndex,
      targetContainerId,
      draggingItemHeight,
      draggingItemWidth,
      registerDraggingItem,
      onDragItem,
      draggingOverIds,
      isDragging,
    ]
  );
}

export default useDrag;

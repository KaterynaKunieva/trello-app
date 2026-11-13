import { DragEvent } from 'react';
import { Id } from '../../common/interfaces/common';

export type DndEvent = DragEvent<HTMLDivElement>;

export type Coordinates = {
  x: number;
  y: number;
};

export type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

export const DRAG_EL_TYPE = {
  LIST: 'list',
  CARD: 'card',
} as const;

export type DragElType = (typeof DRAG_EL_TYPE)[keyof typeof DRAG_EL_TYPE] | null;

export const DRAG_ORIENTATION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

export type Orientation = (typeof DRAG_ORIENTATION)[keyof typeof DRAG_ORIENTATION];

export type DragItem = {
  id: Id;
  position: number;
};

export type ItemRecord<T extends DragItem = DragItem> = {
  rect: Rect;
  item: T;
  containerId?: Id | null;
};

export type OnDropCallback<T> = (item: T, targetPosition: number, targetContainerId: Id | null) => Promise<void> | void;

export interface RegisterItemOptions {
  position: number;
  containerId?: Id;
}

export interface UseDragReturn<T extends DragItem, C extends DragItem = T> {
  registerItem: (node: HTMLDivElement | null, item: T, containerId?: Id | null) => void;
  registerContainer: (node: HTMLDivElement | null, container: C) => void;
  placeholderIndex: number | null;
  targetContainerId: Id | null;
  draggingItemWidth: number;
  draggingItemHeight: number;
  registerDraggingItem: (node: HTMLDivElement | null, item: T) => void;
  onDragItem: (coordinates: Coordinates) => void;
  draggingOverIds: Set<Id>;
  isDragging: boolean;
}

export interface CalculateDndStateParams {
  coordinates: Coordinates;
  draggingItem: ItemRecord;
  draggableItems: ItemRecord[];
  containers: ItemRecord[];
  orientation: Orientation;
}

export interface DndStateResult {
  activeContainerId: Id | null;
  intersectedIds: Set<Id>;
  targetPlaceholderIndex: number | null;
}

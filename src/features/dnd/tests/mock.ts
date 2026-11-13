import { Id } from '../../../common/interfaces/common';
import { ItemRecord, Rect } from '../DragNDrop';

export const createRect = (x: number, y: number, width: number, height: number): Rect => ({
  left: x,
  right: x + width,
  top: y,
  bottom: y + height,
  width,
  height,
});

export const createItemRecord = (
  id: Id,
  position: number,
  rect: Rect,
  containerId: string | null = null
): ItemRecord => ({
  rect,
  item: {
    id,
    position,
  },
  containerId,
});

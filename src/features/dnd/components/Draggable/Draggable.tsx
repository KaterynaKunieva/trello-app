import React, { useState, PropsWithChildren, HTMLProps, useEffect, useRef } from 'react';
import classes from './draggable.module.scss';
import { Coordinates, DndEvent } from '../../DragNDrop';
import { getMouseOffset } from '../../utils/drag';

const emptyImage = new Image();
emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface Props extends PropsWithChildren<HTMLProps<HTMLDivElement>> {
  containerClassname?: string;
  transferPayload: object;
  registerDragging?: (node: HTMLDivElement | null) => void;
  onDragCb?: (coordinates: Coordinates) => void;
}

// todo: add horizontal scroll on dragging
// todo: add dragging over window sides or not allow moving over sides
function Draggable({
  className,
  containerClassname,
  transferPayload,
  registerDragging,
  onDragCb,
  onDragEnd,
  children,
  ...props
}: Readonly<Props>): React.JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const mouseOffset = useRef<Coordinates>({ x: 0, y: 0 });

  const movingEl = useRef<HTMLDivElement>(null);
  const baseEl = useRef<HTMLDivElement>(null);

  const onDragCbRef = useRef(onDragCb);
  onDragCbRef.current = onDragCb;

  const registerDraggingRef = useRef(registerDragging);
  registerDraggingRef.current = registerDragging;

  const updateDragPosition = (x: number, y: number): void => {
    if (movingEl.current) {
      movingEl.current.style.setProperty('--dnd-x', `${x}px`);
      movingEl.current.style.setProperty('--dnd-y', `${y}px`);
    }
    onDragCbRef.current?.({ x, y });
  };

  // adaptivity
  useEffect(() => {
    const synchronizeSize = (): void => {
      if (movingEl.current && baseEl.current) {
        const baseElRect = baseEl.current.getBoundingClientRect();
        movingEl.current.style.width = `${baseElRect.width}px`;
        movingEl.current.style.height = `${baseElRect.height}px`;
      }
    };

    synchronizeSize();
    window.addEventListener('resize', synchronizeSize);

    return () => {
      window.removeEventListener('resize', synchronizeSize);
    };
  }, []);

  // drag
  const onDragStart = (e: DndEvent): void => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    e.dataTransfer.setData('application/json', JSON.stringify(transferPayload));
    e.dataTransfer.effectAllowed = 'move';

    if (movingEl.current && baseEl.current) {
      const baseElRect = baseEl.current.getBoundingClientRect();
      movingEl.current.style.width = `${baseElRect.width}px`;
      movingEl.current.style.height = `${baseElRect.height}px`;
    }

    const offset = getMouseOffset(e);
    mouseOffset.current = offset;
    setIsDragging(true);
    updateDragPosition(e.clientX - offset.x, e.clientY - offset.y);
    registerDraggingRef.current?.(movingEl.current);
  };

  const onDrag = (e: DndEvent): void => {
    if (e.clientX === 0 && e.clientY === 0) return;
    updateDragPosition(e.clientX - mouseOffset.current.x, e.clientY - mouseOffset.current.y);
  };

  const onDragEndHandler = (e: DndEvent): void => {
    e.dataTransfer.dropEffect = 'move';
    mouseOffset.current = { x: 0, y: 0 };
    setIsDragging(false);
    registerDraggingRef.current?.(null);
    onDragEnd?.(e);
  };

  const resetDragOver = (e: DndEvent): void => {
    e.preventDefault();
  };

  return (
    <div
      className={`${containerClassname || ''} ${classes.container} ${isDragging ? classes.dragging : ''}`}
      onDragOver={resetDragOver}
      onDragLeave={resetDragOver}
      onDrop={resetDragOver}
      {...props}
    >
      {/* real dragging el */}
      <div
        className={`${className || ''} ${classes.baseEl}`}
        ref={baseEl}
        draggable="true"
        onDragStart={onDragStart}
        onDragEnd={onDragEndHandler}
        onDrag={onDrag}
      >
        {children}
      </div>
      {/* visually dragging el */}
      <div ref={movingEl} className={`${className || ''} ${classes.movingEl}`}>
        {children}
      </div>
    </div>
  );
}

export default Draggable;

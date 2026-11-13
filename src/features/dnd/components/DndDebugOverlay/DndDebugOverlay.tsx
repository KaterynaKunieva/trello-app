import React from 'react';
import classes from './overlay.module.scss';
import { DragElType } from '../../DragNDrop';
import { Id } from '../../../../common/interfaces/common';

export interface DndConfig {
  type?: DragElType;
  placeholderPosition?: number | null;
  targetContainerId?: Id | null;
  overIds?: Set<Id> | null;
}

function DndDebugOverlay({
  type = null,
  placeholderPosition = null,
  targetContainerId = null,
  overIds = null,
}: Readonly<DndConfig>): React.JSX.Element {
  return (
    <div className={classes.overlay}>
      Type: {type}
      <br />
      Placeholder index: {placeholderPosition}
      <br />
      Over Ids: {overIds ? Array.from(overIds).map((id) => `${id}, `) : null}
      <br />
      Container ID: {targetContainerId}
    </div>
  );
}

export default DndDebugOverlay;

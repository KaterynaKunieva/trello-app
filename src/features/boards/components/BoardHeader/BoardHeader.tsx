import React, { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import Editable from '../../../../common/components/UI/Editable/Editable';
import { DeleteButton } from '../../../../common/components/icons';
import InputBackground from '../../../../common/components/UI/InputBackground/InputBackground';
import { FormElement } from '../../../../common/hooks/useFormData/types';
import classes from './boardHeader.module.scss';

interface Props {
  title: string;
  formTitleValue?: string;
  backgroundValue: string;
  titleError?: string;
  isDisabled: boolean;
  onInputChange: (e: ChangeEvent<FormElement>) => void;
  onSubmit: (e: FocusEvent<FormElement> | KeyboardEvent<FormElement> | string) => Promise<boolean>;
  onDiscardChanges: () => void;
  onDeleteClick: () => void;
}

function BoardHeader({
  title,
  formTitleValue,
  backgroundValue,
  titleError,
  isDisabled,
  onInputChange,
  onSubmit,
  onDiscardChanges,
  onDeleteClick,
}: Readonly<Props>): React.JSX.Element {
  return (
    <div className={classes.header}>
      <Editable
        name="title"
        value={formTitleValue}
        onChange={onInputChange}
        handleSubmit={onSubmit}
        error={titleError || ''}
        discardChanges={onDiscardChanges}
        className={`${classes.title} ${classes.label}`}
        isDisabled={isDisabled}
      >
        <h1 className={classes.title}>{title}</h1>
      </Editable>
      <div className={classes.icons}>
        <DeleteButton disabled={isDisabled} onClick={onDeleteClick} className={classes.deleteBtn} />
        <InputBackground
          submit={onSubmit}
          name="custom.background"
          value={backgroundValue}
          onChange={onInputChange}
          discardChanges={onDiscardChanges}
        />
      </div>
    </div>
  );
}

export default BoardHeader;

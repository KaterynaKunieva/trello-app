import React, { PropsWithChildren, InputHTMLAttributes, FocusEvent, KeyboardEvent, useCallback, useState } from 'react';
import classes from './editable.module.scss';
import Input from '../Input/Input';
import EditButton from '../../ICONS/EditButton/EditButton';
import CloseButton from '../../ICONS/CloseButton/CloseButton';
import Error from '../Error/Error';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error: string;
  isLoading?: boolean;
  discardChanges: () => void;
  handleSubmit?: (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => Promise<boolean>;
}

function Editable({
  name,
  error,
  isLoading = false,
  discardChanges,
  handleSubmit,
  children,
  ...props
}: PropsWithChildren<Props>): React.JSX.Element {
  const [isEditable, setIsEditable] = useState(false);

  const showForm = useCallback((): void => {
    discardChanges();
    setIsEditable(true);
  }, [discardChanges]);

  const closeForm = useCallback((): void => {
    discardChanges();
    setIsEditable(false);
  }, [discardChanges]);

  const submitAndValidate = useCallback(
    async (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>): Promise<void> => {
      if (handleSubmit) {
        const res = await handleSubmit(e);
        if (res) {
          setIsEditable(false);
        }
      }
    },
    [handleSubmit]
  );

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        await submitAndValidate(e);
      }
    },
    [submitAndValidate]
  );

  return (
    <>
      <div className={classes.editable}>
        {isEditable ? (
          <>
            <Input
              onKeyDown={handleKeyDown}
              onBlur={submitAndValidate}
              name={name}
              type="text"
              labelStyles={{
                margin: 0,
              }}
              style={{
                padding: 0,
                border: 'none',
                borderBottom: '1px solid #000',
                background: 'transparent',
              }}
              inputClassname={props.className || ''}
              {...props}
            />
            <CloseButton onMouseDown={closeForm} style={{ margin: '0' }} />
          </>
        ) : (
          <>
            {children}
            <EditButton disabled={isLoading} onClick={showForm} style={{ margin: '0' }} className={classes.edit} />
          </>
        )}
      </div>
      <Error>{error}</Error>
    </>
  );
}

export default Editable;

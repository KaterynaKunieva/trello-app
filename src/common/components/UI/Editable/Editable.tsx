import React, {
  PropsWithChildren,
  TextareaHTMLAttributes,
  FocusEvent,
  KeyboardEvent,
  DragEvent,
  useState,
  MouseEvent,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import classes from './editable.module.scss';
import { CloseButton } from '../../icons';
import TextError from '../TextError/TextError';
import { FormElement } from '../../../hooks/useFormData/types';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error: string;
  isDisabled?: boolean;
  submitOnEnter?: boolean;
  discardChanges: () => void;
  handleSubmit?: (e: FocusEvent<FormElement> | KeyboardEvent<FormElement> | string) => Promise<boolean>;
  onEditableChange?: (isEditable: boolean) => void;
}

function Editable({
  name,
  error,
  isDisabled = false,
  submitOnEnter = true,
  discardChanges,
  handleSubmit,
  onEditableChange,
  className,
  children,
  ...props
}: PropsWithChildren<Props>): React.JSX.Element {
  const [isEditable, setIsEditable] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showForm = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    if (isDisabled) return;
    discardChanges();
    setIsEditable(true);
    onEditableChange?.(true);
  };

  const closeForm = (e: MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    discardChanges();
    setIsEditable(false);
    onEditableChange?.(false);
  };

  const submitAndValidate = async (): Promise<void> => {
    if (!isEditable || isDisabled || !handleSubmit) {
      return;
    }
    const res = await handleSubmit(name);
    if (res) {
      setIsEditable(false);
      onEditableChange?.(false);
      return;
    }
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditable]);

  useLayoutEffect(() => {
    if (isEditable && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight}px`;

      const computedLineHeight = parseFloat(window.getComputedStyle(textareaRef.current).lineHeight);
      if (!Number.isNaN(computedLineHeight) && computedLineHeight > 0) {
        setIsMultiLine(scrollHeight > computedLineHeight * 1.5);
      }
    }
  }, [isEditable, props.value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      discardChanges();
      setIsEditable(false);
      onEditableChange?.(false);
      return;
    }

    if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleContainerClick = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    if (!isEditable && !isDisabled) {
      showForm(e);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLElement>): void => {
    if (isEditable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div onClick={handleContainerClick} className={classes.container}>
      <div
        className={`${classes.editable} ${isEditable ? classes.isEditable : ''}`}
        draggable={isEditable || undefined}
        onDragStart={handleDragStart}
      >
        {isEditable ? (
          <>
            <label htmlFor={name} className={classes.inputLabel}>
              <textarea
                ref={textareaRef}
                id={name}
                name={name}
                rows={1}
                onKeyDown={handleKeyDown}
                onBlur={submitAndValidate}
                className={`${classes.inputField} ${className || ''}`}
                {...props}
              />
            </label>
            <CloseButton
              className={`${classes.close} ${isMultiLine ? classes.topAligned : ''}`}
              onMouseDown={closeForm}
            />
          </>
        ) : (
          <div className={classes.content}>{children}</div>
        )}
      </div>

      <TextError>{error}</TextError>
    </div>
  );
}

export default Editable;

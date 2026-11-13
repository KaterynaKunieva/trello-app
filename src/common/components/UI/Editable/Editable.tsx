import React, {
  PropsWithChildren,
  InputHTMLAttributes,
  FocusEvent,
  KeyboardEvent,
  useState,
  MouseEvent,
  useRef,
  useEffect,
} from 'react';
import classes from './editable.module.scss';
import Input from '../Input/Input';
import { EditButton, CloseButton } from '../../icons';
import TextError from '../TextError/TextError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error: string;
  width?: number;
  isDisabled?: boolean;
  discardChanges: () => void;
  handleSubmit?: (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | string) => Promise<boolean>;
  onEditableChange?: (isEditable: boolean) => void;
}

function Editable({
  name,
  error,
  width = 300,
  isDisabled: isLoading = false,
  discardChanges,
  handleSubmit,
  onEditableChange,
  children,
  ...props
}: PropsWithChildren<Props>): React.JSX.Element {
  const [isEditable, setIsEditable] = useState(false);
  const isEditableRef = useRef(isEditable);
  isEditableRef.current = isEditable;

  const isSubmittingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showForm = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    discardChanges();
    isEditableRef.current = true;
    setIsEditable(true);
    onEditableChange?.(true);
  };

  const closeForm = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    discardChanges();
    isEditableRef.current = false;
    setIsEditable(false);
    onEditableChange?.(false);
  };

  const submitAndValidate = async (): Promise<boolean> => {
    if (!isEditableRef.current || isSubmittingRef.current || !handleSubmit) {
      return false;
    }
    isSubmittingRef.current = true;
    try {
      const res = await handleSubmit(name);
      if (res) {
        isEditableRef.current = false;
        setIsEditable(false);
        onEditableChange?.(false);
        return true;
      }
      return false;
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const submitAndValidateRef = useRef(submitAndValidate);
  submitAndValidateRef.current = submitAndValidate;

  useEffect(() => {
    if (isEditable) {
      const handleDocumentMouseDown = (e: globalThis.MouseEvent): void => {
        const target = e.target as Node | null;
        const isInside = Boolean(containerRef.current && containerRef.current.contains(target));

        if (!isInside) {
          submitAndValidateRef.current();
        }
      };

      document.addEventListener('mousedown', handleDocumentMouseDown, true);
      return () => {
        document.removeEventListener('mousedown', handleDocumentMouseDown, true);
      };
    }
    return undefined;
  }, [isEditable]);

  const handleBlur = (): void => {
    submitAndValidate();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAndValidate();
    }
  };

  const handleContainerClick = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
  };

  const handleContainerMouseDown = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseDown={handleContainerMouseDown}
      className={classes.container}
      style={{ width: `${width}px` }}
    >
      <div className={classes.editable}>
        {isEditable ? (
          <>
            <Input
              autoFocus
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              name={name}
              type="text"
              className={classes.inputLabel}
              inputClassname={`${classes.inputField} ${props.className || ''}`}
              {...props}
            />
            <CloseButton className={classes.close} onMouseDown={closeForm} />
          </>
        ) : (
          <>
            {children}
            <EditButton disabled={isLoading} onClick={showForm} className={classes.edit} />
          </>
        )}
      </div>

      <TextError>{error}</TextError>
    </div>
  );
}

export default Editable;

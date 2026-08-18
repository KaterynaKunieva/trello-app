import React, { useState, useCallback, InputHTMLAttributes } from 'react';
import classes from './inputBackground.module.scss';
import Input from '../Input/Input';
import InputImage from '../InputImage/InputImage';
import Modal from '../Modal/Modal';
import EditButton from '../../ICONS/EditButton/EditButton';
import ArrowButton from '../../ICONS/ArrowButton/ArrowButton';
import Button from '../Button/Button';
import Error from '../Error/Error';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error: string;
  submit: (name: string) => Promise<boolean>;
  discardChanges: () => void;
  value: string;
}

function InputBackground({ name, error, submit, value, discardChanges, ...props }: Props): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputType, setInputType] = useState<'color' | 'file' | null>(null);

  const onSubmit = useCallback(async (): Promise<void> => {
    const res = await submit(name);
    if (res) {
      setInputType(null);
      setIsModalOpen(false);
    }
  }, [submit, name]);

  const close = useCallback((): void => {
    discardChanges();
    setInputType(null);
    setIsModalOpen(false);
  }, [discardChanges]);

  const returnBack = useCallback((): void => {
    discardChanges();
    setInputType(null);
  }, [discardChanges]);

  return (
    <div>
      <div className={classes.showTextOnHover}>
        <p>Background</p>
        <EditButton onClick={(): void => setIsModalOpen(true)} />
      </div>
      <Modal isOpen={isModalOpen} setIsOpenFalse={close} shadow={false} position="right">
        {inputType ? (
          <>
            <ArrowButton style={{ margin: 0 }} onClick={returnBack} />
            {inputType === 'color' ? (
              <Input type={inputType} name={name} value={value} {...props} />
            ) : (
              <InputImage name={name} {...props} />
            )}
            {error && <Error>{error}</Error>}
            <Button onClick={onSubmit}>Update</Button>
          </>
        ) : (
          <div className={classes.backgroundOptions}>
            <Button onClick={(): void => setInputType('color')}>Colors</Button>
            <Button onClick={(): void => setInputType('file')}>Photos</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default InputBackground;

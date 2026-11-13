import React, { useState, InputHTMLAttributes } from 'react';
import classes from './inputBackground.module.scss';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import { EditButton, ArrowButton } from '../../icons';
import Button from '../Button/Button';
import TextError from '../TextError/TextError';
import { IMAGE_MIME_TYPES } from '../../../constants';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  submit: (name: string) => Promise<boolean>;
  discardChanges: () => void;
  value: string;
}

function InputBackground({ name, error, submit, value, discardChanges, ...props }: Props): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputType, setInputType] = useState<'color' | 'file' | null>(null);

  const onSubmit = async (): Promise<void> => {
    const res = await submit(name);
    if (res) {
      setInputType(null);
      setIsModalOpen(false);
    }
  };

  const close = (): void => {
    discardChanges();
    setInputType(null);
    setIsModalOpen(false);
  };

  const returnBack = (): void => {
    discardChanges();
    setInputType(null);
  };

  return (
    <div>
      <div className={classes.showTextOnHover}>
        <p>Background</p>
        <EditButton onClick={(): void => setIsModalOpen(true)} />
      </div>
      <Modal isOpen={isModalOpen} close={close} shadow={false} position="right">
        {inputType ? (
          <>
            <ArrowButton className={classes.backButton} onClick={returnBack} />
            {inputType === 'color' ? (
              <Input type={inputType} name={name} value={value} {...props} />
            ) : (
              <Input type="file" name={name} accept={IMAGE_MIME_TYPES} {...props} />
            )}
            {error && <TextError>{error}</TextError>}
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

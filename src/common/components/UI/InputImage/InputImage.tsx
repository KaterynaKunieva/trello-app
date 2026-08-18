import React, { InputHTMLAttributes } from 'react';
import Input from '../Input/Input';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

function InputImage({ name, ...props }: Props): React.JSX.Element {
  return (
    <Input type="file" name={name} accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml" {...props} />
  );
}

export default InputImage;

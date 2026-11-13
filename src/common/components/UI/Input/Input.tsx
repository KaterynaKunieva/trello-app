import React, { InputHTMLAttributes } from 'react';
import classes from './input.module.scss';
import TextError from '../TextError/TextError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  error?: string;
  name: string;
  inputClassname?: string;
}

function Input({ text = '', className, error, inputClassname, ...props }: Props): React.JSX.Element {
  return (
    <label htmlFor={props.name} className={`${classes.label} ${className || ''}`}>
      {text}
      <input className={inputClassname || classes.input} id={props.name} {...props} />
      <TextError>{error}</TextError>
    </label>
  );
}

export default Input;

import React, { InputHTMLAttributes } from 'react';
import classes from './input.module.scss';
import Error from '../Error/Error';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  error?: string;
  name: string;
  inputClassname?: string;
  labelStyles?: object;
}

function Input({ text = '', className, error, inputClassname, labelStyles, ...props }: Props): React.JSX.Element {
  return (
    <label htmlFor={props.name} className={`${classes.label} ${className || ''}`} style={labelStyles || {}}>
      {text}
      <input className={inputClassname || classes.input} id={props.name} {...props} />
      <Error>{error}</Error>
    </label>
  );
}

export default Input;

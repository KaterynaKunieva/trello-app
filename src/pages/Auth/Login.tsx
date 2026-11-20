import React from 'react';
import { Link } from 'react-router-dom';
import classes from './auth.module.scss';
import { useAppDispatch } from '../../app/hooks';
import useCreateForm from '../../common/hooks/useCreateForm/useCreateForm';
import { DEFAULT_LOGIN_VALUES, VALIDATION_RULES } from '../../features/auth/data/auth.validation';
import { CredentialsDto } from '../../features/auth/types/auth.dto';
import { login } from '../../features/auth/data/auth.slice';
import Input from '../../common/components/UI/Input/Input';
import Button from '../../common/components/UI/Button/Button';

function Login(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { values, errors, isValidForm, isLoading, onInputChange, onBlur, submit } = useCreateForm(
    DEFAULT_LOGIN_VALUES,
    VALIDATION_RULES,
    async (data: CredentialsDto): Promise<void> => {
      await dispatch(login(data));
    }
  );

  return (
    <div className={classes.authPage}>
      <div className={classes.container}>
        <h1 className={classes.title}>Login</h1>
        <form className={classes.form} onSubmit={submit}>
          <Input
            value={values.email}
            error={errors.email}
            text="Email"
            type="email"
            name="email"
            className={classes.input}
            autoComplete="email"
            onChange={onInputChange}
            onBlur={onBlur}
          />
          <Input
            value={values.password}
            error={errors.password}
            text="Password"
            type="password"
            name="password"
            className={classes.input}
            autoComplete="new-password"
            onChange={onInputChange}
            onBlur={onBlur}
          />
          <Button type="submit" disabled={isLoading || !isValidForm} variant="secondary">
            Login
          </Button>
        </form>
        <p className={classes.formText}>
          Do not have an account <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

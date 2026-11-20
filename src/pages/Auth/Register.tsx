import React from 'react';
import { Link } from 'react-router-dom';
import classes from './auth.module.scss';
import Input from '../../common/components/UI/Input/Input';
import Button from '../../common/components/UI/Button/Button';
import useCreateForm from '../../common/hooks/useCreateForm/useCreateForm';
import { DEFAULT_REGISTER_VALUES, RegisterForm, VALIDATION_RULES } from '../../features/auth/data/auth.validation';
import { useAppDispatch } from '../../app/hooks';
import { register } from '../../features/auth/data/auth.slice';

function Register(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { values, errors, isValidForm, isLoading, onInputChange, onBlur, submit } = useCreateForm(
    DEFAULT_REGISTER_VALUES,
    VALIDATION_RULES,
    async (data: RegisterForm): Promise<void> => {
      await dispatch(
        register({
          email: data.email,
          password: data.password,
        })
      );
    }
  );

  return (
    <div className={classes.authPage}>
      <div className={classes.container}>
        <h1 className={classes.title}>Register</h1>
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
          <Input
            value={values.repeat_password}
            error={errors.repeat_password}
            text="Repeat password"
            type="password"
            name="repeat_password"
            className={classes.input}
            onChange={onInputChange}
            onBlur={onBlur}
          />
          <Button type="submit" disabled={isLoading || !isValidForm} variant="secondary">
            Register
          </Button>
        </form>
        <p className={classes.formText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

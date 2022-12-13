import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import React from 'react';
import { SignupSchema } from '../../../Components/validate';
import UserState from '../../../store/mobx/UserState';

const FormSignUp = () => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ username: '', password: '', confirmPassword: '' }}
      validationSchema={SignupSchema}
      onSubmit={(values, actions) => {
        axios.post('http://localhost:3001/users/register', { email: `${values.username}@test.ru`, password: values.password })
          .then((res) => {
            const user: string = res.data.user.email.replace('@test.ru');
            const { accessToken }: {accessToken: string} = res.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('login', user);
            UserState.signIn({ token: accessToken, login: user });
          })
          .catch((err) => {
            if (err.response.status === 409) {
              actions.setErrors({ username: 'cloneLogin' });
            }
          });
      }}
    >
      {({ errors }) => (
        <Form className="form">
          <h1 className="form__title">{t('signUp')}</h1>
          <div className="form__inputBlock">
            <label className="form__label" htmlFor="username">{t('nameUser')}</label>
            <Field type="username" name="username" placeholder="Логин" className={cn('form__control', { 'is-invalid': errors.username })} />
            <ErrorMessage name="username">{() => <div className="invalid-tooltip">{t(`errorlogin.${errors.username}`)}</div>}</ErrorMessage>
          </div>
          <div className="form__inputBlock">
            <label className="form__label" htmlFor="password">{t('password')}</label>
            <Field type="password" name="password" className={cn('form__control', { 'is-invalid': errors.password })} />
            <ErrorMessage name="password">{() => <div className="invalid-tooltip">{t(`errorPassword.${errors.password}`)}</div>}</ErrorMessage>
          </div>
          <div className="form__inputBlock">
            <label className="form__label" htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <Field type="password" name="confirmPassword" className={cn('form__control', { 'is-invalid': errors.confirmPassword })} />
            <ErrorMessage name="confirmPassword">{() => <div className="invalid-tooltip">{t(`errorConfirmPassword.${errors.confirmPassword}`)}</div>}</ErrorMessage>
          </div>
          <button type="submit" className="btn">{t('register')}</button>
        </Form>
      )}
    </Formik>
  );
};

export default FormSignUp;

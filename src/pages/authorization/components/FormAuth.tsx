import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { authSchema } from '../../../Components/validate';
import UserState from '../../../store/mobx/UserState';

const FormAuth = () => {
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={authSchema}
      onSubmit={(values, action) => {
        axios.post('http://localhost:3001/users/signin', { email: `${values.username}@test.ru`, password: values.password })
          .then((res) => {
            const user = res.data.user.email.replace('@test.ru', '');
            const { accessToken } = res.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('login', user);
            UserState.signIn({ login: user, token: accessToken });
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status) {
              action.setErrors({ username: 'UnknownUser' });
            }
          });
      }}
    >
      {({ errors }) => (
        <Form className="form">
          <h1 className="form__title">{t('enter')}</h1>
          <div className="form__inputBlock">
            <label className="form__label" htmlFor="username">{t('youNick')}</label>
            <Field name="username" placeholder="Ваш ник" id="username" className={cn('form__control', { 'is-invalid': errors.username })} />
            <ErrorMessage name="username">{() => <div className="invalid-tooltip">{t(`errorlogin.${errors.username}`)}</div>}</ErrorMessage>
          </div>
          <div className="form__inputBlock">
            <label className="form__label" htmlFor="password">{t('password')}</label>
            <Field type="password" name="password" placeholder="Пароль" id="password" className={cn('form__control', { 'is-invalid': errors.password })} />
            <ErrorMessage name="password">{() => <div className="invalid-tooltip">{t(`errorPassword.${errors.password}`)}</div>}</ErrorMessage>
          </div>
          <button type="submit" className="btn">{t('entering')}</button>
        </Form>
      )}
    </Formik>
  );
};
export default FormAuth;

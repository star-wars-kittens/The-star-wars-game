import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Form, Input, Typography } from 'antd';

import { authApi } from 'api/auth';
import { getCurrentUser } from 'core/store/actions/userActions';
import window from 'helpers/window';
import { LOCAL_STORAGE_IS_AUTH_KEY } from 'constants/localStorage';
import { ROUTES } from 'constants/routes';
import { handleErrorFromServer } from 'helpers/errorNotification';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { LoginInput } from 'models/auth.model';
import { yandexApi } from 'api/index';

import yandexIcon from 'assets/icons/ya.svg';
import './Login.scss';

const messages = defineMessages({
  buttonRegister: { id: 'auth.button.register', defaultMessage: 'Sign up' },
  buttonSignIn: { id: 'auth.button.login', defaultMessage: 'Sign in' },
  formHeading: { id: 'auth.form.heading.login', defaultMessage: 'Sign in' },
  labelLogin: { id: 'auth.form.label.login', defaultMessage: 'Login' },
  labelPassword: { id: 'auth.form.label.password', defaultMessage: 'Password' },
  placeholderLogin: {
    id: 'auth.form.placeholder.login',
    defaultMessage: 'Login',
  },
  placeholderPassword: {
    id: 'auth.form.placeholder.password',
    defaultMessage: 'Password',
  },
  textNoAccount: {
    id: 'auth.question.no-account-question',
    defaultMessage: 'No account?',
  },
  validationLoginMaxLength: {
    id: 'validation.max-length.login',
    defaultMessage: 'Login cannot be longer than 20 characters',
  },
  validationLoginMinLength: {
    id: 'validation.min-length.login',
    defaultMessage: 'Login must be at least 4 characters',
  },
  validationPasswordMaxLength: {
    id: 'validation.max-length.password',
    defaultMessage: 'Password cannot be longer than 40 characters',
  },
  validationPasswordMinLength: {
    id: 'validation.min-length.password',
    defaultMessage: 'Password must be at least 4 characters',
  },
  validationRequiredField: {
    id: 'validation.required-field',
    defaultMessage: 'This field is required',
  },
});

export const Login = () => {
  const { formatMessage: fm } = useIntl();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || ROUTES.MAIN_PAGE_PATH;

  async function onSubmit(values: LoginInput) {
    try {
      const response = await authApi.login(values);

      if (response.status === 200) {
        window.localStorage.setItem(LOCAL_STORAGE_IS_AUTH_KEY, 'true');
        await dispatch(getCurrentUser());

        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      handleErrorFromServer(err);
      localStorage.setItem(LOCAL_STORAGE_IS_AUTH_KEY, 'false');
    }

    form.resetFields();
  }

  const onYandex = () => {
    yandexApi
      .get(
        `oauth/yandex/service-id?redirect_uri=${document.location.origin}/signin`
      )
      .then((res) => {
        const serviceId = res?.data?.service_id;
        if (serviceId) {
          const REDIRECT_URI = document.location.origin;
          const yandexRedirectPath = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${REDIRECT_URI}/`;

          const a = document.createElement('a');
          a.href = yandexRedirectPath;
          a.click();
        }
      });
  };

  useEffect(() => {
    const code = location?.search?.replace('?code=', '');

    if (code) {
      authApi
        .oAuth({ code, redirect_uri: `${document.location.origin}/` })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem(LOCAL_STORAGE_IS_AUTH_KEY, 'true');
            dispatch(getCurrentUser()).then(() => {
              navigate('/');
            });
          } else {
            localStorage.setItem(LOCAL_STORAGE_IS_AUTH_KEY, 'false');
          }
        })
        .catch((e) => {
          if (e?.response?.data?.reason === 'User already in system') {
            localStorage.setItem(LOCAL_STORAGE_IS_AUTH_KEY, 'true');
            dispatch(getCurrentUser()).then(() => {
              navigate('/');
            });
          }
        });
    }
  }, []);

  return (
    <div className="formLogin">
      <Typography.Title className="formLogin__heading">
        {fm(messages.formHeading)}
      </Typography.Title>

      <Form form={form} name="formLogin" onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="login"
          label={fm(messages.labelLogin)}
          rules={[
            { required: true, message: fm(messages.validationRequiredField) },
            { min: 3, message: fm(messages.validationLoginMinLength) },
            { max: 20, message: fm(messages.validationLoginMaxLength) },
          ]}
        >
          <Input placeholder={fm(messages.placeholderLogin)} />
        </Form.Item>

        <Form.Item
          name="password"
          label={fm(messages.labelPassword)}
          rules={[
            { required: true, message: fm(messages.validationRequiredField) },
            { min: 4, message: fm(messages.validationPasswordMinLength) },
            { max: 40, message: fm(messages.validationPasswordMaxLength) },
          ]}
        >
          <Input.Password placeholder={fm(messages.placeholderPassword)} />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              className="formLogin__submitButton"
              disabled={
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
              }
            >
              {fm(messages.buttonSignIn)}
            </Button>
          )}
        </Form.Item>
      </Form>

      <div className="formLogin__yandexIconWrap">
        <img src={yandexIcon} alt="yandexIcon" onClick={onYandex} />
      </div>

      <Typography.Text className="formLogin__linkText">
        {fm(messages.textNoAccount)}{' '}
        <Link to={ROUTES.REGISTER_PAGE_PATH}>
          {fm(messages.buttonRegister)}
        </Link>
      </Typography.Text>
    </div>
  );
};

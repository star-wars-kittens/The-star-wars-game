import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Avatar, Button, Form, Input, Modal, Typography, message } from 'antd';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import { profileApi } from 'api/profile';
import { getCurrentUser, signOut } from 'app/slices/userSlice';
import { ProfileChangeAvatar } from 'components/Profile/ProfileChangeAvatar';
import { Loader } from 'components-ui/Loader';
import { API_URL } from 'constants/main';
import { ROUTES } from 'constants/routes';
import { handleErrorFromServer } from 'helpers/errorNotification';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { ProfileInput } from 'models/profile.model';
import { messages } from './common';

import './ProfileForm.scss';

export const ProfileForm = () => {
  const { formatMessage: fm } = useIntl();

  const dispatch = useAppDispatch();
  const { isFetching: isUserFetching, currentUser } = useAppSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalAvatarOpen, setIsModalAvatarOpen] = useState<boolean>(false);

  const handleChangeProfileInfo = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleProfileAvatarModal = () => {
    setIsModalAvatarOpen((prevState) => !prevState);
  };

  const handleCancelEditing = () => {
    handleChangeProfileInfo();

    form.setFieldsValue(currentUser);
  };

  const handleChangePassword = () => {
    navigate(ROUTES.PROFILE_CHANGE_PASSWORD_PAGE_PATH);
  };

  const handleSignOut = async () => {
    await dispatch(signOut());

    navigate(ROUTES.LOGIN_PAGE, {
      replace: true,
    });
  };

  async function onSubmit(values: ProfileInput) {
    try {
      const response = await profileApi.changeProfileInfo(values);

      if (response.status === 200) {
        dispatch(getCurrentUser());

        messageApi.open({
          type: 'success',
          content: fm(messages.textSuccess),
        });

        handleCancelEditing();
      }
    } catch (err) {
      handleErrorFromServer(err);
    }
  }

  return (
    <>
      <div className="formProfile">
        {contextHolder}
        <Typography.Title className="formProfile__heading">
          {fm(messages.formHeading)}
        </Typography.Title>

        <div className="formProfile__avatarContainer">
          <Avatar
            size={100}
            src={
              currentUser?.avatar
                ? `${API_URL}/resources${currentUser.avatar}`
                : undefined
            }
            icon={<UserOutlined />}
            onClick={handleProfileAvatarModal}
            className="formProfile__avatar"
          />
        </div>
        <Loader loading={isUserFetching} spinning showChildrenWhileFetching>
          <Form
            form={form}
            name="formProfile"
            className="formProfile__form"
            initialValues={currentUser || {}}
            onFinish={onSubmit}
            disabled={!isEditing || isUserFetching}
            autoComplete="off"
            requiredMark={false}
            labelCol={{ span: 4 }}
            labelAlign="left"
            colon={false}
          >
            <Form.Item
              name="firstName"
              label={fm(messages.labelFirstName)}
              rules={[
                {
                  required: true,
                  message: fm(messages.validationRequiredField),
                },
                { min: 1, message: fm(messages.validationFirstNameMinLength) },
                { max: 30, message: fm(messages.validationFirstNameMaxLength) },
              ]}
            >
              <Input placeholder={fm(messages.placeholderFirstName)} />
            </Form.Item>

            <Form.Item
              name="secondName"
              label={fm(messages.labelSecondName)}
              rules={[
                {
                  required: true,
                  message: fm(messages.validationRequiredField),
                },
                { min: 1, message: fm(messages.validationSecondNameMinLength) },
                {
                  max: 30,
                  message: fm(messages.validationSecondNameMaxLength),
                },
              ]}
            >
              <Input placeholder={fm(messages.placeholderSecondName)} />
            </Form.Item>

            <Form.Item name="displayName" label={fm(messages.labelDisplayName)}>
              <Input placeholder={fm(messages.placeholderDisplayName)} />
            </Form.Item>

            <Form.Item
              name="login"
              label={fm(messages.labelLogin)}
              rules={[
                {
                  required: true,
                  message: fm(messages.validationRequiredField),
                },
                { min: 3, message: fm(messages.validationLoginMinLength) },
                { max: 20, message: fm(messages.validationLoginMaxLength) },
              ]}
            >
              <Input placeholder={fm(messages.placeholderLogin)} />
            </Form.Item>

            <Form.Item
              name="email"
              label={fm(messages.labelEmail)}
              rules={[
                {
                  required: true,
                  message: fm(messages.validationRequiredField),
                },
                {
                  pattern: new RegExp(/[a-z0-9\-_]+@[a-z0-9\-_]+\.[a-z0-9]+/gi),
                  message: fm(messages.validationEmailInvalidFormat),
                },
                { min: 5, message: fm(messages.validationEmailMinLength) },
                { max: 30, message: fm(messages.validationEmailMaxLength) },
              ]}
            >
              <Input placeholder={fm(messages.placeholderEmail)} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={fm(messages.labelPhone)}
              rules={[
                {
                  required: true,
                  message: fm(messages.validationRequiredField),
                },
                {
                  pattern: new RegExp(/^[+*\d]{10,15}$/),
                  message: fm(messages.validationPhoneInvalidFormat),
                },
                { min: 10, message: fm(messages.validationPhoneMinLength) },
                { max: 15, message: fm(messages.validationPhoneMaxLength) },
              ]}
            >
              <Input placeholder={fm(messages.placeholderPhone)} />
            </Form.Item>

            {isEditing ? (
              <div className="formProfile__editButtons">
                <Button
                  danger
                  onClick={handleCancelEditing}
                  className="formProfile__editButton"
                >
                  {fm(messages.buttonCancel)}
                </Button>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="formProfile__editButton"
                  >
                    {fm(messages.buttonSave)}
                  </Button>
                </Form.Item>
              </div>
            ) : null}
          </Form>
        </Loader>
        <Button
          onClick={handleChangeProfileInfo}
          type="link"
          className="formProfile__button"
        >
          {fm(messages.buttonChangeProfileInfo)}
        </Button>
        <Button
          onClick={handleChangePassword}
          type="link"
          className="formProfile__button"
        >
          {fm(messages.buttonChangePassword)}
        </Button>
        <Button
          onClick={handleSignOut}
          type="link"
          className="formProfile__button_signOut"
        >
          {fm(messages.buttonSignOut)}
        </Button>

        <Button
          shape="circle"
          icon={<LeftOutlined />}
          className="buttonBackProfile"
          onClick={() => {
            navigate(-1);
          }}
        />
      </div>

      <Modal
        open={isModalAvatarOpen}
        footer={null}
        onCancel={handleProfileAvatarModal}
      >
        <ProfileChangeAvatar onSuccess={handleProfileAvatarModal} />
      </Modal>
    </>
  );
};

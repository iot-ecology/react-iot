import { FormattedMessage } from '@@/exports';
import { ProFormText } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.UserListItem) => void;
  onSubmit: (values: API.UserListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: API.UserListItem;
};

const UserUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.updateModalOpen && props.values) {
      form.resetFields();
      form.setFieldsValue(props.values);
    }
  }, [props.updateModalOpen, props.values, form]);

  return (
    <Modal
      title={<FormattedMessage id="pages.user.update.title" defaultMessage="修改用户" />}
      destroyOnClose
      open={props.updateModalOpen}
      onCancel={() => props.onCancel()}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          await props.onSubmit({ ...props.values, ...values });
          props.onCancel();
        } catch (error) {
          // Form validation failed
          console.error('Validation failed:', error);
        }
      }}
    >
      <Form form={form} layout="vertical" style={{ padding: '24px 0' }}>
        <ProFormText
          disabled
          name="ID"
          label={<FormattedMessage id="pages.id" defaultMessage="唯一码" />}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" defaultMessage="请输入" />,
            },
          ]}
        />
        <ProFormText
          name="username"
          label={<FormattedMessage id="pages.user-list.username" defaultMessage="用户名" />}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" defaultMessage="请输入" />,
            },
          ]}
        />
        <ProFormText
          name="email"
          label={<FormattedMessage id="pages.user-list.mail" defaultMessage="邮箱" />}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" defaultMessage="请输入" />,
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          label={<FormattedMessage id="pages.user-list.password" defaultMessage="密码" />}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" defaultMessage="请输入" />,
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default UserUpdateForm;

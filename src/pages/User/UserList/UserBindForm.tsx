import { Modal, Form, Select, message } from 'antd';
import { useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { 
  deptList, 
  rolePage, 
  bindUserRole, 
  bindUserDept,
  queryUserBindRole,
  queryUserBindDept 
} from '@/services/ant-design-pro/api';

export type UserBindFormProps = {
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  open: boolean;
  type: 'role' | 'dept';
  values: API.UserListItem;
};

const UserBindForm: React.FC<UserBindFormProps> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
  const [deptOptions, setDeptOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoleOptions = async () => {
    try {
      const response = await rolePage({ current: 1, pageSize: 100 });
      const options = (response.data || []).map((item: any) => ({
        label: item.name,
        value: item.ID,
      }));
      setRoleOptions(options);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.user.bind.role.get.failed' }));
    }
  };

  const fetchDeptOptions = async () => {
    try {
      const response = await deptList();
      const options = (response.data || []).map((item: any) => ({
        label: item.name,
        value: item.ID,
      }));
      setDeptOptions(options);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.user.bind.dept.get.failed' }));
    }
  };

  const fetchUserBindings = async () => {
    if (!props.values?.ID) return;
    
    setLoading(true);
    try {
      if (props.type === 'role') {
        const response = await queryUserBindRole(props.values.ID);
        if (response.code === 20000 && response.data) {
          const roleIds = response.data.map((item: API.UserRoleBinding) => item.role_id);
          form.setFieldsValue({
            roleIds: roleIds,
          });
        }
      } else {
        const response = await queryUserBindDept(props.values.ID);
        if (response.code === 20000 && response.data) {
          const deptIds = response.data.map((item: API.UserDeptBinding) => item.dept_id);
          form.setFieldsValue({
            deptIds: deptIds,
          });
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.user.bind.info.get.failed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.open) {
      if (props.type === 'role') {
        fetchRoleOptions();
      } else {
        fetchDeptOptions();
      }
      fetchUserBindings();
    }
  }, [props.open, props.type, props.values?.ID]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (props.type === 'role') {
        const response = await bindUserRole({
          user_id: props.values.ID,
          role_ids: values.roleIds,
        });
        if (response.code === 20000) {
          message.success(intl.formatMessage({ id: 'pages.user.bind.role.success' }));
          props.onSubmit(values);
          props.onCancel();
          form.resetFields();
        } else {
          message.error(response.message || intl.formatMessage({ id: 'pages.user.bind.role.failed' }));
        }
      } else {
        const response = await bindUserDept({
          user_id: props.values.ID,
          dept_ids: values.deptIds,
        });
        if (response.code === 20000) {
          message.success(intl.formatMessage({ id: 'pages.user.bind.dept.success' }));
          props.onSubmit(values);
          props.onCancel();
          form.resetFields();
        } else {
          message.error(response.message || intl.formatMessage({ id: 'pages.user.bind.dept.failed' }));
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.user.bind.submit.failed' }));
    }
  };

  return (
    <Modal
      width={640}
      title={props.type === 'role' ? intl.formatMessage({ id: 'pages.user.bind.role.title' }) : intl.formatMessage({ id: 'pages.user.bind.dept.title' })}
      open={props.open}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="userBindForm"
      >
        {props.type === 'role' ? (
          <Form.Item
            name="roleIds"
            label={intl.formatMessage({ id: 'pages.user.bind.role.label' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.user.bind.role.required' }) }]}
          >
            <Select
              mode="multiple"
              placeholder={intl.formatMessage({ id: 'pages.user.bind.role.placeholder' })}
              options={roleOptions}
              loading={loading}
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="deptIds"
            label={intl.formatMessage({ id: 'pages.user.bind.dept.label' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.user.bind.dept.required' }) }]}
          >
            <Select
              mode="multiple"
              placeholder={intl.formatMessage({ id: 'pages.user.bind.dept.placeholder' })}
              options={deptOptions}
              loading={loading}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserBindForm;

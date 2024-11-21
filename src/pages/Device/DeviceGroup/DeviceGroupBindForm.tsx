import { deviceList, queryDeviceGroupBind } from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.DeviceGroupItem) => void;
  onSubmit: (values: API.DeviceGroupItem) => Promise<void>;
  updateModalOpen: boolean;
  values: API.DeviceGroupItem;
};

const DeviceGroupBindForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.values);
  }, [props.values]); // 添加依赖数组

  useEffect(() => {
    const fetchData = async () => {
      const response = await queryDeviceGroupBind(props.values.ID);
      const deviceIds = response.data.map((item) => item.device_info_id); // 提取 device_info_id
      form.setFieldsValue({ device_id: deviceIds }); // 设置提取的值
    };

    if (props.updateModalOpen) {
      // 只有在模态框打开时才调用
      fetchData();
    }
  }, [props.updateModalOpen, props.values.ID]); // 添加依赖数组

  return (
    <Modal
      key="userupdateform"
      destroyOnClose
      forceRender={true}
      open={props.updateModalOpen}
      onCancel={() => props.onCancel()}
      onOk={async () => {
        let success = await form.validateFields();
        if (success) {
          props.onSubmit(form.getFieldsValue());
        }
      }}
    >
      <Form key={'userupdateform'} form={form} style={{ padding: '32px 40px 48px' }}>
        <ProFormText
          disabled={true}
          key={'ID'}
          label={<FormattedMessage id="pages.id" />}
          name="ID"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormSelect
          request={async () => {
            const a = await deviceList();
            return a.data;
          }}
          fieldProps={{
            mode: 'multiple',
            showSearch: true,
            allowClear: true, // 允许清空选择
            fieldNames: {
              label: 'sn',
              value: 'ID',
            },
            filterOption: (input: string, option: any) => {
              return option?.label?.toString().toLowerCase().indexOf(input.toLowerCase()) !== -1;
            }
          }}
          key={'device_id'}
          label={<FormattedMessage id="pages.device" />}
          name="device_id"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default DeviceGroupBindForm;

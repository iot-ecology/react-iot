import { mqttList } from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type FormProps = {
  onCancel: () => void;
  onSubmit: (values: API.DeviceInfoBindParam) => Promise<void>;
  updateModalOpen: boolean;
  values: API.DeviceInfoItem;
};

const DeviceInfoBindForm: React.FC<FormProps> = (props) => {
    console.log(props, 'props');
    
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.values);
  }, [props.values]);

  const isMQTT = props.values?.protocol === 'MQTT';

  return (
    <Modal
      destroyOnClose
      title={<FormattedMessage id="pages.bind" defaultMessage="绑定" />}
      open={props.updateModalOpen}
      onCancel={() => props.onCancel()}
      onOk={async () => {
        const success = await form.validateFields();
        if (success) {
          props.onSubmit(form.getFieldsValue());
        }
      }}
    >
      <Form form={form} style={{ padding: '32px 40px 48px' }}>
        {isMQTT && (
          <ProFormSelect
            request={async () => {
              const response = await mqttList();
              return response.data || [];
            }}
            fieldProps={{
              showSearch: true,
              allowClear: true,
              fieldNames: {
                label: 'client_id',
                value: 'ID',
              },
            }}
            label={<FormattedMessage id="pages.device-info.mqtt-client-id" />}
            name="handler_id"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.select" />,
              },
            ]}
          />
        )}
        <ProFormText
          label={<FormattedMessage id="pages.device-info.device-code" />}
          name="identification_code"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default DeviceInfoBindForm;

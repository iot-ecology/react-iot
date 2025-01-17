import { productList } from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.DeviceInfoItem) => void;
  onSubmit: (values: API.DeviceInfoItem) => Promise<void>;
  updateModalOpen: boolean;

  values: API.DeviceInfoItem;
};
const DeviceInfoUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [sourceValue, setSourceValue] = React.useState(props.values.source);

  props.values.source = props.values.source?.toString();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.values);
  });

  return (
    <Modal
      key="userupdateform"
      destroyOnClose
      forceRender={true}
      open={props.updateModalOpen}
      onCancel={(vvv) => {
        props.onCancel();
      }}
      onOk={async () => {
        let success = await form.validateFields();
        if (success) {
          props.onSubmit(form.getFieldsValue());
        }
      }}
      onClose={() => {
        props.onCancel();
      }}
    >
      <Form key={'userupdateform'} form={form} style={{ padding: '32px 40px 48px' }}>
        <ProFormText
          disabled={true}
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
            let resp = await productList();
            return resp.data;
          }}
          fieldProps={{
            showSearch: true,
            allowClear: false,
            fieldNames: {
              label: 'name',
              value: 'ID',
            },
          }}
          label={<FormattedMessage id="pages.device-info.product_id" />}
          name="product_id"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
        <ProFormText
          disabled={true}
          label={<FormattedMessage id="pages.device-info.sn" />}
          name="sn"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />

        <ProFormSelect
          valueEnum={{
            1: { text: '自产', status: 'success' },
            2: { text: '采购', status: 'success' },
          }}
          onChange={(value) => {
            console.log('source change', value);
            setSourceValue(value); // 更新 sourceValue 状态
          }}
          label={<FormattedMessage id="pages.device-info.source" />}
          name="source"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />

        {sourceValue === '1' && (
          <ProFormDatePicker
            initialValue={dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}
            transform={(value) => {
              return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ');
            }}
            label={<FormattedMessage id="pages.device-info.manufacturing_date" />}
            name="manufacturing_date"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.select" />,
              },
            ]}
          />
        )}
        {sourceValue === '2' && (
          <ProFormDatePicker
            initialValue={dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}
            transform={(value) => {
              return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ');
            }}
            label={<FormattedMessage id="pages.device-info.procurement_date" />}
            name="procurement_date"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.select" />,
              },
            ]}
          />
        )}
        {sourceValue === '1' && (
          <ProFormDatePicker
            initialValue={dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}
            transform={(value) => {
              return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ');
            }}
            label={<FormattedMessage id="pages.device-info.warranty_expiry" />}
            name="warranty_expiry"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.select" />,
              },
            ]}
          />
        )}
        <ProFormDigit
          label={<FormattedMessage id="pages.device-info.error_rate" />}
          name="error_rate"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormSelect
          disabled={true}
          valueEnum={{
            MQTT: { text: 'MQTT', status: 'success' },
            HTTP: { text: 'HTTP', status: 'success' },
            WebSocket: { text: 'WebSocket', status: 'success' },
            TCP: { text: 'TCP', status: 'success' },
            COAP: { text: 'COAP', status: 'success' },
          }}
          label={<FormattedMessage id="pages.device-info.protocol" />}
          name="protocol"
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

export default DeviceInfoUpdateForm;

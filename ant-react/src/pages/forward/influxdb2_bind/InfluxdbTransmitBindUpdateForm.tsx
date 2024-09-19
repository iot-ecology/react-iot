import { CassandraTransmitList, ClickhouseTransmitList, deviceList, InfluxdbTransmitList, mqttList } from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.InfluxdbTransmitBindListItem) => void;
  onSubmit: (values: API.InfluxdbTransmitBindListItem) => Promise<void>;
  updateModalOpen: boolean;

  values: API.InfluxdbTransmitBindListItem;
};
const InfluxdbTransmitBindUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
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
      onOk={() => {
        props.onSubmit(form.getFieldsValue());
      }}
      onClose={() => {
        props.onCancel();
      }}
    >
      <Form key={'userupdateform'} form={form} style={{ padding: '32px 40px 48px' }}>
        <ProFormText
          key={'id'}
          disabled={true}
          label={<FormattedMessage id="pages.id" />}
          name="ID"
        />

        <ProFormSelect
          valueEnum={{
            MQTT: { text: 'MQTT', status: 'success' },
            HTTP: { text: 'HTTP', status: 'success' },
            WebSocket: { text: 'WebSocket', status: 'success' },
            TCP: { text: 'TCP', status: 'success' },
            COAP: { text: 'COAP', status: 'success' },
          }}
          key={'protocol'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.protocol" />}
          name="protocol"
        />

        <ProFormSelect
          multiple={false}
          dependencies={['protocol']}
          onChange={async (value) => {
            form.setFieldValue('device_uid', value);
          }}
          request={async (params) => {
            console.log(params);
            if (params.protocol === 'MQTT') {
              let res = await mqttList();
              return res.data;
            } else {
              let c = await deviceList();
              let r = [];
              c.data.forEach((e) => {
                if (e.protocol === params.protocol) {
                  r.push({
                    client_id: e.sn,
                    ID: e.ID,
                  });
                }
              });
              return r;
            }
          }}
          fieldProps={{
            onClick: (v) => {
              console.log(v);
            },
            showSearch: true,
            allowClear: false,
            fieldNames: {
              label: 'client_id',
              value: 'ID',
            },
          }}
          key={'device_uid'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.device_uid" />}
          name="device_uid"
        />

        <ProFormText
          key={'identification_code'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.identification_code" />}
          name="identification_code"
        />
        <ProFormSelect
          request={async () => {
            let r = await InfluxdbTransmitList();
            return r.data;
          }}
          fieldProps={{
            showSearch: true,
            allowClear: false,
            fieldNames: {
              label: 'name',
              value: 'ID',
            },
          }}
          key={'influxdb_transmit_id'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.cassandra_transmit_id" />}
          name="influxdb_transmit_id"
        />
        <ProFormText
          key={'org'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.org" />}
          name="org"
        />
        <ProFormText
          key={'bucket'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.bucket" />}
          name="bucket"
        />
        <ProFormText
          key={'measurement'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.measurement" />}
          name="measurement"
        />
        <ProFormText
          key={'script'}
          label={<FormattedMessage id="pages.CassandraTransmitBind.script" />}
          name="script"
        />

        <ProFormRadio.Group
          name="enable"
          label={<FormattedMessage id="pages.CassandraTransmitBind.enable" />}
          options={[
            {
              label: '启用',
              value: true,
            },
            {
              label: '停用',
              value: false,
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default InfluxdbTransmitBindUpdateForm;
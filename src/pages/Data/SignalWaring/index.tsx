import DeviceUidShow from '@/pages/Data/Signal/DeviceUidShow';
import WaringHistoryList from '@/pages/Data/SignalWaring/History';
import SignalWaringUpdateForm from '@/pages/Data/SignalWaring/SignalWaringUpdateForm';
import {
  addSignalWaring,
  deleteSignalWaring,
  deviceList,
  mqttList,
  signalList,
  signalWaringPage,
  updateSignalWaring,
} from '@/services/ant-design-pro/api';
import { FormattedMessage, useLocation } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  PageContainer,
  type ProColumns,
  ProDescriptions,
  type ProDescriptionsItemProps,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { initSearchDeviceUidForMqtt } from '../Signal';

const handleAdd = async (fields: API.SignalWaringItem) => {
  const hide = message.loading('正在添加');
  try {
    var dt = { ...fields };
    dt.device_uid = Number(dt.device_uid);
    dt.in_or_out = Number(dt.in_or_out);
    await addSignalWaring(dt);
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (id: any) => {
  const hide = message.loading('正在删除');
  try {
    await deleteSignalWaring(id);
    hide();
    message.success('删除 successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again!');
    return false;
  }
};

const handlerUpdate = async (fields: API.SignalWaringItem) => {
  const hide = message.loading('正在更新');
  try {
    var dt = { ...fields };
    dt.device_uid = Number(dt.device_uid);
    dt.in_or_out = Number(dt.in_or_out);
    await updateSignalWaring(dt);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新 failed, please try again!');
    return false;
  }
};

export async function initSearchSignalId(
  searchProtocol: string,
  value,
  setOpSignal: (value: any) => void,
  setSearchSignalId: (
    value: ((prevState: number | undefined) => number | undefined) | number | undefined,
  ) => void,
) {
  let res = await signalList({
    protocol: searchProtocol,
    device_uid: Number(value),
    type: '数字',
  });
  setOpSignal(res.data);
  if (res.data.length > 0) {
    setSearchSignalId(res.data[0].ID);
  }
}

const Admin: React.FC = () => {
  const intl = useIntl();
  const location = useLocation();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.SignalWaringItem>();
  const [searchProtocol, setSearchProtocol] = useState<string>('MQTT');
  const [searchDeviceUid, setSearchDeviceUid] = useState<number | string>();
  const [searchSignalId, setSearchSignalId] = useState<number | string>();
  const [opDeviceUid, setOpDeviceUid] = useState<any>();
  const [historyModalOpen, handleHistoryModalOpen] = useState<boolean>(false);

  const [opSignal, setOpSignal] = useState<any>();

  const form = ProForm.useFormInstance();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('protocol')) {
      setSearchProtocol(queryParams.get('protocol'));
    }

    async function extracted() {
      let v = await initSearchDeviceUidForMqtt(setSearchDeviceUid, setOpDeviceUid);

      initSearchSignalId('MQTT', v, setOpSignal, setSearchSignalId);
    }

    async function getMqttList() {
      let res = await mqttList();
      let data = res.data;
      setOpDeviceUid(data);
    }

    async function getOtherList(value) {
      let c = await deviceList();

      let r = [];
      c.data.forEach((e) => {
        if (e.protocol === value) {
          r.push({
            client_id: e.sn,
            ID: e.ID,
          });
        }
      });
      setOpDeviceUid(r);
    }

    if (queryParams.get('client_id')) {
      setSearchDeviceUid(Number(queryParams.get('client_id')));
    } else {
      extracted();
    }
    if (queryParams.get('id')) {
      setSearchSignalId(Number(queryParams.get('id')));
    }
    if (queryParams.get('protocol')) {
      setSearchProtocol(queryParams.get('protocol'));
      if (queryParams.get('protocol') === 'MQTT') {
        getMqttList();
      } else {
        getOtherList(queryParams.get('protocol'));
      }
    }
  }, []);

  const columns: ProColumns<API.SignalWaringItem>[] = [
    {
      key: 'ID',
      title: <FormattedMessage id="pages.id" defaultMessage="唯一码" />,
      hideInSearch: true,
      dataIndex: 'ID', // @ts-ignore
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      key: 'protocol',
      title: <FormattedMessage id="pages.signal.waring.protocol" />,
      hideInSearch: false,
      dataIndex: 'protocol',
      initialValue: 'MQTT',
      order: 3,
      fieldProps: {
        onChange: async (value) => {
          setSearchProtocol(value);
          if (value === 'MQTT') {
            await initSearchDeviceUidForMqtt(setSearchDeviceUid, setOpDeviceUid);
          } else {
            setSearchDeviceUid('');
            setSearchSignalId('');
            // setOpDeviceUid([
            //   {
            //     client_id: 'ccc',
            //     ID: '1',
            //   },
            // ]);
            let c = await deviceList();
            console.log(c, 'c');

            let r = [];
            c.data.forEach((e) => {
              if (e.protocol === value) {
                r.push({
                  client_id: e.sn,
                  ID: e.ID,
                });
              }
            });
            setOpDeviceUid(r);
          }
        },
        value: searchProtocol,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: {
        MQTT: { text: 'MQTT', status: 'success' },
        HTTP: { text: 'HTTP', status: 'success' },
        WebSocket: { text: 'WebSocket', status: 'success' },
        TCP: { text: 'TCP', status: 'success' },
        COAP: { text: 'COAP', status: 'success' },
      },
    },
    {
      key: 'device_uid',
      title: <FormattedMessage id="pages.signal.waring.device_uid" />,
      order: 2,
      hideInSearch: false,
      dataIndex: 'device_uid',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      fieldProps: {
        onChange: async (value) => {
          setSearchDeviceUid(Number(value));
          await initSearchSignalId(searchProtocol, value, setOpSignal, setSearchSignalId);
        },
        value: searchDeviceUid,

        showSearch: true,
        allowClear: false,
        fieldNames: {
          label: 'client_id',
          value: 'ID',
        },
        options: opDeviceUid,
        placeholder: '请选择',
      },
      render: (dom, entity) => {
        return (
          <>
            <DeviceUidShow
              protocol={entity.protocol}
              device_uid={entity.device_uid}
            ></DeviceUidShow>
          </>
        );
      },
    },
    {
      key: 'identification_code',
      title: <FormattedMessage id="pages.signal.waring.identification_code" />,
      hideInSearch: true,
      dataIndex: 'identification_code',
    },
    {
      key: 'signal_id',
      title: <FormattedMessage id="pages.signal.waring.signal_id" />,
      hideInSearch: false,
      dataIndex: 'signal_id',
      valueType: 'select',
      order: 1,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      fieldProps: {
        value: searchSignalId,
        onChange: (value) => {
          setSearchSignalId(Number(value));
        },
        required: true,
        showSearch: true,
        allowClear: false,
        fieldNames: {
          label: 'alias',
          value: 'ID',
        },
        options: opSignal,
      },
    },
    {
      key: 'min',
      title: <FormattedMessage id="pages.signal.waring.min" />,
      hideInSearch: true,
      dataIndex: 'min',
    },
    {
      key: 'max',
      title: <FormattedMessage id="pages.signal.waring.max" />,
      hideInSearch: true,
      dataIndex: 'max',
    },
    {
      key: 'in_or_out',
      title: <FormattedMessage id="pages.signal.waring.in_or_out" />,
      hideInSearch: true,
      dataIndex: 'in_or_out',
      valueType: 'select',
      valueEnum: {
        1: { text: '范围内报警', status: 'success' },
        0: { text: '范围外报警', status: 'success' },
      },
    },

    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="update"
          onClick={() => {
            // todo: 修改
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.update" defaultMessage="修改" />
        </Button>,
        <Button
          key="history"
          onClick={() => {
            setCurrentRow(record);
            handleHistoryModalOpen(true);
          }}
        >
          <FormattedMessage id="pages.signal.waring.history" defaultMessage="报警历史" />
        </Button>,

        <Popconfirm
          key="delete"
          title={<FormattedMessage id="pages.deleteConfirm" defaultMessage="确定要删除吗？" />}
          onConfirm={async () => {
            // todo: 删除接口
            const success = await handleRemove(record.ID);
            if (success) {
              if (actionRef.current) {
                await actionRef.current.reload();
              }
            }
          }}
          okText={<FormattedMessage id="pages.yes" defaultMessage="确定" />}
          cancelText={<FormattedMessage id="pages.no" defaultMessage="取消" />}
        >
          <Button danger>
            <FormattedMessage id="pages.delete" defaultMessage="删除" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.SignalWaringItem, API.PageParams>
        form={{
          formRef: form,
          ignoreRules: true,
        }}
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          if (searchProtocol) {
            params.protocol = searchProtocol;
          }
          if (searchDeviceUid) {
            params.device_uid = Number(searchDeviceUid);
          }
          if (searchSignalId) {
            params.signal_id = Number(searchSignalId);
          }
          return signalWaringPage(params);
        }}
        columns={columns}
      />
      <ModalForm
        key={'add'}
        title={intl.formatMessage({
          id: 'pages.new',
          defaultMessage: '新增',
        })}
        width="75%"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.SignalWaringItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormSelect
          valueEnum={{
            MQTT: { text: 'MQTT', status: 'success' },
            HTTP: { text: 'HTTP', status: 'success' },
            WebSocket: { text: 'WebSocket', status: 'success' },
            TCP: { text: 'TCP', status: 'success' },
            COAP: { text: 'COAP', status: 'success' },
          }}
          key={'protocol'}
          label={<FormattedMessage id="pages.signal.waring.protocol" />}
          name="protocol"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
        <ProFormSelect
          multiple={false}
          dependencies={['protocol']}
          request={async (params) => {
            console.log(params);
            if (params.protocol === 'MQTT') {
              let res = await mqttList();
              return res.data;
            }
          }}
          fieldProps={{
            showSearch: true,
            allowClear: false,
            fieldNames: {
              label: 'client_id',
              value: 'ID',
            },
          }}
          key={'device_uid'}
          label={<FormattedMessage id="pages.signal.waring.device_uid" />}
          name="device_uid"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />

        <ProFormText
          key={'identification_code'}
          label={<FormattedMessage id="pages.signal.waring.identification_code" />}
          name="identification_code"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />

        <ProFormSelect
          multiple={false}
          dependencies={['device_uid', 'protocol']}
          request={async (params) => {
            console.log(params);
            if (params.device_uid && params.protocol) {
              params.ty = '数字';
              let newVar = await signalList(params);
              return newVar.data;
            }
            return [];
          }}
          fieldProps={{
            showSearch: true,
            allowClear: false,
            fieldNames: {
              label: 'alias',
              value: 'ID',
            },
          }}
          key={'signal_id'}
          label={<FormattedMessage id="pages.signal.waring.signal_id" />}
          name="signal_id"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
        <ProFormDigit
          key={'min'}
          label={<FormattedMessage id="pages.signal.waring.min" />}
          name="min"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormDigit
          key={'max'}
          label={<FormattedMessage id="pages.signal.waring.max" />}
          name="max"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormSelect
          key={'in_or_out'}
          label={<FormattedMessage id="pages.signal.waring.in_or_out" />}
          name="in_or_out"
          valueEnum={{
            1: { text: '范围内报警', status: 'success' },
            0: { text: '范围外报警', status: 'success' },
          }}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
      </ModalForm>

      <SignalWaringUpdateForm
        key={'update'}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
            setShowDetail(false);
          }
        }}
        onSubmit={async (value) => {
          console.log(value);
          const success = await handlerUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
      />
      <WaringHistoryList
        updateModalOpen={historyModalOpen}
        onCancel={() => {
          handleHistoryModalOpen(false);
        }}
        values={currentRow || {}}
      />
      <Drawer
        key={'detail'}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.ID && (
          <ProDescriptions<API.SignalWaringItem>
            column={2}
            request={async () => ({
              data: currentRow || {},
            })}
            columns={columns as ProDescriptionsItemProps<API.SignalWaringItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Admin;

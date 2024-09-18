import CassandraTransmitUpdateForm from '@/pages/forward/cassandra/CassandraTransmitUpdateForm';
import {
  addCassandraTransmitPage,
  CassandraTransmitPage,
  deleteCassandraTransmit,
  updateCassandraTransmit,
} from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  PageContainer,
  type ProColumns,
  ProDescriptions,
  type ProDescriptionsItemProps,
  ProFormDigit,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

const handleAdd = async (fields: API.CassandraTransmitListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addCassandraTransmitPage({ ...fields });
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
    await deleteCassandraTransmit(id);
    hide();
    message.success('删除 successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again!');
    return false;
  }
};

const handlerUpdate = async (fields: API.CassandraTransmitListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateCassandraTransmit({ ...fields });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新 failed, please try again!');
    return false;
  }
};
const Admin: React.FC = () => {
  const intl = useIntl();
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
  const [currentRow, setCurrentRow] = useState<API.CassandraTransmitListItem>();

  const columns: ProColumns<API.CassandraTransmitListItem>[] = [
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
      key: 'name',
      title: <FormattedMessage id="pages.CassandraTransmit.name" />,
      hideInSearch: false,
      dataIndex: 'name',
    },

    {
      key: 'host',
      title: <FormattedMessage id="pages.CassandraTransmit.host" />,
      hideInSearch: true,
      dataIndex: 'host',
    },

    {
      key: 'port',
      title: <FormattedMessage id="pages.CassandraTransmit.port" />,
      hideInSearch: true,
      dataIndex: 'port',
    },

    {
      key: 'username',
      title: <FormattedMessage id="pages.CassandraTransmit.username" />,
      hideInSearch: true,
      dataIndex: 'username',
    },

    {
      key: 'password',
      title: <FormattedMessage id="pages.CassandraTransmit.password" />,
      hideInSearch: true,
      dataIndex: 'password',
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
          key="delete"
          onClick={async () => {
            // todo: 删除接口
            const success = await handleRemove(record.ID);
            if (success) {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          danger={true}
        >
          <FormattedMessage id="pages.deleted" defaultMessage="删除" />
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.CassandraTransmitListItem, API.PageParams>
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
        request={CassandraTransmitPage}
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
        onFinish={async (value) => {
          const success = await handleAdd(value as API.CassandraTransmitListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          key={'name'}
          label={<FormattedMessage id="pages.CassandraTransmit.name" />}
          name="name"
        />
        <ProFormText
          key={'host'}
          label={<FormattedMessage id="pages.CassandraTransmit.host" />}
          name="host"
        />
        <ProFormDigit
          key={'port'}
          label={<FormattedMessage id="pages.CassandraTransmit.port" />}
          name="port"
        />
        <ProFormText
          key={'username'}
          label={<FormattedMessage id="pages.CassandraTransmit.username" />}
          name="username"
        />
        <ProFormText
          key={'password'}
          label={<FormattedMessage id="pages.CassandraTransmit.password" />}
          name="password"
        />
      </ModalForm>

      <CassandraTransmitUpdateForm
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
          <ProDescriptions<API.CassandraTransmitListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            columns={columns as ProDescriptionsItemProps<API.CassandraTransmitListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Admin;

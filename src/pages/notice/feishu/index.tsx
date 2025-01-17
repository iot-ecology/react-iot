import FeishuUpdateForm from '@/pages/notice/feishu/FeishuUpdateForm';
import { addFeishu, deleteFeishu, feishuPage, updateFeishu } from '@/services/ant-design-pro/api';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  PageContainer,
  type ProColumns,
  ProDescriptions,
  type ProDescriptionsItemProps,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const handleAdd = async (fields: API.FeiShuListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addFeishu({ ...fields });
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
    await deleteFeishu(id);
    hide();
    message.success('删除 successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again!');
    return false;
  }
};

const handlerUpdate = async (fields: API.FeiShuListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateFeishu({ ...fields });
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
  const [currentRow, setCurrentRow] = useState<API.FeiShuListItem>();

  const columns: ProColumns<API.FeiShuListItem>[] = [
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
      title: <FormattedMessage id="pages.feishu.name" />,
      hideInSearch: false,
      dataIndex: 'name',
    },
    {
      key: 'access_token',
      title: <FormattedMessage id="pages.feishu.access_token" />,
      hideInSearch: false,
      dataIndex: 'access_token',
    },
    {
      key: 'secret',
      title: <FormattedMessage id="pages.feishu.secret" />,
      hideInSearch: true,
      dataIndex: 'secret',
      valueType: 'password',
    },
    {
      key: 'content',
      title: <FormattedMessage id="pages.feishu.content" />,
      hideInSearch: false,
      dataIndex: 'content',
      tooltip:
        '设备名称: {{device_name}}<br>\n' +
        '  信号名称: {{signal_name}}<br>\n' +
        '  小值: {{min}}<br>\n' +
        '  大值: {{max}}<br>\n' +
        '  当前值: {{signal_value}}<br>\n' +
        '  单位: {{unit}}<br>\n' +
        '  范围内，范围外: {{in_or_out}}',
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
      <ProTable<API.FeiShuListItem, API.PageParams>
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
        request={feishuPage}
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
          const success = await handleAdd(value as API.FeiShuListItem);
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
          label={<FormattedMessage id="pages.feishu.name" />}
          name="name"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText
          key={'access_token'}
          label={<FormattedMessage id="pages.feishu.access_token" />}
          name="access_token"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText
          key={'secret'}
          label={<FormattedMessage id="pages.feishu.secret" />}
          name="secret"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText
          key={'content'}
          label={<FormattedMessage id="pages.feishu.content" />}
          name="content"
          tooltip={
            '案例: 设备名称: {{device_name}}<br>\n' +
            '  信号名称: {{signal_name}}<br>\n' +
            '  小值: {{min}}<br>\n' +
            '  大值: {{max}}<br>\n' +
            '  当前值: {{signal_value}}<br>\n' +
            '  单位: {{unit}}<br>\n' +
            '  范围内，范围外: {{in_or_out}}'
          }
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
      </ModalForm>

      <FeishuUpdateForm
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
        {currentRow?.access_number && (
          <ProDescriptions<API.FeiShuListItem>
            column={2}
            title={currentRow?.access_number}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.access_number,
            }}
            columns={columns as ProDescriptionsItemProps<API.FeiShuListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Admin;

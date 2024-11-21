import UserUpdateForm from '@/pages/User/UserList/UserUpdateForm';
import UserBindForm from '@/pages/User/UserList/UserBindForm';
import { addUser, deleteUser, updateUser, userPage } from '@/services/ant-design-pro/api';
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

const handleAdd = async (fields: API.UserListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
    await deleteUser(id);
    hide();
    message.success('删除 successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again!');
    return false;
  }
};

const handlerUpdate = async (fields: API.UserListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateUser({ ...fields });
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
  const [bindModalOpen, setBindModalOpen] = useState<boolean>(false);
  const [bindType, setBindType] = useState<'role' | 'dept'>('role');

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();

  const columns: ProColumns<API.UserListItem>[] = [
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
      key: 'username',
      title: <FormattedMessage id="pages.user-list.username" defaultMessage="用户名" />,
      hideInSearch: false,
      dataIndex: 'username',
    },
    {
      key: 'password',
      title: <FormattedMessage id="pages.user-list.password" defaultMessage="密码" />,
      hideInSearch: true,
      dataIndex: 'password',
      render: (dom, entity) => {
        return <div>****</div>;
      },
    },
    {
      key: 'email',
      title: <FormattedMessage id="pages.user-list.mail" defaultMessage="邮箱" />,
      hideInSearch: true,
      dataIndex: 'email',
    },

    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="update"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.update" defaultMessage="修改" />
        </Button>,
        <Button
          key="bindRole"
          onClick={() => {
            handleBindModalOpen(true);
            setBindType('role');
            setCurrentRow(record);
          }}
        >
          {intl.formatMessage({ id: 'pages.user.bind.role' })}
        </Button>,
        <Button
          key="bindDept"
          onClick={() => {
            handleBindModalOpen(true);
            setBindType('dept');
            setCurrentRow(record);
          }}
        >
          {intl.formatMessage({ id: 'pages.user.bind.dept' })}
        </Button>,
        <Popconfirm
          key="delete"
          title={<FormattedMessage id="pages.deleteConfirm" defaultMessage="确定要删除此项吗？" />}
          onConfirm={async () => {
            const success = await handleRemove(record.ID);
            if (success) {
              actionRef.current?.reload();
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

  const handleBindModalOpen = (open: boolean) => {
    setBindModalOpen(open);
  };

  const handleBindModalSubmit = async () => {
    setBindModalOpen(false);
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams>
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
        request={userPage}
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
          const success = await handleAdd(value as API.UserListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          key={'username'}
          label={<FormattedMessage id="pages.user-list.username" />}
          name="username"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText
          key={'email'}
          label={<FormattedMessage id="pages.user-list.mail" />}
          name="email"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText.Password
          key={'password'}
          label={<FormattedMessage id="pages.user-list.password" />}
          name="password"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
      </ModalForm>

      <UserUpdateForm
        onSubmit={async (value) => {
          const success = await handlerUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        open={updateModalOpen}
        values={currentRow || {}}
      />

      <UserBindForm
        onSubmit={async (value) => {
          // 这里需要调用后端API进行角色或部门的绑定
          const success = true; // 替换为实际的API调用
          if (success) {
            handleBindModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleBindModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        open={bindModalOpen}
        type={bindType}
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
        {currentRow?.username && (
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Admin;

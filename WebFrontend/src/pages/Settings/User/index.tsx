import { paginationUser, deleteUser } from '@/API/SystemAPI'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProFormSelect, PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Popconfirm, Space } from 'antd'
import { Button, message } from 'antd'
import React, { useRef, useState } from 'react'
import NiceModal from '@ebay/nice-modal-react'
import CreateAndUpdateModal from './CreateAndUpdateModal'
import { ErrorText } from '@/components/Text/ErrorText'
import { LinkText } from '@/components/Text/LinkText'
import { SetPasswordForAdminModal } from './SetPasswordForAdminModal'
import { useModel } from 'umi'
import { OtherSettingsModal } from './OtherSettingsModal'

const TableList: React.FC = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const create = async () => {
    const result = await NiceModal.show<boolean, any, any>(CreateAndUpdateModal)
    if (!result) return
    actionRef.current?.reload()
  }

  const edit = (row: any) => async () => {
    const result = await NiceModal.show<boolean, any, any>(CreateAndUpdateModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const otherSettings = (row: any) => async () => {
    const result = await NiceModal.show<boolean, any, any>(OtherSettingsModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const remove = (row: UserRow) => async () => {
    if (!row?.id) {
      console.log('row.id不能为空')
      return false
    }
    try {
      const result = await deleteUser(row.id)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return false
      }
      message.success('删除用户成功')
      actionRef.current?.reload()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const reset = (row: UserRow) => async () => {
    if (!row?.id) {
      console.log('row.id不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, UserRow>(SetPasswordForAdminModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const columns: ProColumns<UserRow>[] = [
    {
      title: '用户编号',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'userNickname',
    },
    {
      title: '所属租户',
      dataIndex: 'deptName',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (_, row) => row?.roles?.map(item => item.roleName)?.join()
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      renderText: (value) => (value === 0 ? '男' : '女'),
      width: 50,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 210,
      render: (_, row) => (
        <Space>
          {row.id !== 1 && (
            <LinkText onClick={edit(row)}>
              编辑
            </LinkText>
          )}
          {currentUser?.roles?.some(item => item.roleId == 1 || item.roleId == 3) && (
            <LinkText onClick={otherSettings(row)}>
              其他设置
            </LinkText>
          )}
          {currentUser?.roles?.some(item => item.roleId == 1) && (
            <LinkText onClick={reset(row)}>
              重设密码
            </LinkText>
          )}
          {row.id !== 1 && (
            <Popconfirm title="确定删除吗?" onConfirm={remove(row)}>
              <ErrorText pointer>删除</ErrorText>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer header={{ subTitle: '管理系统中的用户账号' }}>
      <QueryFilter
        defaultCollapsed
        split
        className="query-filter"
        onFinish={async (values) => setParams(values)}
      >
        <ProFormSelect
          name="searchKey"
          label="搜索"
          valueEnum={{
            user_id: '用户编号',
            username: '账号',
            nick_name: '用户昵称',
            mobile: '手机号',
          }}
        />
        <ProFormText name="searchValue" />
      </QueryFilter>

      <ProTable<UserRow>
        rowKey="id"
        actionRef={actionRef}
        request={paginationUser}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [
          <>
            <Button type="primary" onClick={create}>新增</Button>
          </>
        ]}
      />
    </PageContainer>
  )
}

export default TableList

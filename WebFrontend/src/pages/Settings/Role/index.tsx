import { removeRole, paginationRole } from '@/API/SystemAPI'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Form, Popconfirm, Space } from 'antd'
import { message } from 'antd'
import React, { useRef, useState } from 'react'
import AssignAuth from './AssignAuthModal'
import { ErrorText } from '@/components/Text/ErrorText'
import { useModel } from 'umi'
import { LinkText } from '@/components/Text/LinkText'
import NiceModal from '@ebay/nice-modal-react'
import { CreateAndUpdateModal } from './CreateAndUpdateModal'

type AssignAuthProps = {
  roleId?: number
  tenantId?: number
  assignModalVisible: boolean
}

const TableList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const [form] = Form.useForm()
  const actionRef = useRef<ActionType>()
  const [assignAuth, setAssignAuth] = useState<AssignAuthProps>({ assignModalVisible: false })
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const create = async () => {
    const result = await NiceModal.show<boolean, any, any>(CreateAndUpdateModal)
    if (!result) return
    actionRef.current?.reload()
  }

  const edit = (row: Role) => async () => {
    const result = await NiceModal.show<boolean, any, Role>(CreateAndUpdateModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const remove = (row: Role) => async () => {
    if (!row.roleId) {
      console.error('row.id不能为空')
      return
    }
    try {
      const result = await removeRole(row.roleId)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return false
      }
      message.success('删除角色成功')
      actionRef.current?.reload()
      return true
    } catch (error) {
      message.error('删除角色失败')
      return false
    }
  }

  const assignPermissions = (row: Role) => () => {
    if (!currentUser?.deptId) {
      console.error('租户id不能为空')
      return
    }
    setAssignAuth({
      roleId: row.roleId,
      assignModalVisible: true,
      tenantId: currentUser.deptId
    })
  }

  const columns: ProColumns<Role>[] = [
    {
      title: '角色ID',
      dataIndex: 'roleId',
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, entity) => (
        <Space>
          <LinkText onClick={edit(entity)}>
            编辑
          </LinkText>
          <LinkText onClick={assignPermissions(entity)}>
            权限分配
          </LinkText>
          {![1, 3, 6].includes(entity.roleId ?? 0) && (
            <Popconfirm title="确定删除吗?" onConfirm={remove(entity)}>
              <ErrorText pointer>删除</ErrorText>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <PageContainer header={{ subTitle: '管理系统中的角色' }}>
      <QueryFilter
        form={form}
        className="query-filter"
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.tenantId) setParams(allValues)
        }}
        onFinish={async (values) => setParams(values)}
        onReset={() => {
          form.setFieldsValue({ tenantId: params.tenantId })
          setParams({ tenantId: params.tenantId })
        }}
      >
        <ProFormText name="roleName" label="角色名称" />
      </QueryFilter>
      <ProTable<Role>
        rowKey="id"
        headerTitle="角色管理"
        actionRef={actionRef}
        request={paginationRole}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        // toolBarRender={() => [<Button type="primary" onClick={create}>新增</Button>]}
      />
      <AssignAuth
        {...assignAuth}
        onCancel={() => setAssignAuth({ assignModalVisible: false })}
      />
    </PageContainer>
  )
}

export default TableList

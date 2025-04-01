import { paginationApp, removeApp } from '@/API/SystemAPI'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { message, Popconfirm, Button, Space } from 'antd'
import React, { useRef, useState } from 'react'
import NiceModal from '@ebay/nice-modal-react'
import { MaxDeviceModal } from './DeviceMaxModal'
import { ErrorText } from '@/components/Text/ErrorText'
import { LinkText } from '@/components/Text/LinkText'
import CreateAndUpdateModal from './CreateAndUpdateModal'

const TableList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>()
  const actionRef = useRef<ActionType>()

  const setMaxDevice = (row: App) => async () => {
    NiceModal.show<boolean, any, App>(MaxDeviceModal, row)
  }

  const create = async () => {
    const result = await NiceModal.show<boolean, any, any>(CreateAndUpdateModal)
    if (!result) return
    actionRef.current?.reload()
  }

  const edit = (row: App) => async () => {
    const result = await NiceModal.show<boolean, any, App>(CreateAndUpdateModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const remove = (row: App) => async () => {
    if (!row.deptId) {
      console.error('deptId不能为空')
      return
    }
    try {
      const result = await removeApp(row.deptId)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('删除成功')
      actionRef.current?.reload()
    } catch(error) {
      console.error(error)
    }
  }

  const columns: ProColumns<App>[] = [
    {
      title: '租户名称',
      dataIndex: 'deptName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, entity) => {
        return (
          <Space>
            <LinkText onClick={setMaxDevice(entity)}>
              可用设备
            </LinkText>
            <LinkText onClick={edit(entity)}>
              编辑
            </LinkText>
            <Popconfirm title="确定删除吗?" onConfirm={remove(entity)}>
              <ErrorText pointer>删除</ErrorText>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <PageContainer>
      <QueryFilter className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText name="deptName" label="租户名称" />
      </QueryFilter>

      <ProTable<App>
        rowKey="deptId"
        actionRef={actionRef}
        request={paginationApp}
        columns={columns}
        search={false}
        params={params}
        scroll={{ x: 1300 }}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [<Button type="primary" onClick={create}>新增</Button>]}
      />
    </PageContainer>
  )
}

export default TableList

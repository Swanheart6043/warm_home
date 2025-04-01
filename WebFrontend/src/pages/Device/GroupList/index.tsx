import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import React, { useRef, useState } from 'react'
import CreateAndUpdateModal from './CreateAndUpdateModal'
import NiceModal from '@ebay/nice-modal-react'
import { LinkText } from '@/components/Text/LinkText'
import { ErrorText } from '@/components/Text/ErrorText'
import { paginationDeviceGroup, removeDeviceGroup } from '@/API/DeviceGroupAPI'

const DeviceGroup: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const create = async () => {
    const result: boolean = await NiceModal.show(CreateAndUpdateModal)
    if (!result) return
    actionRef.current?.reload()
  }

  const edit = (row: DeviceGroup) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, DeviceGroup>(CreateAndUpdateModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const remove = (row: DeviceGroup) => async () => {
    if (!row.id) {
      console.error('id不能为空')
      return
    }
    try {
      const result = await removeDeviceGroup(row.id)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('删除成功')
      actionRef.current?.reload()
      return
    } catch(error) {
      console.error(error)
      return
    }
  }

  const columns: ProColumns<DeviceGroup>[] = [
    {
      title: '组名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true,
    },
    {
      title: '所属',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '操作',
      width: 80,
      render: (_, row) => (
        <Space>
          <LinkText onClick={edit(row)}>
            编辑
          </LinkText>
          <Popconfirm title="确定删除吗?" onConfirm={remove(row)}>
            <ErrorText pointer>删除</ErrorText>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText name="name" label="组名" />
      </QueryFilter>

      <ProTable<DeviceGroup>
        rowKey="id"
        actionRef={actionRef}
        request={paginationDeviceGroup}
        columns={columns}
        search={false}
        params={params}
        pagination={{showSizeChanger: true, showQuickJumper: true}}
        toolBarRender={() => [<Button type="primary" onClick={create}>新增</Button>]}
      />
    </PageContainer>
  )
}

export default DeviceGroup

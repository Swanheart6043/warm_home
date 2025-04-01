import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button } from 'antd'
import React, { useRef, useState } from 'react'
import CreateModal from './CreateModal'
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react'
import { paginationResourceGroup } from '@/API/ResourceAPI'

const ResourceGroup: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const create = async () => {
    const result = await NiceModal.show<boolean, NiceModalHocProps, any>(CreateModal)
    if (!result) return
    actionRef.current?.reload()
  }

  const columns: ProColumns<ResourceGroup>[] = [
    {
      title: '分组名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtModified',
      ellipsis: true,
      width: 150,
    },
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText name="name" label="分组名" placeholder="请输入组名" />
      </QueryFilter>

      <ProTable<ResourceGroup>
        rowKey="id"
        actionRef={actionRef}
        request={paginationResourceGroup}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [
          <Button type="primary" onClick={create}>新增</Button>
        ]}
      />
    </PageContainer>
  )
}

export default ResourceGroup

import { buildPlatformOptions } from '@/enum/PlatformEnum'
import { ActionType, PageContainer, ProColumns, ProFormSelect, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import { paginationAccount } from '@/API/DashboardAPI'
import { LinkText } from '@/components/Text/LinkText'
import EditModal from './EditModal'
import NiceModal from '@ebay/nice-modal-react'
import { useAccess } from 'umi'

const Operations: React.FC = () => {
  const access = useAccess();
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const remark = (row: AccountItem) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, AccountItem>(EditModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const columns: ProColumns<AccountItem>[] = [
    {
      title: '设备号',
      dataIndex: 'device_id',
      ellipsis: true,
      width: 150,
    },
    {
      title: '分组名',
      dataIndex: 'account_type',
      ellipsis: true,
    },
    {
      title: '操作员',
      dataIndex: 'user_id',
      ellipsis: true,
    },
    {
      title: '账号ID',
      dataIndex: 'account_id',
      ellipsis: true,
    },
    {
      title: '账号昵称',
      dataIndex: 'account_nickname',
      ellipsis: true,
    },
    {
      title: '粉丝数',
      dataIndex: 'follower_count',
      ellipsis: true,
    },
    {
      title: '关注数',
      dataIndex: 'following_count',
      ellipsis: true,
    },
    {
      title: '获赞数',
      dataIndex: 'likes_count',
      ellipsis: true,
    },
    {
      title: '属地归属',
      dataIndex: 'country',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 60,
      hideInTable: !access.canAdmin?.permissions.includes('remark'),
      render: (_, entity) => <LinkText onClick={remark(entity)}>备注</LinkText>
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormSelect name="platform" label="平台" options={buildPlatformOptions()} />
        <ProFormText name="device_id" label="设备号" />
        <ProFormText name="account_id" label="账号ID" />
        <ProFormText name="account_nickname" label="账号昵称" />
      </QueryFilter>

      <ProTable<AccountItem>
        rowKey="id"
        actionRef={actionRef}
        request={paginationAccount}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
      />
    </PageContainer>
  )
}

export default Operations

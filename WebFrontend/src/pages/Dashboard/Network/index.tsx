import { ActionType, PageContainer, ProColumns, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import { Button, message, Tag } from 'antd'
import { exportNetworkDashboard, paginationNetwork } from '@/API/DashboardAPI'
import moment from 'moment'

const Network: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const handleExport = async () => {
    const result = await exportNetworkDashboard()
    if (!result) return
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = `网络数据-${moment().format('YYYY-MM-DD HH:mm:ss')}.xls`
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('导出成功')
  }

  const columns: ProColumns<NetworkItem>[] = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      ellipsis: true,
      width: 150,
    },
    {
      title: '账号',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '域名',
      dataIndex: 'hostname',
      ellipsis: true,
    },
    {
      title: '端口',
      dataIndex: 'port',
      ellipsis: true,
      width: 60,
    },
    {
      title: '国家',
      dataIndex: 'country',
      ellipsis: true,
      width: 80,
    },
    {
      title: '城市',
      dataIndex: 'city',
      ellipsis: true,
    },
    {
      title: '出口IP',
      dataIndex: 'ip',
      ellipsis: true,
      width: 120,
    },
    {
      title: '到期时间',
      dataIndex: 'endtime',
      ellipsis: true,
      width: 150,
    },
    {
      title: '协议',
      dataIndex: 'agree',
      ellipsis: true,
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      width: 80,
      render: (_, entity) => entity.status == '0' ? <Tag color="default">未代理</Tag> : <Tag color="processing">已代理</Tag>
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText name="equipId" label="设备ID" />
      </QueryFilter>

      <ProTable<NetworkItem>
        rowKey="id"
        actionRef={actionRef}
        request={paginationNetwork}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [
          <Button type='primary' onClick={handleExport}>
            导出
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default Network

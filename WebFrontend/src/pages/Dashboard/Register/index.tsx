import { buildPlatformOptions } from '@/enum/PlatformEnum'
import { paginationRegister } from '@/API/DashboardAPI'
import { PageContainer, ProColumns, ProFormSelect, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message } from 'antd'
import React, { useState } from 'react'
import moment from 'moment'
import { exportInfo } from '@/API/ScriptAPI'

const Register: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})

  const exportExcel = async () => {
    const result = await exportInfo()
    if (result) {
      const blob = new Blob([result])
      const objectURL = URL.createObjectURL(blob)
      let btn = document.createElement('a')
      btn.download = `社媒账号入库成功数据-${moment().format('YYYY-MM-DD HH时mm分ss秒')}.xls`
      btn.href = objectURL
      btn.click()
      URL.revokeObjectURL(objectURL)
      message.success('导出成功')
    }
  }

  const columns: ProColumns<RegisterItem>[] = [
    {
      title: '设备号',
      dataIndex: 'device_id',
      ellipsis: true,
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
      title: '归属地',
      dataIndex: 'country',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      ellipsis: true,
      width: 150,
      render: (_, entity) => entity.create_time && moment(entity.create_time).format('YYYY-MM-DD HH:mm:ss')
    },
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormSelect name="platform" label="平台" options={buildPlatformOptions()} />
        <ProFormText name="account_id" label="账号ID" />
      </QueryFilter>

      <ProTable<RegisterItem>
        rowKey="id"
        request={paginationRegister}
        options={false}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [
          <Button type="primary" onClick={exportExcel}>
            导出
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default Register

import { buildPlatformOptions } from '@/enum/PlatformEnum'
import { paginationVideo } from '@/API/DashboardAPI'
import { ActionType, PageContainer, ProColumns, ProFormSelect, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import moment from 'moment'

const Register: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const columns: ProColumns<VideoItem>[] = [
    {
      title: '设备号',
      dataIndex: 'deviceId',
      ellipsis: true,
      width: 150,
    },
    {
      title: '分组名',
      dataIndex: 'accountType',
      ellipsis: true,
    },
    {
      title: '操作员',
      dataIndex: 'userId',
      ellipsis: true,
    },
    {
      title: '账号',
      dataIndex: 'accountId',
      ellipsis: true,
    },
    {
      title: '播放数',
      dataIndex: 'playCount',
      ellipsis: true,
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      ellipsis: true,
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      ellipsis: true,
    },
    {
      title: '收藏数',
      dataIndex: 'favoriteCount',
      ellipsis: true,
    },
    {
      title: '视频链接',
      dataIndex: 'videoUrl',
      ellipsis: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      ellipsis: true,
      width: 150,
      render: (_, entity) => entity.createTime && moment(entity.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 150,
      render: (_, entity) => entity.updateTime && moment(entity.updateTime).format('YYYY-MM-DD HH:mm:ss')
    },
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormSelect name="platform" label="平台" options={buildPlatformOptions()} />
        <ProFormText name="accountId" label="账号ID" />
      </QueryFilter>

      <ProTable<VideoItem>
        rowKey="id"
        actionRef={actionRef}
        request={paginationVideo}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
      />
    </PageContainer>
  )
}

export default Register

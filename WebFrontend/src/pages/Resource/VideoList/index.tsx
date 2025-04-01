import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormSelect, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import React, { useRef, useState } from 'react'
import EditModal from './EditModal'
import CreateModal from './CreateModal'
import NiceModal from '@ebay/nice-modal-react'
import { deleteVideo, fetchAllVideoGroup, paginationVideo } from '@/API/ResourceVideoAPI'
import { LinkText } from '@/components/Text/LinkText'
import { ErrorText } from '@/components/Text/ErrorText'

const VideoList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const actionRef = useRef<ActionType>()

  const create = async () => {
    const result = await NiceModal.show(CreateModal, undefined)
    if (!result) return
    actionRef.current?.reload()
  }

  const edit = (row: Video) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, Video>(EditModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const remove = (row: Video) => async () => {
    if (!row.id) {
      console.error('row.id不能为空')
      return
    }
    try {
      const result = await deleteVideo(row.id)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('删除成功')
      actionRef.current?.reload()
    } catch(error) {
      message.error(error)
    }
  }

  const columns: ProColumns<Video>[] = [
    {
      title: '分组',
      dataIndex: 'categoryName',
      ellipsis: true,
    },
    {
      title: 'Url',
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 80,
      render: (_, entity) => (
        <Space>
          <LinkText onClick={edit(entity)}>编辑</LinkText>
          <Popconfirm title="确定删除吗?" onConfirm={remove(entity)}>
            <ErrorText pointer>删除</ErrorText>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormSelect
          name="categoryId"
          label="视频分组"
          request={fetchAllVideoGroup}
          placeholder="请选择视频分组"
          fieldProps={{fieldNames: { label: 'categoryName', value: 'id' }}}
        />
      </QueryFilter>

      <ProTable<Video>
        rowKey="id"
        actionRef={actionRef}
        request={paginationVideo}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        toolBarRender={() => [<Button type="primary" onClick={create}>新增</Button>]}
      />
    </PageContainer>
  )
}

export default VideoList

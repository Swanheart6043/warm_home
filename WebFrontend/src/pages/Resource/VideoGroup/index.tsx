import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import React, { useRef, useState } from 'react'
import EditModal from './EditModal'
import CreateModal from './CreateModal'
import NiceModal from '@ebay/nice-modal-react'
import { LinkText } from '@/components/Text/LinkText'
import { deleteVideoGroup, paginationVideoGroup } from '@/API/ResourceVideoAPI'
import moment from 'moment'
import { ErrorText } from '@/components/Text/ErrorText'
import { uniqBy } from 'lodash'

const VideoGroup: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1)
  const [params, setParams] = useState<Record<string, string | number>>({})
  const [selectedList, setSelectedList] = useState<VideoGroup[]>([])
  const actionRef = useRef<ActionType>()

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    if (pageIndex !== currentPageIndex) {
      setSelectedList([])
    }
    setCurrentPageIndex(pageIndex)
  }

  const checkedAll = (selected: boolean, rows: VideoGroup[]) => {
    if (!selected) {
      setSelectedList([])
      return
    }
    const noEmpty = rows.filter(item => item)
    const afterUniqBy = uniqBy([...selectedList, ...noEmpty], 'id')
    setSelectedList(afterUniqBy)
  }

  const checked = (row: VideoGroup, selected: boolean) => {
    if (!selected) {
      const result = selectedList.filter(item => item.id !== row.id)
      setSelectedList(result)
      return
    }
    setSelectedList([...selectedList, row])
  }

  const create = async () => {
    const result = await NiceModal.show(CreateModal, undefined)
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const edit = (row: VideoGroup) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, VideoGroup>(EditModal, row)
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const remove = (row: VideoGroup) => async () => {
    if (!row.id) {
      console.error('id不能为空')
      return
    }
    try {
      const result = await deleteVideoGroup([row.id])
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('删除成功')
      actionRef.current?.reload()
      setSelectedList([])
    } catch(error) {
      message.error(error)
    }
  }

  const handleBatchRemove = async () => {
    if (!selectedList.length) {
      console.error('id不能为空')
      return
    }
    try {
      const result = await deleteVideoGroup(selectedList.map(item => item.id as number))
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('批量删除成功')
      actionRef.current?.reload()
      setSelectedList([])
    } catch(error) {
      message.error(error)
    }
  }

  const columns: ProColumns<VideoGroup>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: '组名',
      dataIndex: 'categoryName',
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
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      width: 150,
      render: (_, entity) => entity.createTime && moment(entity.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 150,
      render: (_, entity) => entity.updateTime && moment(entity.updateTime).format('YYYY-MM-DD HH:mm:ss')
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
        <ProFormText
          name="categoryName"
          label="组名"
          placeholder="请输入组名"
        />
      </QueryFilter>

      <ProTable<VideoGroup>
        rowKey="id"
        actionRef={actionRef}
        request={paginationVideoGroup}
        columns={columns}
        search={false}
        params={params}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePaginationChange
        }}
        rowSelection={{
          selectedRowKeys: selectedList.filter(item => item.id).map(item => item.id as number),
          type: 'checkbox',
          onSelect: checked,
          onSelectAll: checkedAll,
        }}
        tableAlertOptionRender={() => <LinkText onClick={() => setSelectedList([])}>取消选择</LinkText>}
        toolBarRender={() => [
          <Button type="primary" onClick={create}>
            新增
          </Button>,
          <Button type="primary" disabled={!selectedList.length} onClick={handleBatchRemove}>
            删除
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default VideoGroup

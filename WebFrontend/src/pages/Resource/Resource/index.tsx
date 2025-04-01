import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormSelect, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space, Tag } from 'antd'
import React, { useRef, useState } from 'react'
import CreateAndEditModal from './CreateAndEditModal'
import NiceModal from '@ebay/nice-modal-react'
import { LinkText } from '@/components/Text/LinkText'
import { deleteResource, fetchAllResourceGroup, paginationResource } from '@/API/ResourceAPI'
import { uniqBy } from 'lodash'

const ResourceTextList: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1)
  const [params, setParams] = useState<Record<string, string | number>>({})
  const [selectedList, setSelectedList] = useState<Resource[]>([])
  const actionRef = useRef<ActionType>()

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    if (pageIndex !== currentPageIndex) {
      setSelectedList([])
    }
    setCurrentPageIndex(pageIndex)
  }

  const checkedAll = (selected: boolean, rows: UnassignedDevice[]) => {
    if (!selected) {
      setSelectedList([])
      return
    }
    const noEmpty = rows.filter(item => item)
    const afterUniqBy = uniqBy([...selectedList, ...noEmpty], 'id')
    setSelectedList(afterUniqBy)
  }

  const checked = (row: UnassignedDevice, selected: boolean) => {
    if (!selected) {
      const result = selectedList.filter(item => item.id !== row.id)
      setSelectedList(result)
      return
    }
    setSelectedList([...selectedList, row])
  }

  const create = async () => {
    const result = await NiceModal.show(CreateAndEditModal, undefined)
    if (!result) {
      return
    }
    setSelectedList([])
    actionRef.current?.reload()
  }

  const edit = (row: Resource) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<any, any, any>(CreateAndEditModal, { id: row.id, groupName: row.groupName })
    if (!result) {
      return
    }
    setSelectedList([])
    actionRef.current?.reload()
  }

  const remove = (row: Resource) => async () => {
    if (!row.id) {
      console.error('id不能为空')
      return
    }
    try {
      const result = await deleteResource(row.id.toString())
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
      const result = await deleteResource(selectedList.map(item => item.id).join())
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

  const columns: ProColumns<Resource>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '分组',
      dataIndex: 'groupName',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      width: 65,
      render: (_, entity) => entity.status == 0 ? <Tag color='success'>正常</Tag> : <Tag color='error'>停用</Tag>
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
      ellipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 80,
      render: (_, entity) => (
        <Space>
          <span style={{ color: '#40A9FF', cursor: 'pointer' }} onClick={edit(entity)}>
            编辑
          </span>
          <Popconfirm title="确定删除吗?" onConfirm={remove(entity)}>
            <span style={{ color: '#ff4d4f', cursor: 'pointer' }}>
              删除
            </span>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
        />
        <ProFormSelect
          name="groupId"
          label="分组"
          request={fetchAllResourceGroup}
          placeholder="请选择分组"
          fieldProps={{fieldNames: { label: 'name', value: 'id' }}}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[{label: '正常', value: '0'}, {label: '停用', value: '1'}]}
          placeholder="请选择状态"
        />
      </QueryFilter>

      <ProTable<Resource>
        rowKey="id"
        actionRef={actionRef}
        request={paginationResource}
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

export default ResourceTextList

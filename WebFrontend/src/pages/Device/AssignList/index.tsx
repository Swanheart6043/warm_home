import { paginationUnassignedDevice } from '@/API/DeviceUnassignedAPI'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormSelect, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import React, { useRef, useState } from 'react'
import NiceModal from '@ebay/nice-modal-react'
import AssignModal, { AssignModalProps } from './AssignModal'
import { LinkText } from '@/components/Text/LinkText'
import { uniqBy } from 'lodash'

const AssignList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const [selectedList, setSelectedList] = useState<UnassignedDevice[]>([])
  const actionRef = useRef<ActionType>()

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

  const assign = (row: UnassignedDevice) => async () => {
    const result = await NiceModal.show<boolean, any, AssignModalProps>(AssignModal, { selectedList: [row], needRowId: false })
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const batchAssign = async () => {
    const result = await NiceModal.show<boolean, any, AssignModalProps>(AssignModal, { selectedList, needRowId: false })
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const columns: ProColumns<UnassignedDevice>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 70,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      ellipsis: true,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      ellipsis: true,
    },
    {
      title: '设备IP',
      dataIndex: 'ip',
      ellipsis: true,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      ellipsis: true,
    },
    {
      title: '机型',
      dataIndex: 'mode',
      ellipsis: true,
    },
    {
      title: '所属',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'deviceNo',
      width: 70,
      render: (_, row) => row?.deviceNo ? <Tag color="success">已分配</Tag> : <Tag color="default">未分配</Tag>
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '操作',
      width: 50,
      render: (_, row) => (
        <LinkText disabled={row?.deviceNo} onClick={assign(row)}>
          分配
        </LinkText>
      )
    }
  ]

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams(values)}>
        <ProFormText name="deviceId" label="设备ID" />
        <ProFormText name="deviceNo" label="设备编号" />
        <ProFormSelect name="assStatus" label="分配状态" options={[{ label: '未分配', value: 0 },{ label: '已分配', value: 1 }]} />
      </QueryFilter>

      <ProTable<UnassignedDevice>
        rowKey="id"
        actionRef={actionRef}
        request={paginationUnassignedDevice}
        columns={columns}
        search={false}
        params={params}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: () => setSelectedList([])
        }}
        rowSelection={{
          selectedRowKeys: selectedList.filter(item => item.id).map(item => item.id as number),
          type: 'checkbox',
          onSelect: checked,
          onSelectAll: checkedAll,
        }}
        tableAlertOptionRender={() => (
          <LinkText onClick={() => setSelectedList([])}>
            取消选择
          </LinkText>
        )}
        toolBarRender={() => [
          <Button type="primary" disabled={!selectedList.length} onClick={batchAssign}>
            批量分配
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default AssignList

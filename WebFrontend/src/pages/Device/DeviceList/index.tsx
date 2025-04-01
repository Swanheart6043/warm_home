import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import CreateAndUpdateModal from './CreateAndUpdateModal'
import NiceModal from '@ebay/nice-modal-react'
import DeviceAllocateModal from './MoveGroupModal'
import ModalForImport from '../../../components/Modal/ImportModal'
import { LinkText } from '@/components/Text/LinkText'
import { ErrorText } from '@/components/Text/ErrorText'
import { fetchMaxDevice } from '@/API/DeviceMaxCountAPI'
import { exportDevice, importDevice, paginationDevice, removeDevice } from '@/API/DeviceListAPI'
import AssignModal, { AssignModalProps } from '../AssignList/AssignModal'
import { uniqBy } from 'lodash'

const DeviceList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({})
  const [selectedList, setSelectedList] = useState<Device[]>([])
  const actionRef = useRef<ActionType>()
  const [deviceCount, setDeviceCount] = useState<number>(0)

  useEffect(() => {
    const getDeviceCount = async () => {
      const { data } = await fetchMaxDevice()
      setDeviceCount(data?.maxDevices || 0)
    }
    getDeviceCount()
  }, [])

  const checkedAll = (selected: boolean, rows: Device[]) => {
    if (!selected) {
      setSelectedList([])
      return
    }
    const noEmpty = rows.filter(item => item)
    const afterUniqBy = uniqBy([...selectedList, ...noEmpty], 'id')
    setSelectedList(afterUniqBy)
  }

  const checked = (row: Device, selected: boolean) => {
    if (!selected) {
      const result = selectedList.filter(item => item.id !== row.id)
      setSelectedList(result)
      return
    }
    setSelectedList([...selectedList, row])
  }

  const importData = async () => {
    const result = await NiceModal.show<any, any, any>(ModalForImport, {
      title: '设备',
      downloadFileName: 'equip_model.xls',
      importRequest: importDevice
    })
    if (!result) {
      return
    }
    setSelectedList([])
    actionRef.current?.reload()
  }

  const exportData = async () => {
    const result = await exportDevice()
    if (!result) {
      return
    }
    const blob = new Blob([result]);
    const objectURL = URL.createObjectURL(blob);
    let btn = document.createElement('a');
    btn.download = '设备数据.xls';
    btn.href = objectURL;
    btn.click();
    URL.revokeObjectURL(objectURL);
    message.success('导出成功')
  }

  const create = async () => {
    const result: boolean = await NiceModal.show(CreateAndUpdateModal)
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const edit = (row: Device) => async () => {
    if (!row) {
      console.error('row不能为空')
      return
    }
    const result = await NiceModal.show<boolean, any, Device>(CreateAndUpdateModal, row)
    if (!result) return
    actionRef.current?.reload()
  }

  const assign = (row: Device) => async () => {
    const result: boolean = await NiceModal.show<boolean, any, AssignModalProps>(AssignModal, { selectedList: [row], needRowId: true })
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const remove = (row: Device) => async () => {
    if (!row.id) {
      console.error('id不能为空')
      return
    }
    try {
      const result = await removeDevice(row.id)
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

  const moveGroup = async () => {
    const result = await NiceModal.show<any, any, any>(DeviceAllocateModal, { selectedList })
    if (!result) return
    setSelectedList([])
    actionRef.current?.reload()
  }

  const columns: ProColumns<Device>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 70,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      ellipsis: true,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      ellipsis: true,
    },
    {
      title: '设备组',
      dataIndex: 'groupName',
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
      title: '修改时间',
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '操作',
      width: 120,
      render: (_, row) => (
        <Space>
          <LinkText onClick={edit(row)}>
            编辑
          </LinkText>
          <LinkText onClick={assign(row)}>
            分配
          </LinkText>
          <Popconfirm title="确定删除吗?" onConfirm={remove(row)}>
            <ErrorText pointer>删除</ErrorText>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => { setParams(values) }}>
        <ProFormText name="deviceId" label="设备ID" />
        <ProFormText name="deviceNo" label="设备编号" />
        <ProFormText name="brand" label="品牌" />
        <ProFormText name="groupName" label="设备组" />
      </QueryFilter>

      <ProTable<Device>
        headerTitle={`授权设备总数 ${deviceCount}`}
        rowKey="id"
        actionRef={actionRef}
        request={paginationDevice}
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
          <Button onClick={exportData}>
            导出
          </Button>,
          <Button type="primary" onClick={importData}>
            导入
          </Button>,
          <Button type="primary" onClick={create}>
            新增
          </Button>,
          <Button type="primary" disabled={!selectedList.length} onClick={moveGroup}>
            批量分组
          </Button>
        ]}
      />
    </PageContainer>
  );
};

export default DeviceList

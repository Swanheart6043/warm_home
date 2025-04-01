import type { ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProForm, ProFormText, ProTable, QueryFilter } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Select, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import EditModal, { DynamicDataModalProps } from './EditModal'
import CreateModal from './CreateModal'
import NiceModal from '@ebay/nice-modal-react'
import { LinkText } from '@/components/Text/LinkText'
import DynamicDataImportModal, { DynamicDataImportModalProps } from './DynamicDataImportModal'
import { deleteDynamicData, exportDynamicDataStep1, exportDynamicDataStep2, fetchAllDynamicTable, paginationDynamicData } from '@/API/DynamicDataAPI'
import { uniqBy } from 'lodash'

const ResourceLiveBroadcastRoomList: React.FC = () => {
  const [dataTableList, setDataTableList] = useState<DynamicTable[]>([])
  const selectedTable = useRef<DynamicTable|undefined>(undefined)
  const fieldList = useRef<FieldsItem[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1)
  const [currentPageSize, setCurrentPageSize] = useState<number>(20)
  const [params, setParams] = useState<Record<string, string|number|undefined>>({})
  const [selectedRows, setSelectedRows] = useState<UnassignedDevice[]>([])
  const [dataSource, setDataSource] = useState<Row[]>([])

  const getList = async (params?: Record<string, string|number|undefined>) => {
    if (!selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      return
    }
    const response = await paginationDynamicData({
      page: currentPageIndex,
      pageSize: currentPageSize,
      ...(params || {}),
      tableId: selectedTable.current.id,
      tableName: selectedTable.current.tableNameEn
    })
    setDataSource(response.data || [])
    return response
  }

  const getDynamicTable = async (option: DynamicTable | DynamicTable[]) => {
    if (Array.isArray(option)) return
    selectedTable.current = option
    if (!option.tableColumn || !option.id || !option.tableNameEn) return
    try {
      const fields = JSON.parse(option.tableColumn)
      fieldList.current = fields
      getList()
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const getDataTableList = async () => {
      const options = await fetchAllDynamicTable()
      setDataTableList(options)
      if (!options.length) return
      getDynamicTable(options[0])
    }
    getDataTableList()
  }, [])

  const handleDynamicTableSelected = (value: number, option: DynamicTable | DynamicTable[]) => {
    getDynamicTable(option)
  }

  const handleSearch = async (values: Record<string, string|number|undefined>) => {
    setParams(values)
    getList(values)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    if (pageIndex !== currentPageIndex) {
      setSelectedRows([])
    }
    setCurrentPageIndex(pageIndex)
  }

  const checkedAll = (selected: boolean, rows: Row[]) => {
    if (!selected) {
      setSelectedRows([])
      return
    }
    const noEmpty = rows.filter(item => item)
    const afterUniqBy = uniqBy([...selectedRows, ...noEmpty], 'id')
    setSelectedRows(afterUniqBy)
  }

  const checked = (row: Row, selected: boolean) => {
    if (!selected) {
      const result = selectedRows.filter(item => item.id !== row.id)
      setSelectedRows(result)
      return
    }
    setSelectedRows([...selectedRows, row])
  }

  const importData = async () => {
    if (!selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      return
    }
    const result: boolean = await NiceModal.show<any, any, DynamicDataImportModalProps>(DynamicDataImportModal, {
      tableId: selectedTable.current.id,
      tableName: selectedTable.current.tableNameEn,
    })
    if (!result) return
    setSelectedRows([])
    getList()
  }

  const exportData = async () => {
    if (!selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      console.error('tableId和tableName不能为空')
      return
    }
    const { resp_msg } = await exportDynamicDataStep1({
      tableId: selectedTable.current.id,
      tableName: selectedTable.current.tableNameEn
    })
    if (!resp_msg) {
      console.error('resp_msg不能为空')
      return
    }
    const result = await exportDynamicDataStep2(resp_msg)
    if (!result) {
      console.error('动态数据二进制文件不能为空')
      return
    }
    const blob = new Blob([result]);
    const objectURL = URL.createObjectURL(blob);
    let btn = document.createElement('a');
    btn.download = '动态数据.xls';
    btn.href = objectURL;
    btn.click();
    URL.revokeObjectURL(objectURL);
    message.success('导出成功')
  }

  const create = async () => {
    const result = await NiceModal.show<any, any, any>(CreateModal, { selectedTable: selectedTable.current, fieldList: fieldList.current })
    if (!result) {
      return
    }
    setSelectedRows([])
    await getList()
  }

  const edit = (row: Row) => async () => {
    if (!selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      console.error('tableId或tableName不能为空')
      return
    }
    const result = await NiceModal.show<any, any, DynamicDataModalProps>(EditModal, {
      fieldList: fieldList.current,
      id: row.id,
      tableId: selectedTable.current.id,
      tableName: selectedTable.current.tableNameEn,
    })
    if (!result) {
      return
    }
    setSelectedRows([])
    await getList()
  }

  const remove = (row: Row) => async () => {
    if (!row.id || !selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      console.error('rowId，tableId，tableName不能为空')
      return
    }
    try {
      const result = await deleteDynamicData(row.id.toString(), selectedTable.current.id, selectedTable.current.tableNameEn)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('删除成功')
      setSelectedRows([])
      await getList()
    } catch(error) {
      message.error(error)
    }
  }

  const handleBatchRemove = async () => {
    if (!selectedRows.length || !selectedTable.current?.id || !selectedTable.current?.tableNameEn) {
      console.error('rowId，tableId，tableName不能为空')
      return
    }
    try {
      const result = await deleteDynamicData(selectedRows.map(item => item.id).join(), selectedTable.current.id, selectedTable.current.tableNameEn)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('批量删除成功')
      setSelectedRows([])
      await getList()
    } catch(error) {
      message.error(error)
    }
  }

  const columns: ProColumns<Row>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    ...fieldList.current.map(item => ({
      title: item.columnInfo,
      dataIndex: item.columnName
    })),
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
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={handleSearch}>
        <ProForm.Item label="表名">
          <Select
            options={dataTableList}
            value={selectedTable.current?.id}
            onChange={handleDynamicTableSelected}
            fieldNames={{ label: 'tableName', value: 'id' }}
            placeholder="请选择表名"
          />
        </ProForm.Item>
        {fieldList.current.map(item => (<ProFormText name={item.columnName} label={item.columnInfo} />))}
      </QueryFilter>

      <ProTable<Row>
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        search={false}
        params={params}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePaginationChange
        }}
        rowSelection={{
          selectedRowKeys: selectedRows.filter(item => item.id).map(item => item.id as number),
          type: 'checkbox',
          onSelect: checked,
          onSelectAll: checkedAll,
        }}
        tableAlertOptionRender={() => <LinkText onClick={() => setSelectedRows([])}>取消选择</LinkText>}
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
          <Button type="primary" disabled={!selectedRows.length} onClick={handleBatchRemove}>
            删除
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default ResourceLiveBroadcastRoomList

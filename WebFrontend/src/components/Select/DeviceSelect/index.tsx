import styles from './index.module.less'
import { Key, useEffect, useState } from "react"
import DownOutlined from "@ant-design/icons/DownOutlined"
import { Input, Modal, Table, TableProps } from "antd"
import { ProColumns, ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components"
import { LinkText } from '@/components/Text/LinkText'
import { CloseCircleFilled } from '@ant-design/icons'
import { uniqBy } from 'lodash'
import { fetchAllDeviceGroup } from '@/API/DeviceGroupAPI'
import { fetchAllDevice } from '@/API/DeviceListAPI'

interface ModalSelectProps {
  width?: string;
  value?: string;
  onChange?: (selectList: any[]) => void
}

export const ModalSelect = (props: ModalSelectProps) => {
  const { value, onChange } = props
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedList, setSelectedList] = useState<Device[]>([])
  const [groupList, setGroupList] = useState<any[]>([])
  const [deviceList, setDeviceList] = useState<any[]>([])
  const [deviceListAfterSearch, setDeviceListAfterSearch] = useState<Device[]>([])
  const [currentGroup, setCurrentGroup] = useState<DeviceGroup | undefined>(undefined)
  const [inputText, setInputText] = useState<string | undefined>(undefined)
  const [groupTableLoading, setGroupTableLoading] = useState<boolean>(false)
  const [deviceTableLoading, setDeviceTableLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!value || !Array.isArray(value)) {
      return
    }
    setSelectedList(value)
  }, [value])

  const queryGroupList = async () => {
    setGroupTableLoading(true)
    const result = await fetchAllDeviceGroup()
    const afterFormat = result?.map(item => ({
      ...item,
      groupId: item.id === null ? -1 : item.id
    }))
    setGroupTableLoading(false)
    setGroupList(afterFormat || [])
    return afterFormat || []
  }

  const queryDeviceList = async (row: DeviceGroup) => {
    setCurrentGroup(row)
    setDeviceTableLoading(true)
    const result = await fetchAllDevice(undefined, row.id)
    setDeviceTableLoading(false)
    setDeviceList(result || [])
    setDeviceListAfterSearch(result || [])
  }

  const getPageData = async (groupId: string | null) => {
    const result = await queryGroupList()
    const row = result[0]
    if (!row) return
    queryDeviceList(row)
    setCurrentGroup(row)
    return result
  }

  const openModal = async () => {
    setIsShowModal(true)
    await getPageData(null)
    if (!value || !Array.isArray(value)) {
      return
    }
    setSelectedList(value)
  }

  const selectGroup = (selectedRowKeys: Key[], selectedRows: DeviceGroup[]) => {
    queryDeviceList(selectedRows[0])
  }

  const handleSearch = async (values: { equipId: string }) => {
    if (!values.equipId) {
      setDeviceListAfterSearch(deviceList)
      return
    }
    const result = deviceList.filter(item => item.deviceId === values.equipId)
    setDeviceListAfterSearch(result)
  }

  const selectDeviceAll = (selected: boolean, rows: Device[]) => {
    if (!selected) {
      setSelectedList([])
      return
    }
    const noEmpty = rows.filter(item => item)
    const afterUniqBy = uniqBy([...selectedList, ...noEmpty], 'id')
    setSelectedList(afterUniqBy)
  }

  const selectDevice = (row: Device, selected: boolean) => {
    if (!selected) {
      const result = selectedList.filter(item => item.id !== row.id)
      setSelectedList(result)
      return
    }
    setSelectedList([...selectedList, row])
  }

  const removeAll = () => {
    setSelectedList([])
  }

  const removeSingle = (row: Device) => () => {
    const result = selectedList.filter(item => item.id !== row.id)
    setSelectedList(result)
  }

  const handleOk = () => {
    onChange?.(selectedList)
    setIsShowModal(false)
    setInputText(selectedList.map(item => item.deviceNo).join(','))
  }

  const groupColumns: TableProps<DeviceGroup>['columns'] = [
    {
      title: '分组名称',
      dataIndex: 'name',
    }
  ]

  const deviceColumns: ProColumns<Device>[] = [
    {
      title: '设备名称',
      dataIndex: 'deviceNo',
      ellipsis: true
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      ellipsis: true
    },
    {
      title: '所属分组',
      dataIndex: 'groupName',
      ellipsis: true,
    },
    {
      title: '绑定时间',
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      width: 150
    }
  ]

  return (
    <>
      <Input
        style={{ width: '350px' }}
        readOnly
        placeholder="请选择设备"
        suffix={<DownOutlined style={{ color: 'rgba(0, 0, 0, .25)' }} />}
        value={inputText}
        onClick={openModal}
      />

      <Modal
        title="选择设备"
        width={1200}
        open={isShowModal}
        bodyStyle={{padding: 0, minHeight: '300px' }}
        onOk={handleOk}
        onCancel={() => setIsShowModal(false)}
        okButtonProps={{ disabled: !selectedList.length }}
      >
        <div className={styles.modalSelect}>
          <div style={{ flex: '0 0 210px', padding: '20px', borderRight: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Table<DeviceGroup>
              style={{ height: '590px', overflow: 'auto' }}
              size="small"
              rowKey="id"
              pagination={false}
              columns={groupColumns}
              dataSource={groupList}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: currentGroup?.id ? [currentGroup.id] : [],
                onChange: selectGroup,
              }}
              loading={groupTableLoading}
            />
          </div>

          <div style={{ flex: '1', padding: '20px', backgroundColor: '#f0f2f5' }}>
            <QueryFilter style={{ backgroundColor: '#fff', padding: '24px 20px 0px 0px' }} layout="horizontal" className="query-filter" onFinish={handleSearch}>
              <ProFormText name="equipId" label="设备ID" fieldProps={{ style: { width: '180px' } }}  />
            </QueryFilter>

            <div style={{ height: '16px',  }}></div>

            <div style={{ backgroundColor: '#fff', padding: '20px' }}>
              <ProTable<Device>
                style={{ height: '450px', overflow: 'auto' }}
                size="small"
                rowKey="id"
                options={false}
                search={false}
                pagination={false}
                columns={deviceColumns}
                dataSource={deviceListAfterSearch}
                rowSelection={{
                  selectedRowKeys: selectedList.filter(item => item.id).map(item => item.id as Key),
                  type: 'checkbox',
                  onSelect: selectDevice,
                  onSelectAll: selectDeviceAll,
                }}
                tableAlertRender={false}
                toolBarRender={false}
                loading={deviceTableLoading}
              />
            </div>
          </div>

          <div className={styles.rightArea} style={{ flex: '0 0 200px' }}>
            <div className={styles.rightAreaTitle}>
              <span>
                已选择：{selectedList.length}
              </span>
              <LinkText style={{color: '#1890ff', cursor: 'pointer'}} onClick={removeAll}>
                取消全部
              </LinkText>
            </div>

            <ul className={styles.rightAreaBody}>
              {selectedList.map(item => (
                <li className={styles.rowItem}>
                  <span>{item.deviceNo}</span>
                  <span>
                    <CloseCircleFilled
                      style={{color: '#ccc', cursor: 'pointer'}}
                      onClick={removeSingle(item)}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  )
}

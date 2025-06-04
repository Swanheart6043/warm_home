import { message, Switch, Table, type TableProps } from "antd"
import { useEffect, useState } from "react";
import { fetchControlData, updateLamp } from "../apis/api";
import type { ControlRow } from "../apis/apiType";

export const Control = () => {
  const [listForLamp, setListForLamp] = useState<ControlRow[]>([])
  const [listForSpeakers, setListForSpeakers] = useState<ControlRow[]>([])
  const [listForFan, setListForFan] = useState<ControlRow[]>([])
  const [listForDigitalTube, setListForDigitalTube] = useState<ControlRow[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const getList = async () => {
      const result = await fetchControlData()
      setListForLamp(result.data?.lamp?.map(item => ({ ...item, key: String(item.key) })) || [])
      setListForSpeakers(result.data?.speakers?.map(item => ({ ...item, key: String(item.key) })) || [])
      setListForFan(result.data?.fan?.map(item => ({ ...item, key: String(item.key) })) || [])
      setListForDigitalTube(result.data?.digitalTube?.map(item => ({ ...item, key: String(item.key) })) || [])
    }
    getList();
  }, [])

  const handleLampChange = (row: ControlRow) => async (value: boolean) => {
    const result = await updateLamp({operate: 'on', whichLed: 1})
    if (!result.success) return
    messageApi.success("操作成功")
    setListForLamp((newList) => {
      return newList.map(item => ({ ...item, checked: item.key === row.key ? value : item.checked }))
    })
  }
  const handleSpeakersChange = (row: ControlRow) => (value: boolean) => {
    row.checked = value
  }
  const handleFanChange = (row: ControlRow) => (value: boolean) => {
    row.checked = value
  }
  const handleDigitalTubeChange = (row: ControlRow) => (value: boolean) => {
    row.checked = value
  }

  const columnsForLamp: TableProps<ControlRow>['columns'] = [
    { 
      title: '灯名', 
      dataIndex: 'name' 
    },
    { 
      title: '操作', 
      dataIndex: 'checked', 
      width: 100, 
      render: (checked: boolean, row: ControlRow) => <Switch checked={checked} onChange={handleLampChange(row)} />
    }
  ]
  const columnsForSpeakers: TableProps<ControlRow>['columns'] = [
    { 
      title: '音箱名', 
      dataIndex: 'name' 
    },
    { 
      title: '操作', 
      dataIndex: 'checked', 
      width: 100, 
      render: (checked: boolean, row: ControlRow) => <Switch checked={checked} onChange={handleSpeakersChange(row)} />
    }
  ]
  const columnsForFan: TableProps<ControlRow>['columns'] = [
    { 
      title: '风扇名', 
      dataIndex: 'name' 
    },
    { 
      title: '操作', 
      dataIndex: 'checked', 
      width: 100, 
      render: (checked: boolean, row: ControlRow) => <Switch checked={checked} onChange={handleFanChange(row)} />
    }
  ]
  const columnsForDigitalTube: TableProps<ControlRow>['columns'] = [
    { 
      title: '数码屏名', 
      dataIndex: 'name' 
    },
    { 
      title: '操作', 
      dataIndex: 'checked', 
      width: 100, 
      render: (checked: boolean, row: ControlRow) => <Switch checked={checked} onChange={handleDigitalTubeChange(row)} />
    }
  ]

  return (
    <div style={{ height: '100%', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> 
          rowKey={(r) => r.key || ''}
          columns={columnsForLamp} 
          dataSource={listForLamp} 
          pagination={false} 
        />
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> 
          rowKey={(r) => r.key || ''}
          columns={columnsForSpeakers} 
          dataSource={listForSpeakers} 
          pagination={false} 
        />
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> 
          rowKey={(r) => r.key || ''}
          columns={columnsForFan} 
          dataSource={listForFan} 
          pagination={false} 
        />
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '20px' }}>
        <Table<ControlRow> 
          rowKey={(r) => r.key || ''}
          columns={columnsForDigitalTube} 
          dataSource={listForDigitalTube} 
          pagination={false} 
        />
      </div>

      {contextHolder}
    </div>
  )
}
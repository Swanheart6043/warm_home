import { Switch, Table, type TableProps } from "antd"
import { useEffect, useState } from "react";
import { fetchControlData } from "../../apis/controlAPI";
import type { ControlRow } from "../../apis/controlType";

export const Control = () => {
  const [listForLamp, setListForLamp] = useState<ControlRow[]>([])
  const [listForSpeakers, setListForSpeakers] = useState<ControlRow[]>([])
  const [listForFan, setListForFan] = useState<ControlRow[]>([])
  const [listForDigitalTube, setListForDigitalTube] = useState<ControlRow[]>([])
  
  useEffect(() => {
    const getList = async () => {
      const result = await fetchControlData()
      setListForLamp(result.lamp)
      setListForSpeakers(result.speakers)
      setListForFan(result.fan)
      setListForDigitalTube(result.digitalTube)
    }
    getList();
  }, [])

  const handleLampChange = () => {

  }
  const handleSpeakersChange = () => {

  }
  const handleFanChange = () => {

  }
  const handleDigitalTubeChange = () => {

  }

  const columnsForLamp: TableProps<ControlRow>['columns'] = [
    { title: '灯名', dataIndex: 'name' },
    { title: '操作', dataIndex: 'checked', width: 100, render: (checked: boolean) => <Switch checked={checked} onChange={handleLampChange} />}
  ]
  const columnsForSpeakers: TableProps<ControlRow>['columns'] = [
    { title: '音箱名', dataIndex: 'name' },
    { title: '操作', dataIndex: 'checked', width: 100, render: (checked: boolean) => <Switch checked={checked} onChange={handleSpeakersChange} />}
  ]
  const columnsForFan: TableProps<ControlRow>['columns'] = [
    { title: '风扇名', dataIndex: 'name' },
    { title: '操作', dataIndex: 'checked', width: 100, render: (checked: boolean) => <Switch checked={checked} onChange={handleFanChange} />}
  ]
  const columnsForDigitalTube: TableProps<ControlRow>['columns'] = [
    { title: '数码屏名', dataIndex: 'name' },
    { title: '操作', dataIndex: 'checked', width: 100, render: (checked: boolean) => <Switch checked={checked} onChange={handleDigitalTubeChange} />}
  ]

  return (
    <div style={{ height: '100%', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> columns={columnsForLamp} dataSource={listForLamp} pagination={false} />
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> columns={columnsForSpeakers} dataSource={listForSpeakers} pagination={false} />
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Table<ControlRow> columns={columnsForFan} dataSource={listForFan} pagination={false} />
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px' }}>
        <Table<ControlRow> columns={columnsForDigitalTube} dataSource={listForDigitalTube} pagination={false} />
      </div>
    </div>
  )
}
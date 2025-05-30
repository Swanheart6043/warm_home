import { Switch, Table, type TableProps } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";

interface DataType {
  key: string;
  name: string;
  checked: boolean;
}

export const Lamp = () => {
  const [dataSource] = useState<DataType[]>([
    { key: '1', name: 'Led1', checked: false },
    { key: '2', name: 'Led2', checked: false },
    { key: '3', name: 'Led3', checked: false },
    { key: '4', name: 'Led4', checked: false },
  ])
  
  useEffect(() => {
    const getList = async () => {
      const result = await axios.get('/cgi-bin/led.cgi')
      console.log(result, 'xxxxxxxxxxxx')
    }
    getList();
  }, [])

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'checked',
      width: 100,
      render: (checked: boolean) => <Switch checked={checked} />,
    }
  ]

  return (
    <Table<DataType> columns={columns} dataSource={dataSource} pagination={false} />
  )
}
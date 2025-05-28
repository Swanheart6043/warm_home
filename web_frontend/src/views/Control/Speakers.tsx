import { Switch, Table, type TableProps } from "antd"
import { useState } from "react"

interface DataType {
  key: string;
  name: string;
  checked: boolean;
}

export const Speakers = () => {
  const [dataSource] = useState<DataType[]>([
    { key: '1', name: '音箱', checked: false },
  ])
  
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
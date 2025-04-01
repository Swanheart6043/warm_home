import { buildPlatformOptions, PlatformEnum } from "@/enum/PlatformEnum"
import { fetchTaskDashboardTable } from "@/API/DashboardAPI"
import { ProColumns, ProTable } from "@ant-design/pro-components"
import { Select } from "antd"
import { useState } from "react"

const TableArea: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({
    platform: PlatformEnum.TK
  })

  const columns: ProColumns<TaskDashboardTableItem>[] = [
    {
      title: '注册数量',
      dataIndex: 'register',
      ellipsis: true,
    },
    {
      title: '登录数量',
      dataIndex: 'login',
      ellipsis: true,
    },
    {
      title: '养号数量',
      dataIndex: 'maintainAccount',
      ellipsis: true,
    },
    {
      title: '视频发布数量',
      dataIndex: 'publishVideo',
      ellipsis: true,
    },
    {
      title: '直播间数量',
      dataIndex: 'liveBroadcastRoom',
      ellipsis: true,
    },
    {
      title: '私信数量',
      dataIndex: 'privateMessage',
      ellipsis: true,
    },
    {
      title: '网络设置数量',
      dataIndex: 'networkSettings',
      ellipsis: true,
    }
  ]

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
        <span style={{ fontWeight: 'bold' }}>
          详情
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Select
            style={{ width: '120px' }}
            options={buildPlatformOptions()}
            value={params.platform}
            onChange={(value) => setParams({ ...params, platform: value })}
          />
        </span>
      </div>

      <ProTable<TaskDashboardTableItem>
        rowKey="id"
        request={fetchTaskDashboardTable}
        columns={columns}
        search={false}
        params={params}
        pagination={false}
        toolBarRender={false}
      />
    </div>
  )
}

export default TableArea

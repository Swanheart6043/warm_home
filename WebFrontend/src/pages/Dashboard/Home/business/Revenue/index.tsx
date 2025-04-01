import { Line } from "@ant-design/charts"
import { useState } from "react"
import { Select } from "antd"
import { PlatformEnum } from "@/enum/PlatformEnum"
import styles from './index.module.less'
import { NumberCard } from "../../component/NumberCard"

interface RevenueStatisticsProps {
  totalIncome: number;
  todayIncome: number;
}

enum Mode {
  Platform = 'Platform',
  Project = 'Project'
}
const defaultColor = ['#1cc640', '#b84d71', '#3696cd', '#fec507', '#fe9567']
const defaultData = [
  { date: '2025-03-01', value: 0, type: PlatformEnum.TK },
  { date: '2025-03-08', value: 805500, type: PlatformEnum.TK },
  { date: '2025-03-15', value: 0, type: PlatformEnum.TK },
  { date: '2025-03-22', value: 0, type: PlatformEnum.TK },
  { date: '2025-03-29', value: 0, type: PlatformEnum.TK },
]

export const Revenue = (props: RevenueStatisticsProps) => {
  const { totalIncome, todayIncome } = props || {}
  const [mode, setMode] = useState<string|undefined>(Mode.Project)
  const [list] = useState<HomeCharts[]>(defaultData)

  const handleNumberChange = (value: string) => {
    setMode(value)
  }

  return (
    <div className={styles.revenue} style={{ width: '100%' }}>
      <div className={styles.head}>
        <span>营收统计</span>
        <Select
          placeholder="请选择平台"
          style={{ width: '120px' }}
          options={[
            { label: '平台', value: Mode.Platform },
            { label: 'TK养号', value: Mode.Project }
          ]}
          value={mode}
          onChange={handleNumberChange}
        />
      </div>

      <div className={styles.body}>
        <div style={{ display: "flex", gap: '10px' }}>
          <NumberCard title="总收益" count={totalIncome} timing={0} />
          <NumberCard title="当月收益" count={todayIncome} timing={0} />
        </div>

        <div className={styles.chartArea}>
          <Line
            style={{ height: '100%' }}
            color={defaultColor}
            seriesField="type"
            data={list}
            xField="date"
            yField="value"
            smooth={true}
            animation={{
              appear: {
                animation: 'path-in',
                duration: 5000,
              },
            }}
          />
        </div>
      </div>

      <span className={styles.leftTop}></span>
      <span className={styles.rightTop}></span>
      <span className={styles.leftBottom}></span>
      <span className={styles.rightBottom}></span>
    </div>
  )
}

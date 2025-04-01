import { Column } from "@ant-design/charts"
import { useState } from "react"
import styles from './index.module.less'
import { PlatformEnum } from "@/enum/PlatformEnum"
import { NumberCard } from "../../component/NumberCard"

const defaultColor = ['#0773c2', '#fec407', '#01ab50', '#e12c17', '#e66f00']

export const AllPlatform = () => {
  const [yearData] = useState<HomeCharts[]>([
    { date: '2024-01', value: 15638, type: PlatformEnum.TK },
    { date: '2024-01', value: 0, type: PlatformEnum.INS },
    { date: '2024-01', value: 0, type: PlatformEnum.FB },
    { date: '2024-01', value: 0, type: PlatformEnum.YT },
    { date: '2024-01', value: 0, type: PlatformEnum.TW },
  ])

  return (
    <div className={styles.allPlatform} style={{ flex: '1', width: '100%' }}>
      <div className={styles.head}>
        全平台粉丝统计
      </div>

      <div className={styles.body}>
        <div style={{ flex: '0 0 auto' }}>
          <NumberCard title="粉丝总数" count={15638} suffix="k" timing={10000} />
        </div>

        <div className={styles.chartArea}>
          <Column
            style={{ height: '100%' }}
            color={defaultColor}
            seriesField="type"
            data={yearData}
            xField="type"
            yField="value"
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

import { Line } from "@ant-design/charts"
import { useState } from "react"
import styles from './index.module.less'
import { NumberCard } from "../../component/NumberCard"
import { PlatformEnum } from "@/enum/PlatformEnum"

const defaultColor = ['#b84d71', '#1cc640', '#3696cd', '#fec507', '#fe9567']
const defaultData = [
  { date: '2025-03-01', value: 23040, type: PlatformEnum.TK },
  { date: '2025-03-08', value: 19818, type: PlatformEnum.TK },
  { date: '2025-03-15', value: 0, type: PlatformEnum.TK },
  { date: '2025-03-22', value: 0, type: PlatformEnum.TK },
  { date: '2025-03-29', value: 0, type: PlatformEnum.TK },
]

export const Video = () => {
  const [dayData] = useState<HomeCharts[]>(defaultData)

  return (
    <div className={styles.video}>
      <div className={styles.head}>
        视频统计
      </div>

      <div className={styles.body}>
        <div style={{ flex: '0 0 auto' }}>
          <NumberCard title="视频总数" count={345600} timing={10000} />
        </div>

        <div className={styles.chartArea}>
          <Line
            style={{ height: '100%' }}
            color={defaultColor}
            seriesField="type"
            data={dayData}
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

        <span className={styles.leftTop}></span>
        <span className={styles.rightTop}></span>
        <span className={styles.leftBottom}></span>
        <span className={styles.rightBottom}></span>
      </div>
    </div>
  )
}

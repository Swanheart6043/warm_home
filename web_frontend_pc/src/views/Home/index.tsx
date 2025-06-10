import React from 'react'
import styles from './index.module.less'
import { BaseArea } from './Base'
import { TimeArea } from './component/TimeArea'

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.head}>
        <TimeArea />
        <h3>云控智家大数据平台</h3>
      </div>

      <div className={styles.body}>
        <BaseArea />
      </div>
    </div>
  )
}

export default Home

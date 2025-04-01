import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { Video } from './business/Video'
import { BaseArea } from './Base'
import { Revenue } from './business/Revenue'
import { AllPlatform } from './business/AllPlatform'
import { Account } from './business/Account'
import { TimeArea } from './component/TimeArea'
import { fetchHomeTemp } from '@/API/HomeAPI'

const Home: React.FC = () => {
  const [data, setData] = useState<HomeTemp>({});

  useEffect(() => {
    const getData = async () => {
      const result = await fetchHomeTemp()
      setData({
        totalIncome: result?.totalEarnings,
        todayIncome: result?.monthlyEarnings,
        windowNumber: result?.showcaseAccounts,
        numberOfPrimaryAccounts: result?.mainAccounts,
        numberOfPrimaryAccountServers: result?.mainServers,
        numberOfSecondaryAccounts: result?.secondaryAccounts,
        numberOfSecondaryAccountServers: result?.secondaryServers,
      })
    }
    getData()
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.head}>
        <TimeArea />
        <h3>小推云大数据平台</h3>
      </div>

      <div className={styles.body}>
        <BaseArea />

        <div className={styles.leftAndRightArea} style={{ left: '0px' }}>
          <Revenue
            totalIncome={data.totalIncome || 0}
            todayIncome={data.todayIncome || 0}
          />
          <Account
            windowNumber={data.windowNumber || 0}
            numberOfPrimaryAccounts={data.numberOfPrimaryAccounts || 0}
            numberOfPrimaryAccountServers={data.numberOfPrimaryAccountServers || 0}
            numberOfSecondaryAccounts={data.numberOfSecondaryAccounts || 0}
            numberOfSecondaryAccountServers={data.numberOfSecondaryAccountServers || 0}
          />
        </div>

        <div className={styles.leftAndRightArea} style={{ right: '0px' }}>
          <Video />
          <AllPlatform />
        </div>
      </div>
    </div>
  )
}

export default Home

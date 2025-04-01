import { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { NumberCard } from '../../component/NumberCard';

interface AccountStatisticsTableProps {
  windowNumber: number;
  numberOfPrimaryAccounts: number;
  numberOfPrimaryAccountServers: number;
  numberOfSecondaryAccounts: number;
  numberOfSecondaryAccountServers: number;
}

export const Account = (props: AccountStatisticsTableProps) => {
  const {
    windowNumber,
    numberOfPrimaryAccounts,
    numberOfPrimaryAccountServers,
    numberOfSecondaryAccounts,
    numberOfSecondaryAccountServers,
  } = props || {}

  const [list] = useState([
    {
      name: 'excite78',
      platform: 'TK',
      followers: '1178'
    },
    {
      name: 'relax22011',
      platform: 'TK',
      followers: '1011'
    },
    {
      name: 'relax21073',
      platform: 'TK',
      followers: '1006'
    },
    {
      name: 'new11200',
      platform: 'TK',
      followers: '1009'
    },
    {
      name: 'relax21062',
      platform: 'TK',
      followers: '1005'
    },
    {
      name: 'yummy10230',
      platform: 'TK',
      followers: '1006'
    },
    {
      name: 'yummy12687',
      platform: 'TK',
      followers: '1003'
    },
    {
      name: 'pets120',
      platform: 'TK',
      followers: '1359'
    },
    {
      name: 'petanimal11',
      platform: 'TK',
      followers: '1602'
    },
    {
      name: 'wy776486',
      platform: 'TK',
      followers: '2010'
    },
    {
      name: 'ehsg46',
      platform: 'TK',
      followers: '2334'
    },
    {
      name: 'shzg315',
      platform: 'TK',
      followers: '2547'
    },
    {
      name: 'sgsb01',
      platform: 'TK',
      followers: '2072'
    },
    {
      name: 'dhxb40',
      platform: 'TK',
      followers: '2154'
    },
  ])
  const scrollArea = useRef<HTMLUListElement|null>(null)

  useEffect(() => {
    const step = 38
    let lastStep = 0

		const id = setInterval(() => {
      if (!scrollArea.current) {
        return
      }
      if (lastStep >= 280) {
        scrollArea.current.style.transition = 'none'
        scrollArea.current.style.marginTop = '0px'
        lastStep = 0
        return
      }
      scrollArea.current.style.transition = '2s'
      lastStep += step
      scrollArea.current.style.marginTop = `-${lastStep}px`
    }, 2000)

    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <div className={styles.account}>
      <div className={styles.head}>
        账号统计
      </div>

      <div className={styles.body}>
        <div>
          <NumberCard title="橱窗号" count={windowNumber} timing={0} />
          <div className={styles.countArea}>
            <NumberCard title="主账号" count={numberOfPrimaryAccounts} timing={0} />
            <NumberCard title="服务器数" count={numberOfPrimaryAccountServers} timing={0} />
            <NumberCard title="副账号" count={numberOfSecondaryAccounts} timing={0} />
            <NumberCard title="服务器数" count={numberOfSecondaryAccountServers} timing={0} />
          </div>
        </div>

        <div className={styles.tableArea}>
          <dl>
            <dd>账号名</dd>
            <dd>平台</dd>
            <dd>粉丝数</dd>
          </dl>

          <div className={styles.maquee}>
            <ul ref={scrollArea}>
              {list.map((item, index) => (
                <li key={index}>
                  <div>{item.name}</div>
                  <div>{item.platform}</div>
                  <div>{item.followers}</div>
                </li>
              ))}
            </ul>
            <ul>
              {list.map((item, index) => (
                <li key={index}>
                  <div>{item.name}</div>
                  <div>{item.platform}</div>
                  <div>{item.followers}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <span className={styles.leftTop}></span>
      <span className={styles.rightTop}></span>
      <span className={styles.leftBottom}></span>
      <span className={styles.rightBottom}></span>
    </div>
  )
}

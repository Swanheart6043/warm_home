import { useEffect, useState } from 'react'
import styles from './index.module.less'
import moment from 'moment'

export const TimeArea = () => {
  const [time, setTime] = useState(moment())

  useEffect(() => {
    const id = setInterval(() => setTime(moment()), 1000)

    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <ul className={styles.nowTime}>
      <li>
        {moment(time).format('HH:mm:ss')}
      </li>

      <li>
        <div>{moment(time).format('YYYY年MM月DD号')}</div>

        <div>{moment(time).format('dddd')}</div>
      </li>
    </ul>
  )
}

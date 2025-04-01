import styles from './index.module.less'

interface NumberCardProps {
  title?: string;
  count?: number;
  suffix?: string;
  timing?: number;
}

export const NumberCard = (props: NumberCardProps) => {
  const { title, count, suffix,  } = props

  return (
    <div className={styles.countArea}>
      <div className={styles.countName}>{title || '-'}</div>
      <div className={styles.count}>{count}{suffix || ''}</div>
    </div>
  )
}

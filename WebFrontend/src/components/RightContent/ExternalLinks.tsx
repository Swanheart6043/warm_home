import { HddOutlined } from "@ant-design/icons"
import { Space } from "antd"
import { useEffect, useRef } from "react"
import styles from './index.less'
import { fetchExternalLinks } from "@/API/SystemAPI"

export const ExternalLinks = () => {
  const url = useRef<string | undefined>(undefined)

  useEffect(() => {
    const getData = async () => {
      const result = await fetchExternalLinks()
      url.current = result.datas?.url
    }
    getData()
  }, [])

  const gotoSaas = () => {
    if (!url.current) return
    window.open(url.current)
  }

  return (
    <Space className={styles.action} style={{ color: '#1890ff' }} onClick={gotoSaas}>
      <HddOutlined style={{ color: '#1890ff' }} />
      <span>云机客户端</span>
    </Space>
  )
}

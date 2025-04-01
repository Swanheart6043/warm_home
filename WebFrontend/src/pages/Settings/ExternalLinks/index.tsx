import { fetchExternalLinks, updateExternalLinks } from "@/API/SystemAPI"
import { PageContainer, ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { message } from "antd"
import { useEffect, useRef, useState } from "react"

export const ExternalLinks: React.FC = () => {
  const [externalLink, setExternalLink] = useState<ExternalLink | undefined>(undefined)
  const formRef = useRef<ProFormInstance | null>(null)

  useEffect(() => {
    const getData = async () => {
      const result = await fetchExternalLinks()
      setExternalLink(result.datas)
      formRef.current?.setFieldValue('url', result.datas?.url)
    }
    getData()
  }, [])

  const submit = async (values: any) => {
    try {
      const result = await updateExternalLinks({
        ...(externalLink || {}),
        url: values.url
      })
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('设置成功')
      return
    } catch(error) {
      console.error(error)
      return
    }
  }

  return (
    <PageContainer>
      <ProForm formRef={formRef} onFinish={submit} style={{ padding: '24px', backgroundColor: '#fff' }}>
        <ProFormText
          rules={[{ required: true, message: '地址不能为空' }]}
          label="跳转地址"
          name="url"
          placeholder="请输入跳转地址"
          width="md"
        />
      </ProForm>
    </PageContainer>
  )
}

export default ExternalLinks

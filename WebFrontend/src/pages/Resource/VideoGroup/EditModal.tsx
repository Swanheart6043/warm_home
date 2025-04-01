import { updateVideoGroup } from "@/API/ResourceVideoAPI"
import { ProForm, ProFormInstance, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useEffect, useRef, useState } from "react"

export default NiceModal.create((row: VideoGroup) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    const getDetail = async () => {
      if (!row?.id || !formRef.current) return
      formRef.current?.setFieldsValue(row)
    }
    setTimeout(() => getDetail())
  }, [])

  const submit = async () => {
    if (!row.id) {
      console.error('id不能为空')
      return
    }
    await formRef.current?.validateFields().catch(() => Promise.resolve(false))
    const formData = formRef.current?.getFieldsValue()
    try {
      setConfirmLoading(true)
      const result = await updateVideoGroup({
        id: row.id,
        categoryName: formData.categoryName,
        comment: formData.comment,
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('编辑成功')
      modal.resolve(true)
      modal.remove()
    } catch (error) {
      message.error(error)
    }
  }

  return (
    <Modal
      title="编辑分组"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm formRef={formRef} layout="horizontal" labelCol={{ span: 4 }} submitter={false}>
        <ProFormText
          rules={[{ required: true }]}
          label="组名"
          name="categoryName"
          placeholder="请输入组名"
          fieldProps={{ maxLength: 20, showCount: true }}
        />
        <ProFormTextArea
          label="备注"
          name="comment"
          placeholder="请输入备注"
          fieldProps={{ maxLength: 500, showCount: true }}
        />
      </ProForm>
    </Modal>
  )
})

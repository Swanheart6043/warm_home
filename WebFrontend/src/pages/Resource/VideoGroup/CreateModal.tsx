import { ProFormText, ProForm, ProFormTextArea, ProFormInstance } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useRef, useState } from "react"
import { createVideoGroup } from "@/API/ResourceVideoAPI"

export default NiceModal.create(() => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const submit = async () => {
    await formRef.current?.validateFields().catch(() => Promise.resolve(false))
    const formData = formRef.current?.getFieldsValue()
    try {
      setConfirmLoading(true)
      const result = await createVideoGroup({
        categoryName: formData.categoryName,
        comment: formData.comment,
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('新增成功')
      modal.resolve(true)
      modal.hide()
    } catch(error) {
      message.error(error)
    }
  }

  return (
    <Modal
      title="新增分组"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      confirmLoading={confirmLoading}
    >
      <ProForm formRef={formRef} layout="horizontal" labelCol={{ span: 4 }} submitter={false}>
        <ProFormText
          rules={[{ required: true, message: '组名不能为空' }]}
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

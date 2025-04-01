import { updateAccount } from "@/API/DashboardAPI"
import { ProForm, ProFormInstance, ProFormTextArea } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useEffect, useRef, useState } from "react"

export default NiceModal.create((row: AccountItem) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    formRef.current?.setFieldsValue({ ...row })
  }, [])

  const submit = async () => {
    if (!row?.id) {
      console.error('row?.id不能为空')
      return
    }
    const valid = await formRef.current?.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      const formData = formRef.current?.getFieldsValue()
      setConfirmLoading(true)
      const result = await updateAccount({ ...formData, id: row.id })
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
      title="备注"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true} confirmLoading={confirmLoading}
    >
      <ProForm formRef={formRef} layout="horizontal" submitter={false}>
        <ProFormTextArea
          rules={[{ required: true, message: '备注不能为空' }]}
          label="备注"
          name="comment"
          placeholder="请输入备注"
        />
      </ProForm>
    </Modal>
  )
})

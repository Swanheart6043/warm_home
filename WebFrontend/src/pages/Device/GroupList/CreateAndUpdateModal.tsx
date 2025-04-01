import { ProFormText, ProForm, ProFormTextArea } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { Form, message, Modal } from "antd"
import { useEffect, useState } from "react"
import { createAndUpdateDeviceGroup } from "@/API/DeviceGroupAPI"

export default NiceModal.create((row: DeviceGroup) => {
  const modal = useModal();
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (!row?.id) return
    form.setFieldsValue(row)
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return false
    try {
      setConfirmLoading(true)
      const result = await createAndUpdateDeviceGroup({
        ...form.getFieldsValue(),
        id: row?.id
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return false
      }
      message.success('提交成功')
      modal.resolve(true)
      modal.hide()
      return true
    } catch(error) {
      console.error(error)
      return false
    }
  }

  return (
    <Modal
      title={`${ !row?.id ? '新增' : '编辑' }设备分组`}
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false}>
        <ProFormText
          rules={[{ required: true, message: '组名不能为空' }]}
          name="name"
          label="组名"
          placeholder="请输入组名"
        />
        <ProFormTextArea
          name="comment"
          label="备注"
          placeholder="请输入备注"
        />
      </ProForm>
    </Modal>
  )
})

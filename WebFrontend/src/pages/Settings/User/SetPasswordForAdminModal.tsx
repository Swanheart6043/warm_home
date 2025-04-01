import { resetPassword } from '@/API/SystemAPI'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal } from 'antd'
import { useState } from 'react'

export const SetPasswordForAdminModal = NiceModal.create((row: UserRow) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      setConfirmLoading(true)
      const result = await resetPassword({
        ...form.getFieldsValue(),
        userId: row?.id
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('设置成功')
      modal.resolve(true)
      modal.hide()
      return
    } catch(error) {
      console.error(error)
      return
    }
  }

  return (
    <Modal
      title="设置密码"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false}>
        <ProFormText
          rules={[{ required: true, message: '密码不能为空' }]}
          label="密码"
          name="password"
          placeholder="请输入密码"
        />
      </ProForm>
    </Modal>
  )
})

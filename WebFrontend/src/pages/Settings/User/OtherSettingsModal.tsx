import { updateUserCloud } from '@/API/SystemAPI'
import { ProForm, ProFormDateTimePicker, ProFormDigit } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

export const OtherSettingsModal = NiceModal.create((row: UserRow) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  useEffect(() => {
    form.setFieldsValue({
      deviceNumber: row?.deviceNumber || undefined,
      tenantExpireTime: row?.tenantExpireTime
    })
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      const formValues = form.getFieldsValue()
      setConfirmLoading(true)
      const result = await updateUserCloud({
        ...formValues,
        tenantExpireTime: formValues.tenantExpireTime && moment(formValues.tenantExpireTime).format('YYYY-MM-DD HH:mm:ss'),
        id: row.id,
        tenantId: row.tenantId,
        deptId: row.deptId
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
      title="其他设置"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false}>
        <ProFormDigit
          rules={[{ required: true, message: '设备量不能为空' }]}
          label="设备量"
          name="deviceNumber"
          placeholder="请输入设备量"
        />
        <ProFormDateTimePicker
          rules={[{ required: true, message: '过期时间不能为空' }]}
          label="过期时间"
          name="tenantExpireTime"
          placeholder="请选择过期时间"
          fieldProps={{ style:{ width: '100%' } }}
        />
      </ProForm>
    </Modal>
  )
})

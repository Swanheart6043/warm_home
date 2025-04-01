import { readMaxDevice, updateMaxDevice } from '@/API/DeviceMaxCountAPI'
import { ProForm, ProFormDigit } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'

export const MaxDeviceModal = NiceModal.create((row: App) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const detail = useRef<MaxDeviceResponse>({})

  useEffect(() => {
    const getData = async () => {
      if (!row.deptId) return
      setLoading(true)
      const result = await readMaxDevice(row.deptId)
      setLoading(false)
      if (!result.data) return
      form.setFieldsValue(result.data)
      detail.current = result.data
    }
    getData()
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) {
      return
    }
    if (!row) {
      console.error('row不能为空')
      return
    }
    try {
      setConfirmLoading(true)
      const params = {
        ...detail.current,
        ...form.getFieldsValue(),
        schemad: row.deptId
      }
      const result = await updateMaxDevice(params);
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
      title="可用设备数"
      width={350}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <Spin spinning={loading}>
        <ProForm form={form} submitter={false}>
          <ProFormDigit
            rules={[{ required: true, message: '可用设备数不为空' }]}
            width="md"
            name="maxDevices"
            label="可用设备数"
            placeholder="输入可用设备数"
          />
        </ProForm>
      </Spin>
    </Modal>
  )
})

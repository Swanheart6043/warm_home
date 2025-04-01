import { fetchAllDeviceGroup } from "@/API/DeviceGroupAPI"
import { createAndUpdateDevice, readDevice } from "@/API/DeviceListAPI"
import { ProFormText, ProForm, ProFormTextArea, ProFormSelect } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { Form, message, Modal } from "antd"
import { useEffect, useState } from "react"

export default NiceModal.create((row: Device) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    const getDetail = async () => {
      if (!row?.id) return
      const detail = await readDevice(row?.id)
      if (!detail) return
      form.setFieldsValue(detail)
    }
    getDetail()
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return false
    try {
      setConfirmLoading(true)
      const result = await createAndUpdateDevice({
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
      title={`${ !row?.id ? '新增' : '编辑' }设备`}
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false}>
        <ProFormText
          rules={[{ required: true, message: '设备ID不能为空' }, { pattern: /^[a-zA-Z0-9]+$/, message: '设备ID不合法' }]}
          name="deviceId"
          label="设备ID"
          placeholder="请输入设备ID"
        />

        <ProFormText
          rules={[{ required: true, message: '设备编号不能为空' }, { pattern: /^[a-zA-Z0-9]+$/, message: '设备编号不合法' }]}
          name="deviceNo"
          label="设备编号"
          placeholder="请输入设备编号"
        />

        <ProFormSelect
          rules={[{ required: true, message: '分组不能为空' }]}
          name="groupId"
          label="设备组"
          placeholder="请选择分组"
          request={fetchAllDeviceGroup}
          fieldProps={{fieldNames: { label: 'name', value: 'id' }}}
        />

        <ProFormText
          name="brand"
          label="品牌"
          placeholder="请输入品牌"
        />

        <ProFormText
          name="mode"
          label="机型"
          placeholder="请输入机型"
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

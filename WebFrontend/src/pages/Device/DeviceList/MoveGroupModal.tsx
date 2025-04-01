import { ProForm, ProFormInstance, ProFormSelect } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useRef, useState } from "react"
import { fetchAllDeviceGroup } from "@/API/DeviceGroupAPI"
import { setDeviceGroup } from "@/API/DeviceListAPI"

export default NiceModal.create(({ selectedList }: { selectedList: Device[] }) => {
  const modal = useModal()
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const submit = async () => {
    try {
      await formRef.current?.validateFields()
    } catch {
      return
    }
    if (!selectedList?.length) {
      console.error('selectedList不能为空')
      return
    }
    try {
      setConfirmLoading(true)
      const result = await setDeviceGroup({
        ...formRef.current?.getFieldsValue(),
        ids: selectedList.map(item => item.id as number).join()
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('分配成功')
      modal.resolve(true)
      modal.hide()
    } catch(error) {
      message.error(error)
    }
  }

  return (
    <Modal
      title="设备分组"
      width={500}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      confirmLoading={confirmLoading}
    >
      <ProForm formRef={formRef} submitter={false}>
        <ProFormSelect
          rules={[{ required: true, message: '分组不能为空' }]}
          name="groupId"
          label="设备组"
          placeholder="请选择分组"
          request={fetchAllDeviceGroup}
          fieldProps={{fieldNames: { label: 'name', value: 'id' }}}
        />
      </ProForm>
    </Modal>
  )
})

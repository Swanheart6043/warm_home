import { ProForm, ProFormInstance, ProFormSelect } from "@ant-design/pro-components"
import { assignDevice, batchAssignDevice, fetchUserWhoCanAssignedDevice } from "@/API/DeviceUnassignedAPI"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useRef, useState } from "react"
import { fetchAllDeviceGroup } from "@/API/DeviceGroupAPI"

export interface AssignModalProps {
  selectedList: UnassignedDevice[],
  needRowId: boolean
}

export default NiceModal.create(({ selectedList, needRowId }: AssignModalProps) => {
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
      const result = selectedList?.length > 1 ? await batchAssignDevice({
        deviceList: selectedList?.map(item => ({
          ...formRef.current?.getFieldsValue(),
          id: needRowId ? item?.id : undefined,
          deviceNo: item?.deviceId,
          deviceId: item?.deviceId,
          brand: item?.brand,
          mode: item?.mode,
          status: item?.status,
        }))
      }) : await assignDevice({
        ...formRef.current?.getFieldsValue(),
        id: needRowId ? selectedList?.[0]?.id : undefined,
        deviceNo: selectedList?.[0]?.deviceId,
        deviceId: selectedList?.[0]?.deviceId,
        brand: selectedList?.[0]?.brand,
        mode: selectedList?.[0]?.mode,
        status: selectedList?.[0]?.status,
      })
      setConfirmLoading(false)
      if (result.resp_code != 0) {
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
      title="分配设备"
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
        <ProFormSelect
          rules={[{ required: true, message: '用户不能为空' }]}
          name="tenantId"
          label="用户"
          placeholder="请选择用户"
          request={fetchUserWhoCanAssignedDevice}
          fieldProps={{fieldNames: { label: 'username', value: 'id' }}}
        />
      </ProForm>
    </Modal>
  )
})

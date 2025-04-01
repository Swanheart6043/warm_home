import { ProFormText, ProForm, ProFormTextArea, ProFormInstance, ProFormRadio } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useRef, useState } from "react"
import { createResourceGroup } from "@/API/ResourceAPI"
import moment from "moment"

export default NiceModal.create(() => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const submit = async () => {
    try {
      await formRef.current?.validateFields()
    } catch {
      return
    }
    try {
      const params = formRef.current?.getFieldsValue()
      setConfirmLoading(true)
      const result = await createResourceGroup({
        ...params,
        tenantId: 1,
        isDeleted: 0,
        gmtCreate: moment().format('YYYY-MM-DD HH:mm:ss'),
        gmtModified: moment().format('YYYY-MM-DD HH:mm:ss')
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
          name="name"
          placeholder="请输入组名"
          fieldProps={{ maxLength: 20, showCount: true }}
        />

        <ProFormTextArea
          rules={[{ required: true, message: '备注不能为空' }]}
          label="备注"
          name="comment"
          placeholder="请输入备注"
          fieldProps={{ maxLength: 500, showCount: true }}
        />

        <ProFormRadio.Group
          label="状态"
          name="status"
          options={[{label: '正常', value: 0},{label: '停用', value: 1}]}
          initialValue={0}
        />
      </ProForm>
    </Modal>
  )
})

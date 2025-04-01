import { createAndUpdateRole } from '@/API/SystemAPI'
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal } from 'antd'
import { useEffect, useState } from 'react'

export const CreateAndUpdateModal = NiceModal.create((row: Role) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  useEffect(()=> {
    if (!row) return
    form.setFieldsValue(row)
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      setConfirmLoading(true)
      const result = await createAndUpdateRole({
        ...form.getFieldsValue(),
        roleId: row.roleId,
        dataScope: "3",
        deptIds: [],
        menuIds: [],
        menuCheckStrictly: false,
        deptCheckStrictly: false,
        roleSort: 0,
        status: "1"
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('提交成功')
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
      title={`${ !row?.roleId ? '新增' : '编辑' }角色`}
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
          rules={[{ required: true, message: '角色名不为空' }]}
          label="角色名"
          name="roleName"
          placeholder="输入角色名"
        />

        <ProFormTextArea
          label="备注"
          name="remark"
          placeholder="请输入备注"
        />
      </ProForm>
    </Modal>
  )
})

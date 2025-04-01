import { createAndUpdateApp } from '@/API/SystemAPI'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal } from 'antd'
import { useEffect, useState } from 'react'

const CreateAndUpdateModal = NiceModal.create((row: App) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(()=> {
    if (!row) return
    form.setFieldsValue(row)
  }, [])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      setConfirmLoading(true)
      const result = await createAndUpdateApp({
        ...form.getFieldsValue(),
        parentId: 100,
        orderNum: 0,
        deptId: row.deptId,
        status: "1",
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
      title={`${ !row?.deptId ? '新增' : '编辑' }租户`}
      width={600}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false}>
        <ProFormText
          rules={[{ required: true, message: '租户名称不能为空' }]}
          label="租户名称"
          name="deptName"
          placeholder="请输入租户名称"
        />

        <ProFormText
          rules={[{ required: true, message: '负责人不能为空' }]}
          label="负责人"
          name="leader"
          placeholder="请输入负责人"
        />

        <ProFormText
           rules={[
            { required: true, message: '联系电话不能为空' },
            { pattern: /^1[0-9]{10}$/, message: '联系电话不合法' }
          ]}
          label="联系电话"
          name="phone"
          placeholder="请输入联系电话"
        />

        <ProFormText
          rules={[{ required: true, message: '邮箱不能为空' }]}
          label="邮箱"
          name="email"
          placeholder="请输入邮箱"
        />
      </ProForm>
    </Modal>
  )
})

export default CreateAndUpdateModal

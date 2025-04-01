import { fetchAllApp, fetchAllRole, createUser, updateUser } from '@/API/SystemAPI'
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Form, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'

const UserCreateModal = NiceModal.create((row: UserRow) => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const modal = useModal()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (!row?.roles) return
    const roleIds = row.roles.map((item) => item.roleId)
    form.setFieldsValue({
      ...row,
      phonenumber: row.mobile,
      nickName: row.userNickname,
      email: row.userEmail,
      roleIds: roleIds?.[0]
    })
  }, [form, row])

  const submit = async () => {
    const valid = await form.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      const formValues = form.getFieldsValue()
      const params = {
        ...formValues,
        roleIds: [formValues.roleIds],
        userId: row.id,
        postIds: [1],
        status: "1",
        isAdmin: 1
      }
      setConfirmLoading(true)
      const result = !row.id ? await createUser(params) : await updateUser(params)
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('提交成功')
      modal.resolve(true)
      modal.hide()
    } catch(error) {
      console.error(error)
      return
    }
  }

  return (
    <Modal
      title={`${ !row?.id ? '新增' : '编辑' }用户`}
      width={800}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm form={form} submitter={false} initialValues={{ sex: 0 }}>
        <ProForm.Group>
          <ProFormText
            rules={[
              { required: true, message: '账号不能为空' },
              { pattern: /^[a-zA-Z0-9_\-!@#$%^&*()]+$/, message: '账号不合法' },
              { max: 20, message: '不能超过20' }
            ]}
            width="md"
            name="userName"
            label="账号"
            placeholder="请输入账号"
            disabled={Boolean(row.id)}
          />

          {!row.id && (
            <ProFormText
              rules={[{ required: true, message: '密码不能为空' }]}
              label="密码"
              name="password"
              width="md"
              placeholder="请输入密码"
              disabled={Boolean(row.id)}
            />
          )}

          <ProFormText
            rules={[{ required: true, message: '用户昵称不能为空' }]}
            width="md"
            name="nickName"
            label="用户昵称"
            placeholder="请输入用户昵称"
          />

          <ProFormText
            rules={[
              { required: true, message: '手机号不能为空' },
              { pattern: /^1[0-9]{10}$/, message: '手机号不合法' }
            ]}
            width="md"
            name="phonenumber"
            label="手机号"
            placeholder="请输入手机号"
          />

          <ProFormSelect
            rules={[{ required: true, message: '性别不能为空' }]}
            name="sex"
            label="性别"
            width="md"
            options={[
              { label: '男', value: 0 },
              { label: '女', value: 1 },
            ]}
          />

          <ProFormText
            label="邮箱"
            name="email"
            width="md"
            placeholder="请输入邮箱"
          />

          <ProFormSelect
            rules={[{ required: true, message: '角色不能为空' }]}
            name="roleIds"
            label="角色"
            width="md"
            request={async () => (await fetchAllRole())?.filter(role => role.roleId !== 1) || []}
            fieldProps={{ fieldNames: { label: 'roleName', value: 'roleId' }}}
            placeholder="请选择角色"
          />

          <ProFormSelect
            rules={[{ required: true, message: '所属租户不能为空' }]}
            name="deptId"
            label="所属租户"
            width="md"
            request={async () => (await fetchAllApp())?.filter(item => item.deptId !== 100) || []}
            fieldProps={{ fieldNames: { label: 'deptName', value: 'deptId' }}}
            placeholder="请选择所属租户"
            disabled={Boolean(row?.id) && currentUser?.id !== 1}
          />

          <ProFormTextArea
            name="remark"
            label="备注"
            width="md"
            placeholder="请输入备注"
          />
        </ProForm.Group>
      </ProForm>
    </Modal>
  )
})

export default UserCreateModal

import { importMeAvatar, updateMe } from '@/API/SystemAPI'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { PageContainer, ProFormText, ProForm, ProFormRadio } from '@ant-design/pro-components'
import { Avatar, Button, Form, message, Upload } from 'antd'
import type { RcFile } from 'antd/lib/upload'
import React, { useEffect, useState } from 'react'
import { useModel } from 'umi'
import styles from './index.less'

const AvatarUpload = ({ avatar, setImage }: { avatar: string, setImage: (headImgUrl: string) => void }) => {
  const handleImport = async (file: RcFile) => {
    const hide = message.loading('正在导入')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await importMeAvatar(formData)
      hide()
      message.success('上传头像成功')
      return result
    } catch (error) {
      hide()
      message.error('上传头像失败')
      return null
    }
  }
  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <Avatar
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          icon={<UserOutlined />}
          src={avatar ? <img src={avatar} alt="avatar" /> : undefined}
          size={140}
        />
      </div>
      <Upload
        maxCount={1}
        showUploadList={false}
        beforeUpload={async (file) => {
          if (!file.type.includes('image')) {
            message.error('上传文件必须是图片')
            return false
          }
          const result = await handleImport(file)
          if (result && result.url) {
            setImage(result.url)
          }
          return false
        }}
      >
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />更换头像
          </Button>
        </div>
      </Upload>
    </>
  )
}

const UserInfo: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const [form] = Form.useForm<Me>()
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar ?? '')

  useEffect(() => {
    form.setFieldsValue({
      id: currentUser?.id,
      userName: currentUser?.userName,
      userNickname: currentUser?.userNickname,
      mobile: currentUser?.mobile,
      sex: currentUser?.sex,
    })
  }, [])

  const submit = async (values: Me) => {
    if (!currentUser?.id) {
      console.error('currentUser?.id 不能为空')
      return
    }
    try {
      const result = await updateMe({
        id: currentUser.id,
        userNickname: values.userNickname,
        mobile: values.mobile,
        sex: values.sex,
        avatar
      })
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return false
      }
      setInitialState({
        ...initialState,
        currentUser: {
          ...currentUser,
          userNickname: values.userNickname,
          mobile: values.mobile,
          sex: values.sex,
          avatar,
        }
      })
      message.success('修改成功')
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return (
    <PageContainer header={{ subTitle: '更新个人信息' }}>
      <div className={styles.baseView}>
        <div className={styles.left}>
          <ProForm<Me>
            form={form}
            onFinish={submit}
            submitter={{
              render: (_, dom) => (<>{dom[1]}</>)
            }}>
            <ProFormText
              name="userName"
              label="账号"
              readonly
            />

            <ProFormText
              rules={[{ required: true, message: '用户昵称不为空' }]}
              width="md"
              name="userNickname"
              label="用户昵称"
              placeholder="输入用户昵称"
            />

            <ProFormText
              rules={[{ required: true, message: '手机号不为空' }, { pattern: /^1[0-9]{10}$/, message: '手机号不合法' }]}
              width="md"
              name="mobile"
              label="手机号"
              placeholder="输入手机号"
            />

            <ProFormRadio.Group
              name="sex"
              label="性别"
              width="md"
              options={[{ label: '男', value: 0 }, { label: '女', value: 1 }]}
            />
          </ProForm>
        </div>

        <div className={styles.right}>
          <AvatarUpload avatar={avatar} setImage={(value: string) => setAvatar(value)} />
        </div>
      </div>
    </PageContainer>
  )
}

export default UserInfo

import { outLogin } from '@/API/SystemAPI';
import { updatePassword } from "@/API/SystemAPI"
import { PageContainer, ProForm, ProFormText } from "@ant-design/pro-components"
import { message, Space } from "antd"
import { history, useModel } from "umi";
import { stringify } from 'querystring';
import styles from './index.less'

const Password: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState ?? {};

  const submit = async (values: ChangePasswordParams) => {
    if (!currentUser?.id) {
      return
    }
    if (values.newPassword !== values.rePassword) {
      message.warning('两次密码输入不一致')
      return
    }
    try {
      const result = await updatePassword({
        ...values,
        id: currentUser.id,
        password: values.newPassword,
      })
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('修改成功')
      setInitialState((s) => ({ ...s, currentUser: undefined }));
      await outLogin();
      const { query = {}, search, pathname } = history.location;
      const { redirect } = query;
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    } catch(error) {
      console.error(error)
      return
    }
  }

  return (
    <PageContainer>
      <div className={styles.password}>
        <div className={styles.title}>
          修改密码
        </div>

        <ProForm
          layout="horizontal"
          labelCol={{ span: 4 }}
          submitter={{
            render: (_, dom) => (
              <div style={{ textAlign: 'center' }}>
                <Space>{dom}</Space>
              </div>
            ),
          }}
          onFinish={submit}
        >
          <ProFormText.Password
            rules={[{ required: true, message: '原密码不能为空' }]}
            label="原密码"
            name="oldPassword"
          />

          <ProFormText.Password
            rules={[{ required: true, message: '新密码不能为空' }, { pattern: /^[\S]{4,12}$/, message: '密码必须4到12位，且不能出现空格' }]}
            label="新密码"
            name="newPassword"
          />

          <ProFormText.Password
            rules={[{ required: true, message: '确认密码不能为空' }, { pattern: /^[\S]{4,12}$/, message: '密码必须4到12位，且不能出现空格' }]}
            label="确认密码"
            name="rePassword"
          />
        </ProForm>
      </div>
    </PageContainer>
  )
}

export default Password;

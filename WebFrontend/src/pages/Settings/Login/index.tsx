import { login } from '@/API/SystemAPI';
import { InfoCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { message, Tooltip } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import styles from './index.less';

const Login: React.FC = () => {
  const [uuid, setUuid] = useState<string>(uuidv4())
  const { initialState, setInitialState } = useModel('@@initialState')

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }))
    }
  }

  const submit = async (values: LoginParams) => {
    try {
      // const msg = await login({
      //   ...values,
      // })
      // const loginResult = msg.datas
      // if (msg.resp_code !== 0) {
      //   message.error(msg.resp_msg)
      //   return
      // }
      // if (loginResult && loginResult.access_token) {
      //   sessionStorage.setItem('access_token', loginResult.access_token)
      // }
      message.success('登录成功！')
      // await fetchUserInfo()
      if (!history) return
      history.push('/')
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！'
      message.error(defaultLoginFailureMessage)
    }
  }

  const captchaUrl = `/api-uaa/validata/code/${uuid}`

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="./logo.png" />}
          title="小推云RPA运营系统"
          subTitle={'欢迎使用'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await submit({
              ...values,
              deviceId: uuid,
            } as LoginParams);
          }}
        >
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'账号'}
              rules={[{ required: true, message: '账号是必填项！' }]}
            />

            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[{ required: true, message: '密码是必填项！' }]}
            />

            <ProFormCaptcha
              name="validCode"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
                suffix: (
                  <Tooltip title="不区分大小写">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                ),
              }}
              captchaProps={{
                size: 'large',
                style: { padding: '0 2px' },
              }}
              placeholder={'验证码'}
              captchaTextRender={() => (
                <span onClick={() => setUuid(uuidv4())}>
                  <img src={captchaUrl} alt="验证码" />
                </span>
              )}
              rules={[{ required: true, message: '请输入验证码！' }]}
              onGetCaptcha={async () => {}}
            />
          </>
        </LoginForm>
      </div>
    </div>
  )
}

export default Login

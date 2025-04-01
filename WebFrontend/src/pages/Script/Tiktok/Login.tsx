import { ProForm, ProFormDateTimeRangePicker, ProFormDependency, ProFormRadio } from '@ant-design/pro-components';
import { message } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, matchOperationType, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { useModel } from 'umi';
import { ScriptParams } from '@/API/ScriptTypings';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';

/**
 * 登录
 * @returns
 */
export const LoginForm = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const formatRequestParams = (values: any): ScriptParams => {
    const valueJson = [
      { type: '2', key: '功能选项', value: matchOperationType(ScriptTypeEnum.Login), options: buildOperationTypeForValueJson() },
      { type: '', key: '登录方式', value: '邮箱', options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.Login,
      platform: PlatformEnum.TK,
      devices: values.equips.map((item: Device) => item.deviceNo),
      valueJson: JSON.stringify(addIdForValueJson(valueJson)),
      scriptAutoTime: values.scriptAutoTime?.[0],
      endTime: values.scriptAutoTime?.[1]
    }
  }

  const submit = async (values: any) => {
    try {
      const params = formatRequestParams(values)
      const result = await executeScript(params)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('提交成功')
    } catch (error) {
      console.error(error)
      return
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <ProForm layout="horizontal" onFinish={submit}>
        <ProForm.Item rules={[{ required: true, message: '设备不能为空' }]} label="设备" name="equips">
          <ModalSelect />
        </ProForm.Item>

        <ProFormRadio.Group
          label="登录方式"
          name="loginAccountMethod"
          options={[{ label: '邮箱', value: 0 }]}
          initialValue={0}
          width="md"
        />

        <ProForm.Group>
          <ProFormRadio.Group
            rules={[{ required: true, message: '不能为空' }]}
            name="scriptTimesetMeth"
            label="启动方式"
            options={[{ label: '立即启动', value: 0 }, { label: '定时启动', value: 1 }]}
            initialValue={0}
          />
          <ProFormDependency name={['scriptTimesetMeth']}>
            {({ scriptTimesetMeth }) => {
              if (scriptTimesetMeth !== 1) return <></>
              return (
                <ProFormDateTimeRangePicker
                  rules={[{ required: true, message: '不能为空' }]}
                  name="scriptAutoTime"
                  label="定时设置"
                />
              )
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
    </div>
  )
}

import { ProForm, ProFormDateTimeRangePicker, ProFormDependency, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { useModel } from 'umi';
import { fetchAllResource } from '@/API/ResourceAPI';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';

const avatarKey = '图片资源'
const nickNameKey = '昵称资源'
const personalSignatureKey = '个人简介资源'

/**
 * 修改头像
 * @returns
 */
export const ModifyAvatar = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const formatRequestParams = (values: any) => {
    const valueJson = [
      { type: '2', key: '功能选项', value: '修改头像', options: buildOperationTypeForValueJson() },
      { type: '', key: '头像', value: values.avatar, options: [] },
      { type: '', key: '昵称', value: values.nickName, options: [] },
      { type: '', key: '个人简介', value: values.personalSignature, options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.ModifyAvatar,
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
    <div style={{ height: '100%', backgroundColor: '#fff', padding: '20px' }}>
      <ProForm  onFinish={submit}>
        <ProForm.Item rules={[{ required: true, message: '设备不能为空' }]} label="设备" name="equips">
          <ModalSelect />
        </ProForm.Item>

        <ProFormSelect
          rules={[{ required: true, message: '头像不能为空' }]}
          label="头像"
          name="avatar"
          placeholder="请选择头像"
          request={async () => {
            const step1 = await fetchAllResource()
            const step2 = step1.filter(item => item.groupName === avatarKey)
            const final = step2.map(item => ({ label: item.name, value: item.name }))
            return final
          }}
          fieldProps={{style: { width: '350px' }}}
        />

        <ProFormSelect
          rules={[{ required: true, message: '昵称不能为空' }]}
          label="昵称"
          name="nickName"
          placeholder="请选择昵称"
          request={async () => {
            const step1 = await fetchAllResource()
            const step2 = step1.filter(item => item.groupName === nickNameKey)
            const final = step2.map(item => ({ label: item.name, value: item.name }))
            return final
          }}
          fieldProps={{style: { width: '350px' }}}
        />

        <ProFormSelect
          rules={[{ required: true, message: '个人简介不能为空' }]}
          label="个人简介"
          name="personalSignature"
          placeholder="请选择简介"
          request={async () => {
            const step1 = await fetchAllResource()
            const step2 = step1.filter(item => item.groupName === personalSignatureKey)
            const final = step2.map(item => ({ label: item.name, value: item.name }))
            return final
          }}
          fieldProps={{style: { width: '350px' }}}
        />

        <ProForm.Group>
          <ProFormRadio.Group
            rules={[{ required: true, message: '不能为空' }]}
            name="scriptTimesetMeth"
            label="启动方式"
            options={[
              { label: '立即启动', value: 0 },
              { label: '定时启动', value: 1 },
            ]}
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

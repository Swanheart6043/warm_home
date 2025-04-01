import { ModalSelect } from "@/components/Select/DeviceSelect"
import { ProForm, ProFormDigit, ProFormRadio, ProFormSelect } from "@ant-design/pro-components"
import { message } from "antd"
import { useModel } from "umi"
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum"
import { executeScript } from "@/API/ScriptAPI"
import { PlatformEnum } from "../../../enum/PlatformEnum"
import { ScriptParams } from "@/API/ScriptTypings"
import { fetchAllResource } from "@/API/ResourceAPI"
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from "../Util"

const agentMethodOptions = [
  { label: '接口模式', value: '接口模式' },
  { label: '方式2', value: '方式2' },
  { label: '方式3', value: '方式3' },
]
const isAgentOptions = [
  {label: '设置代理', value: '设置代理' },
  {label: '取消代理', value: '取消代理'}
]
const ipTxtKey = 'IP资源'

/**
 * 网络设置
 * @returns
 */
export const NetworkSettings = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const verifyNumber = (value: number) => {
    if (value > 100) {
      return Promise.reject('不能大于100')
    }
    if (String(value).includes('.')) {
      return Promise.reject('不能有小数')
    }
    return Promise.resolve(true)
  }

  const formatRequestParams = (values: any): ScriptParams => {
    const valueJson = [
      { type: '2', key: '功能选项', value: '网络设置', options: buildOperationTypeForValueJson() },
      { type: '2', key: '是否代理', value: values.isAgent, options: isAgentOptions.map(item => item.label) },
      { type: '2', key: '代理方式', value: values.agentMethod, options: agentMethodOptions.map(item => item.label) },
      { type: '', key: '网络设置文本导入', value: values.ipTxt, options: [] },
      { type: '', key: '单IP代理上限', value: values.ipMax, options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      operType: ScriptTypeEnum.NetworkSettings,
      platform: PlatformEnum.TK,
      devices: values.equips.map((item: Device) => item.deviceNo),
      isAgent: values.isAgent === '设置代理' ? 0 : 1,
      valueJson: JSON.stringify(addIdForValueJson(valueJson)),
      scriptTimesetMeth: 0,
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
      <ProForm layout="horizontal" onFinish={submit}>
        <ProForm.Item
          rules={[{ required: true, message: '设备不能为空' }]}
          label="设备"
          name="equips"
          labelCol={{ span: 24 }}
        >
          <ModalSelect />
        </ProForm.Item>

        <ProFormRadio.Group
          label="代理方式"
          name="agentMethod"
          initialValue="接口模式"
          options={agentMethodOptions}
          labelCol={{ span: 24 }}
        />

        <ProFormSelect
          rules={[{ required: true, message: '文本不能为空' }]}
          label="IP文本"
          name="ipTxt"
          placeholder="请选择IP文本"
          labelCol={{ span: 24 }}
          request={async () => {
            const resource = await fetchAllResource()
            return resource.filter(item => item.groupName === ipTxtKey)
          }}
          fieldProps={{
            fieldNames: { label: 'name', value: 'name' },
            style: { width: '350px' }
          }}
        />

        <ProFormDigit
          rules={[{ required: true, message: '单IP代理上限不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
          label="单IP代理上限"
          name="ipMax"
          placeholder="请输入代理上限"
          labelCol={{ span: 24 }}
          fieldProps={{
            style: { width: '350px' }
          }}
        />

        <ProFormRadio.Group
          label="是否代理"
          name="isAgent"
          initialValue="设置代理"
          options={isAgentOptions}
        />
      </ProForm>
    </div>
  )
}

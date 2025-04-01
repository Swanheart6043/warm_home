import { ProForm, ProFormDateTimeRangePicker, ProFormDependency, ProFormDigit, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, Space } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { fetchAllResource } from '@/API/ResourceAPI';
import { ScriptParams } from '@/API/ScriptTypings';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';
import { useModel } from 'umi';
import { matchValueMethodName } from '../ValueMethodEnum';

/**
 * 留痕私信
 * @returns
 */
export const MaintainPrivateMessageForm = () => {
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
      { type: '2', key: '功能选项', value: '留痕私信', options: buildOperationTypeForValueJson() },
      { type: '', key: '私信给谁', value: values.whoToSendPrivateMessageTo, options: [] },
      { type: '', key: '账号ID', value: values.leaveAccount, options: [] },
      { type: '', key: '账号ID顺序', value: matchValueMethodName(values.leaveAccountMeth), options: ['随机','顺序'] },
      { type: '', key: '视频链接', value: values.leaveVideoink, options: [] },
      { type: '', key: '视频链接顺序', value: matchValueMethodName(values.leaveVideoinkMeth), options: ['随机','顺序'] },
      { type: '', key: '私信话术导入', value: values.leavePrimsgSctext, options: [] },
      { type: '', key: '私信话术导入顺序', value: matchValueMethodName(values.leavePrimsgMeth), options: ['随机','顺序'] },
      { type: '', key: '每私信多少条', value: values.leavePrimsgNum, options: [] },
      { type: '', key: '休息多少分钟', value: values.leavePrimsgDur, options: [] },
      { type: '', key: '私信总数', value: values.leavePrimsgSumnum, options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.PrivateMessage,
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
        <ProForm.Item rules={[{ required: true, message: '不能为空' }]} label="设备" name="equips">
          <ModalSelect />
        </ProForm.Item>

        <ProFormRadio.Group
          label="私信给谁"
          name="whoToSendPrivateMessageTo"
          options={[
            { label: '自己粉丝私信', value: '自己粉丝私信' },
            { label: '自己视频评论', value: '自己视频评论' },
            { label: '指定视频一级评论区', value: '指定视频一级评论区' },
            { label: '指定视频二级评论', value: '指定视频二级评论' },
          ]}
          initialValue="自己粉丝私信"
          width="md"
        />

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '不能为空' }]}
            label="账号ID导入"
            name="leaveAccount"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === '私信账号资源')
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            label=""
            name="leaveAccountMeth"
            options={[{ label: '随机', value: 0 }, { label: '顺序', value: 1 }]}
            initialValue={0}
            width="md"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '不能为空' }]}
            label="视频链接导入"
            name="leaveVideoink"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === '私信视频链接资源')
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            width="md"
            name="leaveVideoinkMeth"
            label=""
            options={[{ label: '随机', value: 0 }, { label: '顺序', value: 1 }]}
            initialValue={0}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '不能为空' }]}
            name="leavePrimsgSctext"
            label="私信话术导入"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === '私信话术资源')
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            width="md"
            name="leavePrimsgMeth"
            label=""
            options={[{ label: '随机', value: 0 }, { label: '顺序', value: 1 }]}
            initialValue={0}
          />
        </ProForm.Group>

        <ProForm.Group>
          <Space>
            <ProFormDigit
              rules={[{ required: true, message: '不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label="每私信"
              name="leavePrimsgNum"
              addonAfter="条休息"
            />
            <ProFormDigit
              rules={[{ required: true, message: '不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label=""
              name="leavePrimsgDur"
              addonAfter="分钟"
            />
          </Space>
        </ProForm.Group>

        <ProFormText
          rules={[{ required: true, message: '不能为空' }]}
          width="md"
          name="leavePrimsgSumnum"
          label="私信总数"
          placeholder="请输入"
        />

        <ProForm.Group>
          <ProFormRadio.Group
            rules={[{ required: true, message: '不能为空' }]}
            name="scriptTimesetMeth"
            label="启动方式"
            width="md"
            options={[{ label: '立即启动', value: 0 }, { label: '定时启动', value: 1 }]}
            initialValue={0}
          />
          <ProFormDependency name={['scriptTimesetMeth']}>
            {({ scriptTimesetMeth }) => {
              if (scriptTimesetMeth !== 1) return <></>
              return (
                <ProFormDateTimeRangePicker
                  rules={[{ required: true, message: '不能为空' }]}
                  width="md"
                  name="scriptAutoTime"
                  label="定时设置"
                  placeholder="请输入"
                />
              )
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
    </div>
  )
}

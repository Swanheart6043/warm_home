import { ProForm, ProFormCheckbox, ProFormDateTimeRangePicker, ProFormDependency, ProFormDigit, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { message, Space } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { ScriptParams } from '@/API/ScriptTypings';
import { useModel } from 'umi';
import { fetchAllResource } from '@/API/ResourceAPI';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';
import { buildValueMethodForValueJson, matchValueMethodName } from '../ValueMethodEnum';

const accountResourcesKey = '直播间账号资源'
const liveBroadcastRoomNumberResourcesKey = '直播间账号资源'
const interactiveTalkResourcesKey = '直播互动话术资源'

/**
 * 直播维护
 * @returns
 */
export const MaintainLiveBroadcastForm = () => {
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
      { type: '2', key: '功能选项', value: '直播维护', options: buildOperationTypeForValueJson() },
      { type: '', key: '单个直播间浏览时常区间', value: `${values.watchTimeMin}-${values.watchTimeMax}`, options: [] },
      { type: '', key: '总浏览直播间数量', value: `${values.viewCountMin}-${values.viewCountMax}`, options: [] },
      { type: '2', key: '运营方式', value: values.mode, options: ['账号导入', '直播间导入'] },
      { type: '', key: '指定账号', value: values.accountResources, options: [] },
      { type: '2', key: '账号顺序', value: matchValueMethodName(values.accountResourcesSequence), options: buildValueMethodForValueJson() },
      { type: '', key: '指定直播间', value: values.liveBroadcastRoomNumberResources, options: [] },
      { type: '2', key: '直播间顺序', value: matchValueMethodName(values.liveBroadcastRoomNumberResourcesSequence), options: buildValueMethodForValueJson() },
      { type: '', key: '关注比例', value: `${values.followMin}-${values.followMax}`, options: [] },
      { type: '', key: '转发比例', value: `${values.forwardMin}-${values.forwardMax}`, options: [] },
      { type: '', key: '点赞比例', value: `${values.likesMin}-${values.likesMax}`, options: [] },
      { type: '', key: '互动数量', value: `${values.interactionsMin}-${values.interactionsMax}`, options: [] },
      { type: '', key: '互动间隔时长', value: `${values.interactionIntervalMin}-${values.interactionIntervalMax}`, options: [] },
      { type: '', key: '互动话术导入', value: values.interactiveTalkResources, options: [] },
      { type: '2', key: '互动话术导入顺序', value: matchValueMethodName(values.interactiveTalkResourcesSequence), options: buildValueMethodForValueJson() },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.LiveBroadcastRoom,
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
      return
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

        <ProForm.Group>
          <Space>
            <ProFormDigit
              rules={[{ required: true, message: '单个直播间浏览时长区间最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label="单个直播间浏览时长区间"
              name="watchTimeMin"
              addonAfter="至"
            />
            <ProFormDigit
              rules={[{ required: true, message: '单个直播间浏览时长区间最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label=""
              name="watchTimeMax"
              addonAfter="分钟"
            />
          </Space>
        </ProForm.Group>

        <ProForm.Group>
          <Space>
            <ProFormDigit
              rules={[{ required: true, message: '总浏览直播间数量最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label="总浏览直播间数量"
              name="viewCountMin"
              addonAfter="至"
            />
            <ProFormDigit
              rules={[{ required: true, message: '总浏览直播间数量最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
              label=""
              name="viewCountMax"
              addonAfter="个"
            />
          </Space>
        </ProForm.Group>

        <ProFormRadio.Group
          label="运营方式"
          name="mode"
          initialValue="账号导入"
          options={[{ label: '账号导入', value: '账号导入' }, { label: '直播间导入', value: '直播间导入' }]}
          width="md"
        />

        <ProFormDependency name={['mode', 'isAccountResources']}>
          {({ mode }) => {
            if (mode !== '账号导入') return <></>
            return (
              <ProForm.Group>
                <ProFormSelect
                  rules={[{ required: true, message: '账号文本不能为空' }]}
                  label="指定账号ID导入"
                  name="accountResources"
                  placeholder="请选择文本"
                  request={async () => {
                    const resource = await fetchAllResource()
                    return resource.filter(item => item.groupName === accountResourcesKey)
                  }}
                  fieldProps={{
                    style: { width: '150px' },
                    fieldNames: { label: 'name', value: 'name' }
                  }}
                />
                <ProFormRadio.Group
                  width="md"
                  name="accountResourcesSequence"
                  label=""
                  options={[{ label: '随机', value: 0 },{ label: '顺序', value: 1 }]}
                  initialValue={0}
                />
              </ProForm.Group>
            )
          }}
        </ProFormDependency>

        <ProFormDependency name={['mode', 'isLiveBroadcastRoomNumberResources']}>
          {({ mode }) => {
            if (mode !== '直播间导入') return <></>
            return (
              <ProForm.Group>
                <ProFormSelect
                  rules={[{ required: true, message: '直播间文本不能为空' }]}
                  label="指定直播间ID导入"
                  name="liveBroadcastRoomNumberResources"
                  placeholder="请选择文本"
                  request={async () => {
                    const resource = await fetchAllResource()
                    return resource.filter(item => item.groupName === liveBroadcastRoomNumberResourcesKey)
                  }}
                  fieldProps={{
                    style: { width: '150px' },
                    fieldNames: { label: 'name', value: 'name' }
                  }}
                />
                <ProFormRadio.Group
                  width="md"
                  name="liveBroadcastRoomNumberResourcesSequence"
                  label=""
                  options={[{ label: '随机', value: 0 },{ label: '顺序', value: 1 }]}
                  initialValue={0}
                />
              </ProForm.Group>
            )
          }}
        </ProFormDependency>

        <ProForm.Group>
          <ProFormDependency name={['isFollow']}>
            {({ isFollow }) => (
              <Space>
                <ProFormCheckbox width={20} name="isFollow" />
                <ProFormDigit
                  rules={[{ required: isFollow, message: '关注比例最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label="关注比例"
                  name="followMin"
                  placeholder="请输入关注比例最小"
                  addonAfter="-"
                />
                <ProFormDigit
                  rules={[{ required: isFollow, message: '关注比例最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label=""
                  name="followMax"
                  placeholder="请输入关注比例最大"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isForward']}>
            {({ isForward }) => (
              <Space>
                <ProFormCheckbox width={20} name="isForward" />
                <ProFormDigit
                  rules={[{ required: isForward, message: '转发比例最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label="转发比例"
                  name="forwardMin"
                  placeholder="请输入转发比例最小"
                  addonAfter="-"
                />
                <ProFormDigit
                  rules={[{ required: isForward, message: '转发比例最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label=""
                  name="forwardMax"
                  placeholder="请输入转发比例最大"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isLikes']}>
            {({ isLikes }) => (
              <Space>
                <ProFormCheckbox width={20} name="isLikes" />
                <ProFormDigit
                  rules={[{ required: isLikes, message: '点赞比例最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  name="likesMin"
                  label="点赞比例"
                  placeholder="请输入点赞比例最小"
                  addonAfter="-"
                />
                <ProFormDigit
                  rules={[{ required: isLikes, message: '点赞比例最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label=""
                  name="likesMax"
                  placeholder="请输入点赞比例最大"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isInteractions']}>
            {({ isInteractions }) => (
              <Space>
                <ProFormCheckbox width={20} name="isInteractions" />
                <ProFormDigit
                  rules={[{ required: isInteractions, message: '互动数量最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label="互动数量"
                  name="interactionsMin"
                  placeholder="请输入互动数量最大"
                  addonAfter="至"
                />
                <ProFormDigit
                  rules={[{ required: isInteractions, message: '互动数量最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label=""
                  name="interactionsMax"
                  placeholder="请输入点赞比例最大"
                  addonAfter="个"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isInteractionInterval']}>
            {({ isInteractionInterval }) => (
              <Space>
                <ProFormCheckbox width={20} name="" />
                <ProFormDigit
                  rules={[{ required: isInteractionInterval, message: '互动间隔时长最小不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label="互动间隔时长"
                  name="interactionIntervalMin"
                  addonAfter="至"
                />
                <ProFormDigit
                  rules={[{ required: isInteractionInterval, message: '互动间隔时长最大不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label=""
                  name="interactionIntervalMax"
                  addonAfter="秒"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isInteractiveTalk']}>
            {({ isInteractiveTalk }) => (
              <Space>
                <ProFormCheckbox width={20} name="isInteractiveTalk" />
                <ProFormSelect
                  rules={[{ required: isInteractiveTalk, message: '话术不能为空' }]}
                  label="互动话术导入"
                  name="interactiveTalkResources"
                  placeholder="请选择文本"
                  request={async () => {
                    const resource = await fetchAllResource()
                    return resource.filter(item => item.groupName === interactiveTalkResourcesKey)
                  }}
                  fieldProps={{
                    style: { width: '150px' },
                    fieldNames: { label: 'name', value: 'name' }
                  }}
                />
              </Space>
            )}
          </ProFormDependency>
          <ProFormRadio.Group
            width="md"
            name="interactiveTalkResourcesSequence"
            label=""
            options={[{ label: '随机', value: 0 }, { label: '顺序', value: 1 }]}
            initialValue={0}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormRadio.Group
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

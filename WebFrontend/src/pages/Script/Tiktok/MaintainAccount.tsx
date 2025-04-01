import { ProForm, ProFormCheckbox, ProFormDateTimeRangePicker, ProFormDependency, ProFormDigit, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { message, Space } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { useModel } from 'umi';
import { ScriptParams } from '@/API/ScriptTypings';
import { fetchAllResource } from '@/API/ResourceAPI';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';

const numMainverimTextKey = '标签资源'
const numMainspaccoTextKey = '养号账号资源'
const commentScriptTextKey = '养号评论话术资源'

/**
 * 养号
 * @returns
 */
export const MaintainAccountForm = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const verifyNumber = (value: number) => {
    if (String(value).includes('.')) {
      return Promise.reject('不能有小数')
    }
    return Promise.resolve(true)
  }

  const checkForm = (data: any) => {
    if (data.numSwipeVideoMin > data.numSwipeVideoMax) {
      message.warning('刷视频最小数量不能大于，刷视频最大数量')
      return false
    }
    if (data.numMainBegdura > data.numMainEnddura) {
      message.warning('单视频观看最小时长不能大于，单视频观看最大时长')
      return false
    }
    if (data.isLikesProport && data.likesProportMin > data.likesProportMax) {
      message.warning('点赞比例最小不能大于，点赞比例最大')
      return false
    }
    if (data.isFollowersProport && data.followersProportMin > data.followersProportMax) {
      message.warning('关注比例最小不能大于，关注比例最大')
      return false
    }
    if (data.isCollectionProport && data.collectionProportMin > data.collectionProportMax) {
      message.warning('收藏比例最小不能大于，收藏比例最大')
      return false
    }
    if (data.isCommentsNum && data.commentsProportMin > data.commentsProportMax) {
      message.warning('评论比例最小不能大于，评论比例最大')
      return false
    }
    return true
  }

  const formatRequestParams = (values: any): ScriptParams => {
    const matchNumMainMeth = (value?: number | string) => {
      if (value == 0) return '随机养号'
      if (value == 1) return '标签养号'
      if (value == 2) return '指定养号'
      return ''
    }
    const matchMeth = (value?: number | string) => {
      if (value == 0) return '随机'
      if (value == 1) return '顺序'
      return ''
    }
    const valueJson = [
      { type: '2', key: '功能选项', value: matchNumMainMeth(values.numMainMeth), options: buildOperationTypeForValueJson() },
      { type: '', key: '刷视频数量', value: `${values.numSwipeVideoMin}-${values.numSwipeVideoMax}`, options: [] },
      { type: '', key: '单视频观看时长', value: `${values.numMainBegdura}-${values.numMainEnddura}`, options: [] },
      { type: '', key: '点赞比例', value: values.isLikesProport ? values.likesProportMin : 0, options: [] },
      { type: '', key: '关注比例', value: values.isFollowersProport ? values.followersProportMin : 0, options: [] },
      { type: '', key: '收藏比例', value: values.isCollectionProport ? values.collectionProportMin : 0, options: [] },
      { type: '', key: '评论比例', value: values.isCommentsNum ? values.commentsProportMin : 0, options: [] },
      { type: '2', key: '评论话术选取方式', value: matchMeth(values.commentScriptMeth), options: ['随机','顺序'] },
      { type: '', key: '评论话术', value: values.commentScriptText, options: [] },
      { type: '2', key: '指定titok号选取方式', value: matchMeth(values.numMainspaccoMeth), options: ['随机','顺序'] },
      { type: '', key: '指定titok号', value: values.numMainspaccoText, options: [] },
      { type: '2', key: '标签词选取方式', value: matchMeth(values.numMainverimMeth), options: ['随机','顺序'] },
      { type: '', key: '标签词', value: values.numMainverimText, options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.MaintainAccount,
      platform: PlatformEnum.TK,
      devices: values.equips.map((item: Device) => item.deviceNo),
      numMainverimText: values.numMainverimText,
      numMainspaccoText: values.numMainspaccoText,
      commentScriptText: values.commentScriptText,
      likesProportMin: values.isLikesProport ? values.likesProportMin : 0,
      likesProportMax: 0,
      followersProportMin: values.isFollowersProport ? values.followersProportMin : 0,
      followersProportMax: 0,
      collectionProportMin: values.isCollectionProport ? values.collectionProportMin : 0,
      collectionProportMax: 0,
      commentsProportMin: values.isCommentsProport ? values.commentsProportMin : 0,
      commentsProportMax: 0,
      valueJson: JSON.stringify(addIdForValueJson(valueJson)),
      scriptAutoTime: values.scriptAutoTime?.[0],
      endTime: values.scriptAutoTime?.[1]
    }
  }

  const submit = async (values: any) => {
    try {
      const valid = checkForm(values)
      if (!valid) return
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
          label="养号方式"
          name="numMainMeth"
          options={[{label: '随机养号', value: 0}, {label: '垂直养号', value: 1}, {label: '指定养号', value: 2}]}
          initialValue={0}
        />

        <ProForm.Group>
          <ProFormDigit
            label="刷视频最小数量"
            name="numSwipeVideoMin"
            rules={[{ required: true, message: '不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
          />
          <ProFormDigit
            label="刷视频最大数量"
            name="numSwipeVideoMax"
            rules={[{ required: true, message: '不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDigit
            label="单视频观看最小时长"
            name="numMainBegdura"
            rules={[{ required: true, message: '不能为空' }]}
          />
          <ProFormDigit
            label="单视频观看最大时长"
            name="numMainEnddura"
            rules={[{ required: true, message: '不能为空' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '标签不能为空' }]}
            label="垂直标签"
            name="numMainverimText"
            placeholder="请选择文本"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === numMainverimTextKey)
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            name="numMainverimMeth"
            options={[{label: '随机', value: 0}, {label: '顺序', value: 1}]}
            initialValue={0}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '账号不能为空' }]}
            label="指定账号ID"
            name="numMainspaccoText"
            placeholder="请选择文本"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === numMainspaccoTextKey)
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            name="numMainspaccoMeth"
            options={[{label: '随机', value: 0}, {label: '顺序', value: 1}]}
            initialValue={0}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isLikesProport']}>
            {({ isLikesProport }) => (
              <Space>
                <ProFormCheckbox width={20} name="isLikesProport" />
                <ProFormDigit
                  rules={[{ required: isLikesProport, message: '点赞比例不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  name="likesProportMin"
                  label="点赞比例"
                  placeholder="请输入点赞比例"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isFollowersProport']}>
            {({ isFollowersProport }) => (
              <Space>
                <ProFormCheckbox width={20} name="isFollowersProport" />
                <ProFormDigit
                  rules={[{ required: isFollowersProport, message: '关注比例不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  name="followersProportMin"
                  label="关注比例"
                  placeholder="请输入关注比例"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isCollectionProport']}>
            {({ isCollectionProport }) => (
              <Space>
                <ProFormCheckbox width={20} name="isCollectionProport" />
                <ProFormDigit
                  rules={[{ required: isCollectionProport, message: '收藏比例不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  name="collectionProportMin"
                  label="收藏比例"
                  placeholder="请输入收藏比例"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormDependency name={['isCommentsNum']}>
            {({ isCommentsNum }) => (
              <Space>
                <ProFormCheckbox width={20} name="isCommentsNum" />
                <ProFormDigit
                  rules={[{ required: isCommentsNum, message: '评论比例不能为空' }, { validator: (_, value) => verifyNumber(value) }]}
                  label="评论比例"
                  name="commentsProportMin"
                  placeholder="请输入评论比例"
                  addonAfter="%"
                />
              </Space>
            )}
          </ProFormDependency>
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            rules={[{ required: true, message: '评论不能为空' }]}
            label="评论话术"
            name="commentScriptText"
            placeholder="请选择文本"
            request={async () => {
              const step1 = await fetchAllResource()
              const step2 = step1.filter(item => item.groupName === commentScriptTextKey)
              const final = step2.map(item => ({ label: item.name, value: item.name }))
              return final
            }}
            fieldProps={{style: { width: '150px' }}}
          />
          <ProFormRadio.Group
            name="commentScriptMeth"
            options={[{label: '随机', value: 0}, {label: '顺序', value: 1}]}
            initialValue={0}
          />
        </ProForm.Group>

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
                />
              )
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
    </div>
  )
}
